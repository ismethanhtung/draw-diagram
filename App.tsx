
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Undo, 
  Redo,
  HelpCircle,
  Sun,
  Moon,
  Download,
  Minus,
  Plus,
  Search
} from 'lucide-react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import HelpModal from './components/HelpModal';
import { Tool, Element, Point } from './types';

const App: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [history, setHistory] = useState<Element[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<Tool>('selection');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // View state
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  // Default properties
  const [defaultStrokeColor, setDefaultStrokeColor] = useState('#18181b');
  const [defaultBackgroundColor, setDefaultBackgroundColor] = useState('transparent');

  const updateElements = useCallback((newElements: Element[]) => {
    setElements(newElements);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const onUpdateElement = (updates: Partial<Element>) => {
    if (!selectedElementId) return;
    const newElements = elements.map(el => 
      el.id === selectedElementId ? { ...el, ...updates } : el
    );
    updateElements(newElements);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) redo(); else undo();
        e.preventDefault();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          updateElements(elements.filter(el => el.id !== selectedElementId));
          setSelectedElementId(null);
        }
      }
      if (e.key === 'v' || e.key === '1') setSelectedTool('selection');
      if (e.key === 'h') setSelectedTool('hand');
      if (e.key === 'r' || e.key === '2') setSelectedTool('rectangle');
      if (e.key === 'd' || e.key === '3') setSelectedTool('diamond');
      if (e.key === 'o' || e.key === '4') setSelectedTool('circle');
      if (e.key === 'a' || e.key === '5') setSelectedTool('arrow');
      if (e.key === 'l' || e.key === '6') setSelectedTool('line');
      if (e.key === 'p' || e.key === '7') setSelectedTool('draw');
      if (e.key === 't' || e.key === '8') setSelectedTool('text');
      if (e.key === 'e' || e.key === '0') setSelectedTool('eraser');
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY;
        const zoomFactor = Math.pow(1.1, delta / 100);
        const newScale = Math.min(Math.max(scale * zoomFactor, 0.1), 10);
        
        // Adjust offset to zoom centered on pointer
        const pointerX = e.clientX;
        const pointerY = e.clientY;
        const targetX = (pointerX - offset.x) / scale;
        const targetY = (pointerY - offset.y) / scale;
        
        setOffset({
          x: pointerX - targetX * newScale,
          y: pointerY - targetY * newScale,
        });
        setScale(newScale);
      } else {
        setOffset(prev => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [elements, historyIndex, selectedElementId, scale, offset]);

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'}`}>
      <header className="fixed top-3 left-3 right-3 z-30 flex justify-between items-center pointer-events-none">
        {/* Left: Logo & Sidebar toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">G</div>
             <span className="font-bold text-base virgil-font hidden sm:block">GeminiSketch</span>
          </div>
        </div>

        {/* Center: Main Tools */}
        <div className="pointer-events-auto">
          <Toolbar activeTool={selectedTool} onSelectTool={setSelectedTool} />
        </div>

        {/* Right: Actions & View controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-white dark:bg-zinc-900 p-1 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-1">
            <button onClick={undo} disabled={historyIndex === 0} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg disabled:opacity-30 transition-colors">
              <Undo size={16} />
            </button>
            <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg disabled:opacity-30 transition-colors">
              <Redo size={16} />
            </button>
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
            <div className="flex items-center gap-1 px-2">
              <button onClick={() => setScale(s => Math.max(0.1, s - 0.1))} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                <Minus size={14} />
              </button>
              <span className="text-[11px] font-mono min-w-[36px] text-center">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(s => Math.min(10, s + 0.1))} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                <Plus size={14} />
              </button>
            </div>
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => window.print()} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <Download size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="bg-white dark:bg-zinc-900 p-2.5 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <HelpCircle size={20} className="text-zinc-500" />
          </button>
        </div>
      </header>

      <main className="flex-1 relative">
        <Canvas 
          elements={elements} 
          setElements={updateElements} 
          tool={selectedTool}
          isDarkMode={isDarkMode}
          strokeColor={defaultStrokeColor}
          backgroundColor={defaultBackgroundColor}
          onElementSelect={setSelectedElementId}
          selectedElementId={selectedElementId}
          scale={scale}
          offset={offset}
          setOffset={setOffset}
        />

        <Sidebar 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          selectedElement={selectedElement}
          onUpdateElement={onUpdateElement}
          isDarkMode={isDarkMode}
          onAIGenerate={(newElements) => updateElements([...elements, ...newElements])}
          defaultStrokeColor={defaultStrokeColor}
          setDefaultStrokeColor={setDefaultStrokeColor}
          defaultBackgroundColor={defaultBackgroundColor}
          setDefaultBackgroundColor={setDefaultBackgroundColor}
        />
      </main>

      {/* Floating help hint in bottom right */}
      <div className="fixed bottom-4 left-4 z-10 text-[10px] text-zinc-400 bg-white/50 dark:bg-zinc-900/50 px-2 py-1 rounded backdrop-blur-sm">
        Ctrl + Scroll to Zoom • Space + Drag to Pan
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
