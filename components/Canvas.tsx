
import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { Element, Tool, Point } from '../types';
import { awsIcons } from '../data/aws-icons';

interface CanvasProps {
  elements: Element[];
  setElements: (elements: Element[]) => void;
  tool: Tool;
  isDarkMode: boolean;
  strokeColor: string;
  backgroundColor: string;
  onElementSelect: (id: string | null) => void;
  selectedElementId: string | null;
  scale: number;
  offset: Point;
  setOffset: (offset: Point) => void;
}

const Canvas: React.FC<CanvasProps> = ({ 
  elements, 
  setElements, 
  tool, 
  isDarkMode,
  strokeColor,
  backgroundColor,
  onElementSelect,
  selectedElementId,
  scale,
  offset,
  setOffset
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<Element | null>(null);
  const [lastPointer, setLastPointer] = useState<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rc = rough.canvas(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    if (isDarkMode) {
      drawGrid(ctx, canvas.width / scale + Math.abs(offset.x), canvas.height / scale + Math.abs(offset.y), '#27272a');
    } else {
      drawGrid(ctx, canvas.width / scale + Math.abs(offset.x), canvas.height / scale + Math.abs(offset.y), '#f4f4f5');
    }

    elements.forEach(element => {
      drawElement(rc, ctx, element, element.id === selectedElementId);
    });

    if (currentElement) {
      drawElement(rc, ctx, currentElement, false);
    }
    ctx.restore();
  }, [elements, currentElement, isDarkMode, selectedElementId, scale, offset]);

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    const step = 20;
    const startX = Math.floor(-offset.x / scale / step) * step;
    const startY = Math.floor(-offset.y / scale / step) * step;
    const endX = startX + window.innerWidth / scale + step * 2;
    const endY = startY + window.innerHeight / scale + step * 2;

    for (let x = startX; x < endX; x += step) {
      for (let y = startY; y < endY; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawElement = (rc: any, ctx: CanvasRenderingContext2D, element: Element, isSelected: boolean) => {
    const options = {
      stroke: element.strokeColor,
      fill: element.backgroundColor === 'transparent' ? undefined : element.backgroundColor,
      strokeWidth: element.strokeWidth,
      roughness: element.roughness,
      opacity: element.opacity / 100,
      fillStyle: element.fillStyle,
      strokeLineDash: element.strokeStyle === 'dashed' ? [12, 8] : element.strokeStyle === 'dotted' ? [2, 4] : undefined,
      seed: element.seed
    };

    if (isSelected) {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1 / scale;
      const margin = 10 / scale;
      const x = Math.min(element.x1, element.x2) - margin;
      const y = Math.min(element.y1, element.y2) - margin;
      const w = Math.abs(element.x1 - element.x2) + margin * 2;
      const h = Math.abs(element.y1 - element.y2) + margin * 2;
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
    }

    switch (element.type) {
      case 'rectangle':
        rc.rectangle(element.x1, element.y1, element.x2 - element.x1, element.y2 - element.y1, options);
        break;
      case 'circle':
        const cx = (element.x1 + element.x2) / 2;
        const cy = (element.y1 + element.y2) / 2;
        const r = Math.sqrt(Math.pow(element.x2 - element.x1, 2) + Math.pow(element.y2 - element.y1, 2)) / 2;
        rc.circle(cx, cy, r * 2, options);
        break;
      case 'diamond':
        const midX = (element.x1 + element.x2) / 2;
        const midY = (element.y1 + element.y2) / 2;
        rc.polygon([[midX, element.y1], [element.x2, midY], [midX, element.y2], [element.x1, midY]], options);
        break;
      case 'line':
        rc.line(element.x1, element.y1, element.x2, element.y2, options);
        break;
      case 'arrow':
        const angle = Math.atan2(element.y2 - element.y1, element.x2 - element.x1);
        rc.line(element.x1, element.y1, element.x2, element.y2, options);
        const headlen = 15 / scale;
        rc.line(element.x2, element.y2, element.x2 - headlen * Math.cos(angle - Math.PI / 6), element.y2 - headlen * Math.sin(angle - Math.PI / 6), options);
        rc.line(element.x2, element.y2, element.x2 - headlen * Math.cos(angle + Math.PI / 6), element.y2 - headlen * Math.sin(angle + Math.PI / 6), options);
        break;
      case 'draw':
        if (element.points) {
          const path = element.points.map(p => [p.x, p.y] as [number, number]);
          rc.linearPath(path, options);
        }
        break;
      case 'text':
        ctx.font = `${(element.strokeWidth * 8 + 12)}px Virgil`;
        ctx.fillStyle = element.strokeColor;
        ctx.textBaseline = 'top';
        ctx.fillText(element.text || '', element.x1, element.y1);
        break;
      case 'aws-icon':
        if (element.iconKey && awsIcons[element.iconKey]) {
          const icon = awsIcons[element.iconKey];
          const width = element.x2 - element.x1;
          const height = element.y2 - element.y1;
          
          ctx.save();
          ctx.translate(element.x1, element.y1);
          // Standard AWS icons are 24x24 in my definition
          ctx.scale(width / 24, height / 24); 
          
          const p = new Path2D(icon.path);
          ctx.fillStyle = icon.fill;
          if (element.backgroundColor !== 'transparent') {
             // Optional: Fill background behind icon if needed, or override icon color
             // For now, let's keep original branded colors unless overridden?
             // Actually, let's let strokeColor override if set to something other than transparent/default? 
             // nah, branded icons usually stay branded.
          }
          ctx.fill(p);
          ctx.restore();
          
          // Draw label below
          ctx.font = `10px Virgil`;
          ctx.fillStyle = '#666';
          ctx.textAlign = 'center';
          ctx.fillText(icon.name, element.x1 + width/2, element.y1 + height + 12);
        }
        break;
    }
  };

  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    return {
      x: (clientX - offset.x) / scale,
      y: (clientY - offset.y) / scale,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const { clientX, clientY } = e;
    const { x, y } = getCanvasCoordinates(clientX, clientY);
    
    setLastPointer({ x: clientX, y: clientY });
    setIsDrawing(true);

    if (tool === 'hand' || (tool === 'selection' && e.shiftKey)) {
      return;
    }

    if (tool === 'selection') {
      const clickedElement = [...elements].reverse().find(el => {
        const minX = Math.min(el.x1, el.x2) - 5 / scale;
        const maxX = Math.max(el.x1, el.x2) + 5 / scale;
        const minY = Math.min(el.y1, el.y2) - 5 / scale;
        const maxY = Math.max(el.y1, el.y2) + 5 / scale;
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      });
      onElementSelect(clickedElement?.id || null);
      if (!clickedElement) setIsDrawing(false);
      return;
    }

    const id = Date.now().toString();
    const newElement: Element = {
      id,
      type: tool,
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      points: tool === 'draw' ? [{ x, y }] : undefined,
      strokeColor,
      backgroundColor,
      strokeWidth: 2,
      roughness: 1,
      opacity: 100,
      fillStyle: 'hachure',
      strokeStyle: 'solid',
      edgeStyle: 'round',
      seed: Math.floor(Math.random() * 1000000),
      text: tool === 'text' ? prompt('Enter text:') || '' : undefined
    };

    if (tool === 'text' && !newElement.text) {
      setIsDrawing(false);
      return;
    }

    if (tool === 'text') {
      setElements([...elements, newElement]);
      onElementSelect(id);
      setIsDrawing(false);
    } else {
      setCurrentElement(newElement);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const { clientX, clientY } = e;
    const { x, y } = getCanvasCoordinates(clientX, clientY);

    if (isDrawing && (tool === 'hand' || (tool === 'selection' && lastPointer && e.shiftKey))) {
      if (lastPointer) {
        setOffset({
          x: offset.x + (clientX - lastPointer.x),
          y: offset.y + (clientY - lastPointer.y),
        });
        setLastPointer({ x: clientX, y: clientY });
      }
      return;
    }

    if (!isDrawing || !currentElement) return;

    if (tool === 'draw') {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), { x, y }],
        x2: Math.max(currentElement.x2, x),
        y2: Math.max(currentElement.y2, y),
        x1: Math.min(currentElement.x1, x),
        y1: Math.min(currentElement.y1, y),
      });
    } else {
      setCurrentElement({ ...currentElement, x2: x, y2: y });
    }
  };

  const handlePointerUp = () => {
    if (currentElement) {
      setElements([...elements, currentElement]);
    }
    setIsDrawing(false);
    setCurrentElement(null);
    setLastPointer(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`block ${tool === 'hand' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}
    />
  );
};

export default Canvas;
