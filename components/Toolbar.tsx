import React, { useState, useRef, useEffect } from 'react';
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
  Hand,
  Lock,
  Image as ImageIcon,
  MoreHorizontal,
  Frame,
  Code,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Tool } from '../types';

interface ToolbarProps {
  activeTool: Tool;
  onSelectTool: (tool: Tool) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onSelectTool }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ToolButton = ({ 
    id, 
    icon, 
    label, 
    shortcut, 
    isActive, 
    onClick 
  }: { 
    id: string; 
    icon: React.ReactNode; 
    label: string; 
    shortcut?: string; 
    isActive: boolean; 
    onClick: () => void; 
  }) => (
    <button
      onClick={onClick}
      className={`
        relative group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all
        ${isActive 
          ? 'bg-indigo-100/80 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-300' 
          : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
        }
      `}
      title={`${label} ${shortcut ? `(${shortcut})` : ''}`}
    >
      {icon}
      {shortcut && (
        <span className="absolute bottom-0.5 right-1 text-[9px] font-medium opacity-60 font-mono">
          {shortcut}
        </span>
      )}
    </button>
  );

  const Separator = () => (
    <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 self-center" />
  );

  const DropdownItem = ({ icon, label, shortcut, badge }: any) => (
    <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left">
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
        {badge && (
          <span className="px-1.5 py-0.5 text-[0.6rem] font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-full uppercase">
            {badge}
          </span>
        )}
      </div>
      {shortcut && <span className="text-xs text-zinc-400 font-mono">{shortcut}</span>}
    </button>
  );

  return (
    <div className="relative">
      <div className="flex items-stretch gap-0.5 bg-white dark:bg-zinc-900 p-1.5 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
        
        {/* Group 1: Lock */}
        <button
          onClick={() => setIsLocked(!isLocked)}
          className={`
            relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all
            ${isLocked 
              ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
              : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }
          `}
          title="Keep selected tool active after drawing"
        >
          <Lock size={18} />
        </button>

        <Separator />

        {/* Group 2: Panning & Selection */}
        <ToolButton 
          id="hand" 
          icon={<Hand size={18} />} 
          label="Hand tool" 
          shortcut="H"
          isActive={activeTool === 'hand'}
          onClick={() => onSelectTool('hand')}
        />
        <ToolButton 
          id="selection" 
          icon={<MousePointer2 size={18} />} 
          label="Selection" 
          shortcut="1"
          isActive={activeTool === 'selection'}
          onClick={() => onSelectTool('selection')}
        />

        <Separator />

        {/* Group 3: Shapes */}
        <ToolButton id="rectangle" icon={<Square size={18} />} label="Rectangle" shortcut="2" isActive={activeTool === 'rectangle'} onClick={() => onSelectTool('rectangle')} />
        <ToolButton id="diamond" icon={<Diamond size={18} />} label="Diamond" shortcut="3" isActive={activeTool === 'diamond'} onClick={() => onSelectTool('diamond')} />
        <ToolButton id="circle" icon={<Circle size={18} />} label="Circle" shortcut="4" isActive={activeTool === 'circle'} onClick={() => onSelectTool('circle')} />
        <ToolButton id="arrow" icon={<ArrowRight size={18} />} label="Arrow" shortcut="5" isActive={activeTool === 'arrow'} onClick={() => onSelectTool('arrow')} />
        <ToolButton id="line" icon={<Minus size={18} />} label="Line" shortcut="6" isActive={activeTool === 'line'} onClick={() => onSelectTool('line')} />

        <Separator />

        {/* Group 4: Creation */}
        <ToolButton id="draw" icon={<Pencil size={18} />} label="Draw" shortcut="7" isActive={activeTool === 'draw'} onClick={() => onSelectTool('draw')} />
        <ToolButton id="text" icon={<Type size={18} />} label="Text" shortcut="8" isActive={activeTool === 'text'} onClick={() => onSelectTool('text')} />
        <ToolButton id="image" icon={<ImageIcon size={18} />} label="Image" shortcut="9" isActive={false} onClick={() => alert("Image upload coming soon!")} />
        <ToolButton id="eraser" icon={<Eraser size={18} />} label="Eraser" shortcut="0" isActive={activeTool === 'eraser'} onClick={() => onSelectTool('eraser')} />

        <Separator />

        {/* Group 5: More */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowMore(!showMore)}
            className={`
              flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all
              ${showMore 
                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100' 
                : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }
            `}
          >
            <MoreHorizontal size={18} />
          </button>

          {/* Dropdown Menu */}
          {showMore && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
               <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Extra Tools</div>
               <DropdownItem icon={<Frame size={16} />} label="Frame tool" shortcut="F" />
               <DropdownItem icon={<Code size={16} />} label="Web Embed" />
               <DropdownItem icon={<Sparkles size={16} />} label="Laser pointer" shortcut="K" />
               <div className="my-1 h-[1px] bg-zinc-100 dark:bg-zinc-800" />
               <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Generate</div>
               <DropdownItem icon={<Sparkles size={16} />} label="Text to diagram" badge="AI" />
               <DropdownItem icon={<Code size={16} />} label="Mermaid to Diagram" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
