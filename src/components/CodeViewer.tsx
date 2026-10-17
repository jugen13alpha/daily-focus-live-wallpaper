import React, { useState } from 'react';
import { Copy, Check, FileCode, Folder } from 'lucide-react';
import { ScheduleBlock, WallpaperTheme, AndroidProjectConfig } from '../types';
import { buildProjectFileTree } from '../utils/generateAndroidProject';

interface CodeViewerProps {
  blocks: ScheduleBlock[];
  theme: WallpaperTheme;
  config: AndroidProjectConfig;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  blocks,
  theme,
  config,
}) => {
  const files = buildProjectFileTree(blocks, theme, config);
  const fileKeys = Object.keys(files);

  const [selectedFile, setSelectedFile] = useState<string>(
    files[`app/src/main/java/${config.packageName.replace(/\./g, '/')}/LiveWallpaperService.kt`]
      ? `app/src/main/java/${config.packageName.replace(/\./g, '/')}/LiveWallpaperService.kt`
      : 'app/src/main/AndroidManifest.xml'
  );
  const [copied, setCopied] = useState(false);

  const activeContent = files[selectedFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>Android Studio Project Source Code Inspector</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Inspect all Kotlin, XML, Gradle, and Asset files bundled inside your download.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg cursor-pointer transition border border-zinc-700"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied File!' : 'Copy File Content'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
        {/* File List Sidebar */}
        <div className="md:col-span-4 bg-zinc-950 p-3 border-r border-zinc-800 space-y-1 max-h-[550px] overflow-y-auto">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 py-1">
            PROJECT FILES ({fileKeys.length})
          </div>
          {fileKeys.map((path) => {
            const isSelected = selectedFile === path;
            const fileName = path.split('/').pop() || path;
            const dirName = path.substring(0, path.lastIndexOf('/'));

            return (
              <button
                key={path}
                onClick={() => setSelectedFile(path)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex flex-col ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <span className="truncate">{fileName}</span>
                </div>
                {dirName && (
                  <span className="text-[10px] text-zinc-600 truncate pl-5">
                    {dirName}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Code Content */}
        <div className="md:col-span-8 bg-zinc-900/50 p-4 max-h-[550px] overflow-auto flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800 text-[11px] text-zinc-400 font-mono">
            <span>{selectedFile}</span>
            <span>{activeContent.split('\n').length} lines</span>
          </div>
          <pre className="text-xs font-mono text-zinc-200 whitespace-pre leading-relaxed select-text flex-1">
            {activeContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
