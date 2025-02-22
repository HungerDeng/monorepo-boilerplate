'use client';

import html2canvas from 'html2canvas';
import Image from 'next/image';
import { useRef } from 'react';
import { Textfit } from 'react-textfit';

export default function TwoButtonsPage() {
  const editorWorkspaceRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!editorWorkspaceRef.current) return;

    try {
      const canvas = await html2canvas(editorWorkspaceRef.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'meme-export.png';
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='max-w-4xl p-4 bg-gray-200 rounded-lg shadow-lg relative'>
        {/* Export button positioned INSIDE the container */}
        <button
          onClick={handleExport}
          className='absolute top-2 right-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Export as PNG
        </button>

        {/* Add ref to workspace container */}
        <div
          id='editor-workspace'
          className='relative'
          ref={editorWorkspaceRef}
        >
          <Image
            src='/Two-Buttons-meme-1g8my4.jpg'
            alt='Two Buttons Meme'
            width={600}
            height={908}
            className='z-0'
          />
          {/* First button rectangle */}
          <div
            className='absolute bg-gray-500/50 z-10'
            style={{
              height: 90.61224489795919,
              width: 187.3469387755102,
              left: 55.10204081632653,
              top: 84.48979591836735,
              transform: `rotate(349deg)`,
            }}
          >
            <Textfit
              mode='multi'
              className='w-full h-full p-1 font-bold text-black font-italic'
            >
              Edit Me
            </Textfit>
          </div>
          {/* Second button rectangle */}
          <div
            className='absolute bg-gray-500/50 z-10'
            style={{
              height: 80.81632653061224,
              width: 143.26530612244898,
              left: 273.0612244897959,
              top: 55.10204081632653,
              transform: `rotate(352deg)`,
            }}
          >
            <Textfit
              mode='multi'
              className='w-full h-full p-1 font-bold text-black font-italic'
            >
              Longer Button Text That Wraps. pnpm requires explicit installation
              of both when needed. After this sequence, pnpm why react-textfit
              should show the package in your dependency tree. Remember to
              restart your Next.js dev server after installation.
            </Textfit>
          </div>
          {/* Bottom text rectangle */}
          <div
            className='absolute bg-gray-500/50 z-10'
            style={{
              height: 121.6938775510204,
              width: 559.5918367346939,
              left: 19.591836734693878,
              top: 753.1530612244899,
            }}
          >
            <Textfit
              mode='multi'
              className='w-full h-full p-2 font-bold text-black font-italic'
              max={40}
            >
              This is some sample text that will automatically resize to fit
              within the container while maintaining readability.
            </Textfit>
          </div>
        </div>
      </div>
    </div>
  );
}
