
import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { Element, Tool, Point, FillStyle, StrokeStyle, EdgeStyle } from '../types';
import { awsIcons } from '../data/aws-icons';

interface CanvasProps {
  elements: Element[];
  setElementsImmediate: (elements: Element[]) => void;
  commitElements: (elements: Element[]) => void;
  tool: Tool;
  isDarkMode: boolean;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  roughness: number;
  fillStyle: FillStyle;
  strokeStyle: StrokeStyle;
  edgeStyle: EdgeStyle;
  onElementSelect: (id: string | null) => void;
  selectedElementId: string | null;
  scale: number;
  offset: Point;
  setOffset: (offset: Point) => void;
}

type ResizeHandle = 'nw' | 'ne' | 'se' | 'sw';
type Interaction =
  | { type: 'none' }
  | { type: 'pan'; lastClient: Point }
  | { type: 'drag'; elementId: string; start: Point; origin: { x1: number; y1: number; x2: number; y2: number } }
  | { type: 'resize'; elementId: string; handle: ResizeHandle; start: Point; origin: { x1: number; y1: number; x2: number; y2: number } };

const Canvas: React.FC<CanvasProps> = ({ 
  elements, 
  setElementsImmediate,
  commitElements,
  tool, 
  isDarkMode,
  strokeColor,
  backgroundColor,
  strokeWidth,
  roughness,
  fillStyle,
  strokeStyle,
  edgeStyle,
  onElementSelect,
  selectedElementId,
  scale,
  offset,
  setOffset
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentElement, setCurrentElement] = useState<Element | null>(null);
  const [interaction, setInteraction] = useState<Interaction>({ type: 'none' });
  const [hasLiveEdits, setHasLiveEdits] = useState(false);
  const latestElementsRef = useRef<Element[]>(elements);

  useEffect(() => {
    latestElementsRef.current = elements;
  }, [elements]);

  const setElementsImmediateWithRef = (next: Element[]) => {
    latestElementsRef.current = next;
    setElementsImmediate(next);
  };

  const distanceToSegment = (p: Point, v: Point, w: Point) => {
    const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const proj = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
    return Math.hypot(p.x - proj.x, p.y - proj.y);
  };

  const hitTestElement = (el: Element, x: number, y: number) => {
    const basePad = 10 / scale;
    const strokePad = (el.strokeWidth || 1) / scale;
    const pad = basePad + strokePad;

    if (el.type === 'line' || el.type === 'arrow') {
      return distanceToSegment({ x, y }, { x: el.x1, y: el.y1 }, { x: el.x2, y: el.y2 }) <= pad;
    }

    if (el.type === 'draw' && el.points && el.points.length > 1) {
      for (let i = 0; i < el.points.length - 1; i++) {
        const a = el.points[i];
        const b = el.points[i + 1];
        if (distanceToSegment({ x, y }, a, b) <= pad) return true;
      }
      return false;
    }

    const { x1, y1, x2, y2 } = getElementBounds(el);
    return x >= x1 - pad && x <= x2 + pad && y >= y1 - pad && y <= y2 + pad;
  };

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

    ctx.lineJoin = element.edgeStyle === 'round' ? 'round' : 'miter';
    ctx.lineCap = element.edgeStyle === 'round' ? 'round' : 'butt';

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
          const [_, __, vbwRaw, vbhRaw] = (icon.viewBox || '0 0 24 24').split(/\s+/);
          const vbw = Number(vbwRaw) || 24;
          const vbh = Number(vbhRaw) || 24;

          const s = Math.min(Math.abs(width) / vbw, Math.abs(height) / vbh);
          const dx = (width - vbw * s) / 2;
          const dy = (height - vbh * s) / 2;

          ctx.translate(element.x1 + dx, element.y1 + dy);
          ctx.scale(s, s);
          
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
          ctx.font = `${10 / scale}px Virgil`;
          ctx.fillStyle = isDarkMode ? '#a1a1aa' : '#666';
          ctx.textAlign = 'center';
          ctx.fillText(icon.name, element.x1 + width / 2, element.y1 + height + 12 / scale);
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

  const getElementBounds = (el: Element) => {
    const x1 = Math.min(el.x1, el.x2);
    const y1 = Math.min(el.y1, el.y2);
    const x2 = Math.max(el.x1, el.x2);
    const y2 = Math.max(el.y1, el.y2);
    return { x1, y1, x2, y2 };
  };

  const hitTestResizeHandle = (el: Element, x: number, y: number): ResizeHandle | null => {
    const { x1, y1, x2, y2 } = getElementBounds(el);
    const handleRadius = 14 / scale;
    const corners: Array<{ h: ResizeHandle; cx: number; cy: number }> = [
      { h: 'nw', cx: x1, cy: y1 },
      { h: 'ne', cx: x2, cy: y1 },
      { h: 'se', cx: x2, cy: y2 },
      { h: 'sw', cx: x1, cy: y2 },
    ];
    for (const c of corners) {
      if (Math.abs(x - c.cx) <= handleRadius && Math.abs(y - c.cy) <= handleRadius) return c.h;
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const { clientX, clientY } = e;
    const { x, y } = getCanvasCoordinates(clientX, clientY);

    if (tool === 'hand' || (tool === 'selection' && e.shiftKey)) {
      setInteraction({ type: 'pan', lastClient: { x: clientX, y: clientY } });
      return;
    }

    if (tool === 'selection') {
      const clickedElement = [...elements].reverse().find(el => {
        return hitTestElement(el, x, y);
      });
      onElementSelect(clickedElement?.id || null);
      if (!clickedElement) {
        setInteraction({ type: 'none' });
        return;
      }

      const handle = hitTestResizeHandle(clickedElement, x, y);
      if (handle) {
        setInteraction({
          type: 'resize',
          elementId: clickedElement.id,
          handle,
          start: { x, y },
          origin: { x1: clickedElement.x1, y1: clickedElement.y1, x2: clickedElement.x2, y2: clickedElement.y2 },
        });
      } else {
        setInteraction({
          type: 'drag',
          elementId: clickedElement.id,
          start: { x, y },
          origin: { x1: clickedElement.x1, y1: clickedElement.y1, x2: clickedElement.x2, y2: clickedElement.y2 },
        });
      }
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
      strokeWidth,
      roughness,
      opacity: 100,
      fillStyle,
      strokeStyle,
      edgeStyle,
      seed: Math.floor(Math.random() * 1000000),
      text: tool === 'text' ? prompt('Enter text:') || '' : undefined
    };

    if (tool === 'text' && !newElement.text) {
      return;
    }

    if (tool === 'text') {
      commitElements([...elements, newElement]);
      onElementSelect(id);
    } else {
      setCurrentElement(newElement);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const { clientX, clientY } = e;
    const { x, y } = getCanvasCoordinates(clientX, clientY);

    if (interaction.type === 'pan') {
      const lastPointer = interaction.lastClient;
      setOffset({
        x: offset.x + (clientX - lastPointer.x),
        y: offset.y + (clientY - lastPointer.y),
      });
      setInteraction({ type: 'pan', lastClient: { x: clientX, y: clientY } });
      return;
    }

    if (interaction.type === 'drag') {
      const dx = x - interaction.start.x;
      const dy = y - interaction.start.y;
      const next = elements.map(el => {
        if (el.id !== interaction.elementId) return el;
        return {
          ...el,
          x1: interaction.origin.x1 + dx,
          y1: interaction.origin.y1 + dy,
          x2: interaction.origin.x2 + dx,
          y2: interaction.origin.y2 + dy,
        };
      });
      setElementsImmediateWithRef(next);
      setHasLiveEdits(true);
      return;
    }

    if (interaction.type === 'resize') {
      const minSize = 10 / scale;
      let { x1, y1, x2, y2 } = interaction.origin;

      if (interaction.handle === 'nw') {
        x1 = x;
        y1 = y;
      } else if (interaction.handle === 'ne') {
        x2 = x;
        y1 = y;
      } else if (interaction.handle === 'se') {
        x2 = x;
        y2 = y;
      } else if (interaction.handle === 'sw') {
        x1 = x;
        y2 = y;
      }

      const w = Math.abs(x2 - x1);
      const h = Math.abs(y2 - y1);
      if (w < minSize) x2 = x1 + Math.sign(x2 - x1 || 1) * minSize;
      if (h < minSize) y2 = y1 + Math.sign(y2 - y1 || 1) * minSize;

      const next = elements.map(el => (el.id === interaction.elementId ? { ...el, x1, y1, x2, y2 } : el));
      setElementsImmediateWithRef(next);
      setHasLiveEdits(true);
      return;
    }

    if (!currentElement) return;

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

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLCanvasElement).releasePointerCapture(e.pointerId);
    } catch {
      // no-op
    }
    if (currentElement) {
      const nextElements = [...latestElementsRef.current, currentElement];
      commitElements(nextElements);
      onElementSelect(currentElement.id);
    }
    setCurrentElement(null);

    if (hasLiveEdits) {
      commitElements(latestElementsRef.current);
      setHasLiveEdits(false);
    }
    setInteraction({ type: 'none' });
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`block ${tool === 'hand' ? 'cursor-grab active:cursor-grabbing' : tool === 'selection' ? 'cursor-default' : 'cursor-crosshair'}`}
    />
  );
};

export default Canvas;
