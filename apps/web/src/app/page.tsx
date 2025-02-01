'use client';

import { useEffect, useRef, useState } from 'react';

export default function Page(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => setImage(img);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image if exists
    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    // Configure text style
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.font = '48px Impact';
    ctx.textAlign = 'center';

    // Draw top text
    ctx.fillText(topText, canvas.width / 2, 50);
    ctx.strokeText(topText, canvas.width / 2, 50);

    // Draw bottom text
    ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
    ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    drawCanvas();
  }, [image, topText, bottomText]);

  return (
    <main className='flex min-h-screen p-8 gap-8'>
      {/* Canvas Section */}
      <div className='flex-1'>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className='border border-gray-300 bg-white'
        />
      </div>

      {/* Sidebar Controls */}
      <div className='w-80 space-y-6 p-4 bg-gray-100 rounded-lg'>
        <div className='space-y-2'>
          <h2 className='font-bold text-lg'>Upload Image</h2>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            className='w-full'
          />
        </div>

        <div className='space-y-2'>
          <h2 className='font-bold text-lg'>Add Text</h2>
          <input
            type='text'
            placeholder='Top Text'
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            className='w-full p-2 border rounded'
          />
          <input
            type='text'
            placeholder='Bottom Text'
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            className='w-full p-2 border rounded'
          />
        </div>

        <button
          onClick={handleExport}
          className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
        >
          Export Meme
        </button>
      </div>
    </main>
  );
}
