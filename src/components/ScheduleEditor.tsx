import React, { useState } from 'react';
import { ScheduleBlock } from '../types';
import { Plus, Trash2, ArrowUp, ArrowDown, RotateCcw, Sparkles } from 'lucide-react';
import { INITIAL_SCHEDULE } from '../data/defaultData';

interface ScheduleEditorProps {
  blocks: ScheduleBlock[];
  onUpdateBlocks: (newBlocks: ScheduleBlock[]) => void;
  priorityText: string;
  onUpdatePriority: (text: string) => void;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  blocks,
  onUpdateBlocks,
  priorityText,
  onUpdatePriority,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleFieldChange = (id: string, field: keyof ScheduleBlock, value: string) => {
    onUpdateBlocks(
      blocks.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const handleAddBlock = () => {
    const newId = Date.now().toString();
    const lastBlock = blocks[blocks.length - 1];
    const newBlock: ScheduleBlock = {
      id: newId,
      start: lastBlock ? lastBlock.end : '12:00',
      end: '13:00',
      icon: '⚡',
      title: 'NEW ROUTINE BLOCK',
      subtitle: 'Description or notes',
    };
    onUpdateBlocks([...blocks, newBlock]);
    setEditingId(newId);
  };

  const handleDelete = (id: string) => {
    if (blocks.length <= 1) return;
    onUpdateBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onUpdateBlocks(copy);
  };

  const handleReset = () => {
    if (window.confirm('Reset schedule back to default Daily Focus schedule?')) {
      onUpdateBlocks(INITIAL_SCHEDULE);
      onUpdatePriority('3-MONTH FOCUS\nEARN · CEED / NID · PORTFOLIO · HEALTH');
    }
  };

  return (
    <div className="space-y-6">
      {/* 3-Month Priority Editor */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Header Priority Banner Text
        </label>
        <textarea
          rows={2}
          value={priorityText}
          onChange={(e) => onUpdatePriority(e.target.value)}
          placeholder="e.g. 3-MONTH FOCUS&#10;EARN · CEED / NID · PORTFOLIO · HEALTH"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 font-mono focus:border-amber-500 focus:outline-none"
        />
        <p className="text-[11px] text-zinc-500 mt-1">
          First line is bolded; second line appears as your target pillars.
        </p>
      </div>

      {/* Routine Blocks List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Routine Time Blocks ({blocks.length})</h3>
            <p className="text-xs text-zinc-400">
              Each block automatically highlights during its active time window on your lock screen.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition"
              title="Reset to default routine"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleAddBlock}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Block</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {blocks.map((block, idx) => (
            <div
              key={block.id || idx}
              className="bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-lg p-2.5 transition flex flex-col sm:flex-row sm:items-center gap-2.5 text-xs"
            >
              {/* Index & Reorder */}
              <div className="flex items-center gap-1 sm:w-16 shrink-0 text-zinc-500">
                <span className="font-mono text-[10px] w-4">{idx + 1}.</span>
                <button
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  disabled={idx === blocks.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              {/* Time Window */}
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="text"
                  value={block.start}
                  onChange={(e) => handleFieldChange(block.id, 'start', e.target.value)}
                  className="w-14 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-1 text-center font-mono text-zinc-200 focus:border-amber-500 focus:outline-none"
                  placeholder="07:30"
                />
                <span className="text-zinc-600">→</span>
                <input
                  type="text"
                  value={block.end}
                  onChange={(e) => handleFieldChange(block.id, 'end', e.target.value)}
                  className="w-14 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-1 text-center font-mono text-zinc-200 focus:border-amber-500 focus:outline-none"
                  placeholder="08:00"
                />
              </div>

              {/* Icon Emoji */}
              <div className="shrink-0">
                <input
                  type="text"
                  value={block.icon}
                  onChange={(e) => handleFieldChange(block.id, 'icon', e.target.value)}
                  className="w-10 bg-zinc-900 border border-zinc-800 rounded px-1 py-1 text-center text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="🏃"
                  title="Emoji / Icon symbol"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => handleFieldChange(block.id, 'title', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 font-semibold text-zinc-100 uppercase tracking-wide focus:border-amber-500 focus:outline-none"
                  placeholder="ROUTINE NAME"
                />
                <input
                  type="text"
                  value={block.subtitle}
                  onChange={(e) => handleFieldChange(block.id, 'subtitle', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-400 focus:border-amber-500 focus:outline-none"
                  placeholder="Details / note"
                />
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(block.id)}
                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition self-end sm:self-center"
                title="Delete block"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
