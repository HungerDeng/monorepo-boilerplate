'use client';

import { Canvas, FabricImage, FabricText } from 'fabric';
import { useEffect, useRef, useState } from 'react';

export default function Page(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<Canvas | null>(null);
  const [showTextToolbar, setShowTextToolbar] = useState(false);
  const [showImageToolbar, setShowImageToolbar] = useState(false);
  console.log('showImageToolbar', showImageToolbar);
  const [textProps, setTextProps] = useState({
    fontFamily: 'Impact',
    fontSize: 48,
    fill: '#ffffff',
    fontWeight: 'normal',
    underline: false,
  });

  // Initialize Fabric.js canvas with selection events
  useEffect(() => {
    if (canvasRef.current === null) return;
    fabricCanvas.current = new Canvas(canvasRef.current, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      width: 800,
      height: 600,
    });

    const canvas = fabricCanvas.current;

    // Handle selection events
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelectionCleared);

    // Enable shift key selection
    canvas.set('selection', {
      multiple: true,
    });

    return () => {
      canvas?.dispose();
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, []);

  const showTextToolbarFun = () => {
    setShowTextToolbar(true);
    setShowImageToolbar(false);
  };

  const showImageToolbarFun = () => {
    setShowImageToolbar(true);
    setShowTextToolbar(false);
  };

  const handleSelection = (e: any) => {
    if (!fabricCanvas.current) return;

    const selectedObjects = fabricCanvas.current.getActiveObjects();
    if (selectedObjects.length === 0) {
      setShowTextToolbar(false);
      setShowImageToolbar(false);
      return;
    }

    // Get the target object that triggered the selection event
    const targetObject = e.selected?.[e.selected.length - 1];
    if (!targetObject) return;

    // If there's only one object selected, show the appropriate toolbar
    if (selectedObjects.length === 1) {
      if (targetObject.type === 'text') {
        showTextToolbarFun();
      } else if (targetObject.type === 'image') {
        showImageToolbarFun();
      }
      return;
    }

    // For multiple selections, check if they're all the same type
    const firstObjectType = selectedObjects[0].type;
    const hasMultipleTypes = selectedObjects.some(
      (obj) => obj.type !== firstObjectType,
    );

    if (hasMultipleTypes) {
      // Keep only the target object selected while deselecting all others when end-users select objects of different types (text and image), since the system shouldn't support selecting multiple objects of different types simultaneously.
      fabricCanvas.current.discardActiveObject();
      fabricCanvas.current.setActiveObject(targetObject);
      fabricCanvas.current.requestRenderAll();

      // Show appropriate toolbar based on the target object
      if (targetObject.type === 'text') {
        showTextToolbarFun();
      } else if (targetObject.type === 'image') {
        showImageToolbarFun();
      }
    } else {
      // All objects are of the same type, show appropriate toolbar
      if (firstObjectType === 'text') {
        showTextToolbarFun();
      } else if (firstObjectType === 'image') {
        showImageToolbarFun();
      }
    }
  };

  // remain the following code for reminder: The type of the last selected object is always detected as image, even when I have selected a FabricText object last. the detailed description is in the comment below.
  //
  // const handleSelectionV0 = () => {
  //   if (!fabricCanvas.current) {
  //     return;
  //   }
  //   // fabricCanvas.current.getActiveObjects() returns an array with the current selected objects
  //   const selectedObjects = fabricCanvas.current.getActiveObjects();
  //   if (selectedObjects.length === 0) {
  //     setShowTextToolbar(false);
  //     setShowImageToolbar(false);
  //     return;
  //   }
  //   if (selectedObjects.every((obj) => obj.type === 'text')) {
  //     showTextToolbarFun();
  //   } else if (selectedObjects.every((obj) => obj.type === 'image')) {
  //     showImageToolbarFun();
  //   } else {
  //     // keep only the last selected object selected while deselecting all others when end-users select objects of different types (text and image), since the system shouldn't support selecting multiple objects of different types simultaneously.
  //     // pitfall: The type of the last selected object is always detected as image, even when I have selected a FabricText object last. It seems that we can't simply rely on the type of the last element in the array, must use other approaches.
  //     //
  //     // for (let i = 0; i < selectedObjects.length; i++) {
  //     //   console.log(`Index: ${i}, Type: ${selectedObjects[i].type}`);
  //     // }
  //     // const lastSelected = selectedObjects[selectedObjects.length - 1];
  //     // fabricCanvas.current.discardActiveObject();
  //     // fabricCanvas.current.setActiveObject(lastSelected);
  //     // if (lastSelected.type === 'text') {
  //     //   showTextToolbarFun();
  //     // } else if (lastSelected.type === 'image') {
  //     //   showImageToolbarFun();
  //     // }
  //   }
  // };

  const handleSelectionCleared = () => {
    setShowTextToolbar(false);
    setShowImageToolbar(false);
  };

  // Update properties for all selected texts
  const updateTextProperty = (property: string, value: any) => {
    if (!fabricCanvas.current) return;

    fabricCanvas.current.getActiveObjects().forEach((obj) => {
      if (obj.isType('Text')) {
        obj.set({ [property]: value });
      }
    });
    setTextProps((prev) => ({ ...prev, [property]: value }));
    fabricCanvas.current.renderAll();
  };

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
        // TODO: adjust image size to fit canvas
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
      {/* Text Formatting Toolbar - Only shown when text is selected */}
      {showTextToolbar && (
        <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex items-center gap-4 z-10'>
          {/* Font Family Selector */}
          <select
            value={textProps.fontFamily}
            onChange={(e) => updateTextProperty('fontFamily', e.target.value)}
            className='border rounded px-2 py-1'
          >
            <option value='Open Sans'>Open Sans</option>
            <option value='Impact'>Impact</option>
            <option value='Arial'>Arial</option>
            <option value='Times New Roman'>Times New Roman</option>
          </select>

          {/* Font Size Input */}
          <div className='flex items-center gap-2'>
            <button
              onClick={() =>
                updateTextProperty(
                  'fontSize',
                  Math.max(1, textProps.fontSize - 2),
                )
              }
              className='px-2 hover:bg-gray-100 rounded'
            >
              -
            </button>
            <input
              type='number'
              value={textProps.fontSize}
              onChange={(e) =>
                updateTextProperty(
                  'fontSize',
                  Math.max(1, parseInt(e.target.value) || 1),
                )
              }
              className='w-16 border rounded px-2 py-1'
            />
            <button
              onClick={() =>
                updateTextProperty('fontSize', textProps.fontSize + 2)
              }
              className='px-2 hover:bg-gray-100 rounded'
            >
              +
            </button>
          </div>

          {/* Text Color Picker */}
          <input
            type='color'
            value={textProps.fill}
            onChange={(e) => updateTextProperty('fill', e.target.value)}
            className='w-8 h-8'
          />

          {/* Bold Toggle */}
          <button
            onClick={() =>
              updateTextProperty(
                'fontWeight',
                textProps.fontWeight === 'bold' ? 'normal' : 'bold',
              )
            }
            className={`px-2 py-1 rounded ${textProps.fontWeight === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            B
          </button>

          {/* Underline Toggle */}
          <button
            onClick={() =>
              updateTextProperty('underline', !textProps.underline)
            }
            className={`px-2 py-1 rounded ${textProps.underline ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            U
          </button>
        </div>
      )}

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
