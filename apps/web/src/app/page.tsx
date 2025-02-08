'use client';

import { Canvas, FabricImage, FabricText } from 'fabric';
import { useEffect, useRef } from 'react';

export default function Page(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<Canvas | null>(null);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current === null) return;
    fabricCanvas.current = new Canvas(canvasRef.current, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      width: 800,
      height: 600,
    });

    return () => {
      fabricCanvas?.current?.dispose();
    };
  }, []);

  const handleAddText = () => {
    if (!fabricCanvas.current) return;
    const text = new FabricText('Edit me', {
      left: 100,
      top: 100,
      fontSize: 48,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 2,
      fontFamily: 'Impact',
    });
    fabricCanvas.current?.add(text);
    fabricCanvas.current?.setActiveObject(text);
    fabricCanvas.current?.renderAll();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas.current) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = await FabricImage.fromURL(
        event.target?.result as string,
        {},
        (img: any) => {
          // Scale image to fit canvas if needed
          img.scaleToWidth(fabricCanvas.current!.width * 0.8);
          img.set({
            left: fabricCanvas.current!.width / 2,
            top: fabricCanvas.current!.height / 2,
            originX: 'center',
            originY: 'center',
          });
        },
      );
      fabricCanvas.current!.add(img);
      fabricCanvas.current!.renderAll();
    };
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    if (!fabricCanvas.current) return;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = fabricCanvas.current.toDataURL();
    link.click();
  };

  return (
    <main className='flex min-h-screen p-8 gap-8'>
      {/* Canvas Section */}
      <div className='flex-1'>
        {/* 
        The HTML <canvas> element is the actual rendering surface required by the browser to draw graphics. Fabric.js works as a wrapper/library around this native element - it can't exist without it. In short, canvas element is mendatory for fabricjs to work.
        */}
        <canvas
          id='canvas'
          ref={canvasRef}
          className='border border-gray-300'
        />
      </div>

      {/* Simplified Sidebar Controls */}
      <div className='w-20 space-y-6 p-4 bg-gray-100 rounded-lg'>
        <div className='flex flex-col items-center gap-4'>
          <div className='flex flex-col items-center'>
            <label className='cursor-pointer'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='hidden'
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-8 h-8'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M7 16a4 4 0 0 1-4-4 4 4 0 0 1 4-4h.5a5.5 5.5 0 0 1 11 0H19a4 4 0 0 1 4 4 4 4 0 0 1-4 4H7z' />
                <path d='M12 12v6' />
                <path d='M9 15l3-3 3 3' />
              </svg>
            </label>
            <span className='text-xs mt-1'>Upload</span>
          </div>

          <div className='flex flex-col items-center'>
            <button onClick={handleAddText}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-8 h-8'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M17 10H3' />
                <path d='M21 6H3' />
                <path d='M21 14H3' />
                <path d='M17 18H3' />
              </svg>
            </button>
            <span className='text-xs mt-1'>Text</span>
          </div>

          <div className='flex flex-col items-center'>
            <button onClick={handleAddText}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-8 h-8'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M12 20h9' />
                <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
              </svg>
            </button>
            <span className='text-xs mt-1'>Draw</span>
          </div>

          <div className='flex flex-col items-center'>
            <button onClick={handleExport}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-8 h-8'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                <polyline points='7 10 12 15 17 10' />
                <line x1='12' y1='15' x2='12' y2='3' />
              </svg>
            </button>
            <span className='text-xs mt-1'>Export</span>
          </div>
        </div>
      </div>
    </main>
  );
}
