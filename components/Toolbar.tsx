
import React from 'react';
import { 
  Square, 
  Circle, 
  Type, 
  ArrowRight, 
  Minus, 
  Pencil, 
  Eraser, 
  MousePointer2,
  Diamond,
  Hand
} from 'lucide-react';
import { Tool } from '../types';

interface ToolbarProps {
  activeTool: Tool;
  onSelectTool: (tool: Tool) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onSelectTool }) => {
  const tools = [
    { id: 'selection', icon: <MousePointer2 size={18} />, label: 'Selection (V)' },
    { id: 'hand', icon: <Hand size={18} />, label: 'Hand (H)' },
    { id: 'rectangle', icon: <Square size={18} />, label: 'Rectangle (R)' },
    { id: 'diamond', icon: <Diamond size={18} />, label: 'Diamond (D)' },
    { id: 'circle', icon: <Circle size={18} />, label: 'Circle (O)' },
    { id: 'arrow', icon: <ArrowRight size={18} />, label: 'Arrow (A)' },
    { id: 'line', icon: <Minus size={18} />, label: 'Line (L)' },
    { id: 'draw', icon: <Pencil size={18} />, label: 'Draw (P)' },
    { id: 'text', icon: <Type size={18} />, label: 'Text (T)' },
    { id: 'eraser', icon: <Eraser size={18} />, label: 'Eraser (E)' },
  ];

  return (
    <div className="flex items-center gap-0.5 pointer-events-auto bg-zinc-50 dark:bg-zinc-800/50 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onSelectTool(tool.id as Tool)}
          className={`p-2 rounded-md transition-all flex items-center justify-center group relative ${
            activeTool === tool.id 
              ? 'bg-indigo-600 text-white shadow-md scale-105' 
              : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
          }`}
          title={tool.label}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
