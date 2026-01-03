
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Sparkles, 
  Wand2, 
  ChevronLeft, 
  ChevronRight,
  Minus,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type as TypeIcon,
  Circle as CircleIcon,
  Square as SquareIcon,
  MousePointer2
} from 'lucide-react';
import { Element, Tool, FillStyle, StrokeStyle, EdgeStyle } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedElement: Element | null;
  onUpdateElement: (updates: Partial<Element>) => void;
  isDarkMode: boolean;
  onAIGenerate: (newElements: any[]) => void;
  // Fallback defaults when no selection
  defaultStrokeColor: string;
  setDefaultStrokeColor: (c: string) => void;
  defaultBackgroundColor: string;
  setDefaultBackgroundColor: (c: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen, setIsOpen,
  selectedElement,
  onUpdateElement,
  isDarkMode,
  onAIGenerate,
  defaultStrokeColor, setDefaultStrokeColor,
  defaultBackgroundColor, setDefaultBackgroundColor
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync internal state with either selected element or defaults
  const activeStrokeColor = selectedElement?.strokeColor || defaultStrokeColor;
  const activeBackgroundColor = selectedElement?.backgroundColor || defaultBackgroundColor;
  const activeStrokeWidth = selectedElement?.strokeWidth || 2;
  const activeRoughness = selectedElement?.roughness || 1;
  const activeOpacity = selectedElement?.opacity || 100;
  const activeFillStyle = selectedElement?.fillStyle || 'hachure';
  const activeStrokeStyle = selectedElement?.strokeStyle || 'solid';
  const activeEdgeStyle = selectedElement?.edgeStyle || 'round';

  const updateProp = (key: keyof Element, value: any) => {
    if (selectedElement) {
      onUpdateElement({ [key]: value });
    } else {
      if (key === 'strokeColor') setDefaultStrokeColor(value);
      if (key === 'backgroundColor') setDefaultBackgroundColor(value);
    }
  };

  const colors = [
    '#ffffff', '#000000', '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7'
  ];

  const handleAISuggest = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a set of whiteboard elements (JSON format) representing: ${prompt}. 
        Return an array of elements. Each element should have: 
        type (rectangle, circle, diamond, line, arrow), 
        x1, y1, x2, y2 (coordinates 0-1000),
        strokeColor (hex), strokeWidth (1-5).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                x1: { type: Type.NUMBER },
                y1: { type: Type.NUMBER },
                x2: { type: Type.NUMBER },
                y2: { type: Type.NUMBER },
                strokeColor: { type: Type.STRING },
                strokeWidth: { type: Type.NUMBER }
              },
              required: ['type', 'x1', 'y1', 'x2', 'y2']
            }
          }
        }
      });

      const data = JSON.parse(response.text);
      const generated = data.map((item: any) => ({
        ...item,
        id: Math.random().toString(),
        backgroundColor: 'transparent',
        roughness: 1,
        opacity: 100,
        fillStyle: 'hachure',
        strokeStyle: 'solid',
        edgeStyle: 'round',
        seed: Math.floor(Math.random() * 1000000)
      }));
      onAIGenerate(generated);
      setPrompt('');
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const OptionButton = ({ active, onClick, children, title }: any) => (
    <button
      title={title}
      onClick={onClick}
      className={`p-2 rounded-lg transition-all flex items-center justify-center ${
        active 
          ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 shadow-sm' 
          : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className={`fixed top-0 left-0 h-full z-20 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className={`w-64 h-full shadow-2xl border-r p-4 custom-scrollbar overflow-y-auto ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
        
        <div className="flex flex-col gap-6 mt-12">
          {/* Stroke Section */}
          <section>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">Stroke</label>
            <div className="flex gap-1.5 flex-wrap">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => updateProp('strokeColor', color)}
                  className={`w-6 h-6 rounded-md border-2 border-zinc-400 transition-all ${activeStrokeColor === color ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </section>

          {/* Background Section */}
          <section>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">Background</label>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => updateProp('backgroundColor', 'transparent')}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center relative bg-zinc-50 dark:bg-zinc-800 ${activeBackgroundColor === 'transparent' ? 'border-indigo-500' : 'border-transparent'}`}
              >
                <div className="w-5 h-[1.5px] bg-red-500 rotate-45" />
              </button>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => updateProp('backgroundColor', color)}
                  className={`w-6 h-6 rounded-md border-2 border-zinc-400 transition-all ${activeBackgroundColor === color ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </section>

          {/* Fill Style */}
          <section>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">Fill</label>
            <div className="flex gap-1 bg-zinc-50 dark:bg-zinc-800 p-1 rounded-xl">
              <OptionButton title="Hachure" active={activeFillStyle === 'hachure'} onClick={() => updateProp('fillStyle', 'hachure')}>
                 <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l12 12M3 8l7 7M8 3l7 7"/></svg>
              </OptionButton>
              <OptionButton title="Cross-hatch" active={activeFillStyle === 'cross-hatch'} onClick={() => updateProp('fillStyle', 'cross-hatch')}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l12 12M3 15l12-12"/></svg>
              </OptionButton>
              <OptionButton title="Solid" active={activeFillStyle === 'solid'} onClick={() => updateProp('fillStyle', 'solid')}>
                <div className="w-4 h-4 bg-current rounded-sm" />
              </OptionButton>
            </div>
          </section>

          {/* Stroke Width */}
          <section>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">Stroke width</label>
            <div className="flex gap-1 bg-zinc-50 dark:bg-zinc-800 p-1 rounded-xl">
              <OptionButton active={activeStrokeWidth === 1} onClick={() => updateProp('strokeWidth', 1)}>
                <div className="h-[1px] w-4 bg-current" />
              </OptionButton>
              <OptionButton active={activeStrokeWidth === 3} onClick={() => updateProp('strokeWidth', 3)}>
                <div className="h-[3px] w-4 bg-current" />
              </OptionButton>
              <OptionButton active={activeStrokeWidth === 6} onClick={() => updateProp('strokeWidth', 6)}>
                <div className="h-[6px] w-4 bg-current" />
              </OptionButton>
            </div>
          </section>

          {/* Stroke Style */}
          <section>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">Stroke style</label>
            <div className="flex gap-1 bg-zinc-50 dark:bg-zinc-800 p-1 rounded-xl">
              <OptionButton title="Solid" active={activeStrokeStyle === 'solid'} onClick={() => updateProp('strokeStyle', 'solid')}>
                <div className="h-0.5 w-4 bg-current" />
              </OptionButton>
              <OptionButton title="Dashed" active={activeStrokeStyle === 'dashed'} onClick={() => updateProp('strokeStyle', 'dashed')}>
                <div className="h-0.5 w-4 border-t-2 border-dashed border-current" />
              </OptionButton>
              <OptionButton title="Dotted" active={activeStrokeStyle === 'dotted'} onClick={() => updateProp('strokeStyle', 'dotted')}>
                <div className="h-0.5 w-4 border-t-2 border-dotted border-current" />
              </OptionButton>
            </div>
          </section>

          {/* Sloppiness */}
          <section>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">Sloppiness</label>
            <div className="flex gap-1 bg-zinc-50 dark:bg-zinc-800 p-1 rounded-xl">
              <OptionButton active={activeRoughness === 0} onClick={() => updateProp('roughness', 0)}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20"/></svg>
              </OptionButton>
              <OptionButton active={activeRoughness === 1.5} onClick={() => updateProp('roughness', 1.5)}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12c4-4 8 4 12 0s8-4 8 0"/></svg>
              </OptionButton>
              <OptionButton active={activeRoughness === 3} onClick={() => updateProp('roughness', 3)}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12c2-8 4 8 6 0s4-8 6 0 4 8 6 0 4-8 6 0"/></svg>
              </OptionButton>
            </div>
          </section>

          {/* Edges */}
          <section>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">Edges</label>
            <div className="flex gap-1 bg-zinc-50 dark:bg-zinc-800 p-1 rounded-xl">
              <OptionButton active={activeEdgeStyle === 'sharp'} onClick={() => updateProp('edgeStyle', 'sharp')}>
                 <SquareIcon size={16} />
              </OptionButton>
              <OptionButton active={activeEdgeStyle === 'round'} onClick={() => updateProp('edgeStyle', 'round')}>
                 <div className="w-4 h-4 rounded-full border-2 border-current" />
              </OptionButton>
            </div>
          </section>

          {/* AI Section */}
          <section className="mt-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
            <h3 className="text-xs font-bold mb-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
              <Sparkles size={14} /> AI Sketch
            </h3>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'a network diagram'"
              className="w-full h-16 p-2 text-xs rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 mb-2 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button 
              onClick={handleAISuggest}
              disabled={isGenerating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
            >
              {isGenerating ? 'Drawing...' : 'Draw with Gemini'}
            </button>
          </section>
        </div>
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-full bg-white dark:bg-zinc-900 p-1.5 py-4 rounded-r-xl shadow-lg border border-l-0 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  );
};

export default Sidebar;
