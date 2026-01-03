
import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tools = [
    { name: 'Hand (panning tool)', key: 'H' },
    { name: 'Selection', key: 'V or 1' },
    { name: 'Rectangle', key: 'R or 2' },
    { name: 'Diamond', key: 'D or 3' },
    { name: 'Ellipse', key: 'O or 4' },
    { name: 'Arrow', key: 'A or 5' },
    { name: 'Line', key: 'L or 6' },
    { name: 'Draw', key: 'P or 7' },
    { name: 'Text', key: 'T or 8' },
    { name: 'Eraser', key: 'E or 0' },
  ];

  const editor = [
    { name: 'Delete', key: 'Delete' },
    { name: 'Cut', key: 'Cmd X' },
    { name: 'Copy', key: 'Cmd C' },
    { name: 'Paste', key: 'Cmd V' },
    { name: 'Select all', key: 'Cmd A' },
    { name: 'Undo', key: 'Cmd Z' },
    { name: 'Redo', key: 'Cmd Shift Z' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Help</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6">Tools</h3>
              <div className="space-y-1">
                {tools.map((t, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
                    <span className="text-zinc-600 dark:text-zinc-400">{t.name}</span>
                    <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-mono">{t.key}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Editor</h3>
              <div className="space-y-1">
                {editor.map((t, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
                    <span className="text-zinc-600 dark:text-zinc-400">{t.name}</span>
                    <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-mono">{t.key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex gap-4">
          <button className="flex-1 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
            <ExternalLink size={16} /> Documentation
          </button>
          <button className="flex-1 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
            <ExternalLink size={16} /> Read our blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
