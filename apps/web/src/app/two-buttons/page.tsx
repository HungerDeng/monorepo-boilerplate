'use client';

import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { Textfit } from 'react-textfit';

export default function TwoButtonsPage() {
  const editorWorkspaceRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!editorWorkspaceRef.current) return;

    try {
      const dataUrl = await toPng(editorWorkspaceRef.current, {
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = 'meme-export.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className='flex gap-4 justify-center items-center min-h-screen bg-gray-100'>
      <div id='editor-workspace' className='relative' ref={editorWorkspaceRef}>
        <img
          src='/Two-Buttons-meme-1g8my4.jpg'
          alt='Two Buttons Meme'
          width={600}
          height={908}
        />

        {/* First button rectangle */}
        <div
          className='absolute bg-gray-500/50'
          style={{
            height: 90.61224489795919,
            width: 187.3469387755102,
            left: 55.10204081632653,
            top: 84.48979591836735,
            transform: `rotate(349deg)`,
          }}
        >
          <Textfit
            id='meme-text'
            mode='multi'
            className='w-full h-full font-bold text-black font-italic'
          >
            Edit Me
          </Textfit>
        </div>
        {/* Second button rectangle */}
        <div
          className='absolute bg-gray-500/50'
          style={{
            height: 80.81632653061224,
            width: 143.26530612244898,
            left: 273.0612244897959,
            top: 55.10204081632653,
            transform: `rotate(352deg)`,
          }}
        >
          <Textfit
            id='meme-text'
            mode='multi'
            className='w-full h-full font-bold text-black font-italic'
          >
            Longer Button Text That Wraps. pnpm requires explicit installation
            of both when needed. After this sequence, pnpm why react-textfit
            should show the package in your dependency tree. Remember to restart
            your Next.js dev server after installation.
          </Textfit>
        </div>
        {/* Bottom text rectangle */}
        <div
          className='absolute bg-gray-500/50'
          style={{
            height: 121.6938775510204,
            width: 559.5918367346939,
            left: 19.591836734693878,
            top: 753.1530612244899,
          }}
        >
          <Textfit
            id='meme-text'
            mode='multi'
            className='w-full h-full font-bold text-black font-italic'
            max={40}
          >
            This is some sample text that will automatically resize to fit
            within the container while maintaining readability.
          </Textfit>
        </div>
      </div>

      <div className='self-start flex flex-col gap-4'>
        <button
          onClick={handleExport}
          className=' bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Export as PNG
        </button>
      </div>
    </div>
  );
}
