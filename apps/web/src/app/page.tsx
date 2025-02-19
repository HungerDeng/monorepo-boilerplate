'use client';

import { Canvas, FabricImage, Shadow, Textbox } from 'fabric';
import { useEffect, useRef, useState } from 'react';

import { Toaster } from '~*/components/ui/toaster';
import { useToast } from '~*/hooks/use-toast';

import { defaultImageProps, ImageToolbar } from '../components/image-toolbar';
import { defaultTextProps, TextToolbar } from '../components/text-toolbar';

const FABRIC_TEXT_TYPE_ARRAY = ['textbox', 'i-text', 'text'];
const FABRIC_IMAGE_TYPE_ARRAY = ['image'];

export default function Page(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<Canvas | null>(null);
  const [showTextToolbar, setShowTextToolbar] = useState(false);
  const [showImageToolbar, setShowImageToolbar] = useState(false);
  const { toast } = useToast();

  const [textProps, setTextProps] = useState(defaultTextProps);
  const [imageProps, setImageProps] = useState(defaultImageProps);

  // Change state type to array of arrays
  const [deletedObjects, setDeletedObjects] = useState<any[][]>([]);

  // Add these to the existing state definitions
  const [otherTextCopiedStyle, setOtherTextCopiedStyle] = useState<
    typeof defaultTextProps | null
  >(null);
  const [isOtherTextCopyMode, setIsOtherTextCopyMode] = useState(false);

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

  // Initialize the event listener for the keyboard event
  useEffect(() => {
    // Add keyboard event listener for delete and undo functionality
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fabricCanvas.current) return;

      // TODO: too many compatibility issues, so don't support delete and backspace shortcuts now. maybe in the future will support it.
      // if (e.key === 'Delete' || e.key === 'Backspace') {
      //   handleDelete();
      // }

      // Improved undo functionality
      // TODO: need to undo the modification of the text or image properties in the long run, but it's not a high priority task now. Currently, only the undo of deletion is supported.
      if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        if (deletedObjects.length > 0) {
          // Get the last deleted group
          const objectsToRestore = deletedObjects[deletedObjects.length - 1];

          // Remove the restored group from history
          setDeletedObjects((prev) => prev.slice(0, -1));

          // Add all objects from the group
          fabricCanvas.current.add(...objectsToRestore);
          fabricCanvas.current.requestRenderAll();
        } else {
          toast({
            title: 'Nothing to undo',
            description: 'Currently, only support undoing deletion operations',
          });
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [deletedObjects]);

  // Add this effect hook for handling style application
  useEffect(() => {
    if (!fabricCanvas.current || !isOtherTextCopyMode) return;

    const handleObjectClick = (e: any) => {
      if (
        e.target &&
        FABRIC_TEXT_TYPE_ARRAY.includes(e.target.type) &&
        isOtherTextCopyMode &&
        otherTextCopiedStyle
      ) {
        // Apply copied style to clicked textbox
        updateTextProperties(otherTextCopiedStyle);
        fabricCanvas.current?.requestRenderAll();

        // Clear copy mode after application
        setIsOtherTextCopyMode(false);
        setOtherTextCopiedStyle(null);
      }
    };

    fabricCanvas.current.on('mouse:down', handleObjectClick);

    return () => {
      fabricCanvas.current?.off('mouse:down', handleObjectClick);
    };
  }, [isOtherTextCopyMode, otherTextCopiedStyle]);

  const handleDelete = () => {
    if (!fabricCanvas.current) return;
    const activeObjects = fabricCanvas.current.getActiveObjects();
    if (activeObjects.length > 0) {
      // Prevent deletion if any text object is being edited
      if (
        activeObjects.some(
          (obj) =>
            obj.type === 'textbox' && (obj as Textbox).isEditing === true,
        )
      ) {
        toast({
          title: 'Cannot delete text object that is being edited',
        });
        return;
      }

      // Store as a single array in the history
      setDeletedObjects((prev) => [...prev, activeObjects]);
      fabricCanvas.current.remove(...activeObjects);
      fabricCanvas.current.discardActiveObject();
      fabricCanvas.current.requestRenderAll();
      setShowTextToolbar(false);
      setShowImageToolbar(false);
    }
  };

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
      setTextProps(defaultTextProps);
      setOtherTextCopiedStyle(null);
      setIsOtherTextCopyMode(false);
      return;
    }

    // Get the target object that triggered the selection event
    const targetObject = e.selected?.[e.selected.length - 1];
    if (!targetObject) return;

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
      if (FABRIC_TEXT_TYPE_ARRAY.includes(targetObject.type)) {
        showTextToolbarFun();
      } else if (FABRIC_IMAGE_TYPE_ARRAY.includes(targetObject.type)) {
        showImageToolbarFun();
      }
    } else {
      // All objects are of the same type, show appropriate toolbar
      if (FABRIC_TEXT_TYPE_ARRAY.includes(firstObjectType)) {
        showTextToolbarFun();
      } else if (FABRIC_IMAGE_TYPE_ARRAY.includes(firstObjectType)) {
        showImageToolbarFun();
      }
    }

    // restore the lastest properties of the selected text objects
    const finalSelectedObjects = fabricCanvas.current.getActiveObjects();
    const textObjects = finalSelectedObjects.filter((obj) =>
      FABRIC_TEXT_TYPE_ARRAY.includes(obj.type),
    ) as Textbox[];
    if (textObjects.length === 0) {
      setTextProps(defaultTextProps);
    } else {
      // TODO: need to check if all the text objects have the same properties
      const firstTextbox = textObjects[0];
      setTextProps({
        fontFamily: firstTextbox.get('fontFamily') as string,
        fontSize: firstTextbox.get('fontSize') as number,
        fill: firstTextbox.get('fill') as string,
        fontWeight: firstTextbox.get('fontWeight') as string,
        underline: firstTextbox.get('underline') as boolean,
        linethrough: firstTextbox.get('linethrough') as boolean,
        uppercase: firstTextbox.get('uppercase') as boolean,
        textAlign: firstTextbox.get('textAlign') as string,
        charSpacing: firstTextbox.get('charSpacing') as number,
        lineHeight: firstTextbox.get('lineHeight') as number,
        opacity: firstTextbox.get('opacity') as number,
        fontStyle: firstTextbox.get('fontStyle') as string,
        stroke: firstTextbox.get('stroke') as string,
        strokeWidth: firstTextbox.get('strokeWidth') as number,
        shadow: firstTextbox.get('shadow') as Shadow,
        backgroundColor: firstTextbox.get('backgroundColor') as string,
      });
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
  //   if (selectedObjects.every((obj) => FABRIC_TEXT_TYPE_ARRAY.includes(obj.type))) {
  //     showTextToolbarFun();
  //   } else if (selectedObjects.every((obj) => FABRIC_IMAGE_TYPE_ARRAY.includes(obj.type))) {
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
  //     // if (FABRIC_TEXT_TYPE_ARRAY.includes(lastSelected.type)) {
  //     //   showTextToolbarFun();
  //     // } else if (FABRIC_IMAGE_TYPE_ARRAY.includes(lastSelected.type)) {
  //     //   showImageToolbarFun();
  //     // }
  //   }
  // };

  const handleSelectionCleared = () => {
    setShowTextToolbar(false);
    setShowImageToolbar(false);
  };

  // Update properties for all selected texts
  const updateTextProperties = (updates: Record<string, any>) => {
    if (!fabricCanvas.current) return;

    fabricCanvas.current.getActiveObjects().forEach((obj) => {
      if (FABRIC_TEXT_TYPE_ARRAY.includes(obj.type)) {
        Object.entries(updates).forEach(([property, value]) => {
          obj.set({ [property]: value });
          if (property === 'uppercase') {
            if (value) {
              obj.set('text', obj.get('text').toUpperCase());
            } else {
              // TODO: undo the uppercase operation will lose the original text, need to store the original text. But it's not a pain point now.
              obj.set('text', obj.get('text').toLowerCase());
            }
          }
        });
      }
    });

    setTextProps((prev) => ({
      ...prev,
      ...updates,
    }));
    fabricCanvas.current.renderAll();
  };

  const handleAddText = () => {
    if (!fabricCanvas.current) return;

    // Calculate center coordinates of the canvas
    const centerX = fabricCanvas.current.width / 2;
    const centerY = fabricCanvas.current.height / 2;

    const text = new Textbox('Edit me', {
      left: centerX,
      top: centerY,
      originX: 'center', // Set origin point to center of the text box
      originY: 'center', // Set origin point to center of the text box
      fontSize: defaultTextProps.fontSize,
      fill: defaultTextProps.fill,
      stroke: defaultTextProps.stroke,
      strokeWidth: defaultTextProps.strokeWidth,
      shadow: defaultTextProps.shadow,
      backgroundColor: defaultTextProps.backgroundColor,
      fontFamily: defaultTextProps.fontFamily,
      fontWeight: defaultTextProps.fontWeight,
      fontStyle: defaultTextProps.fontStyle,
      underline: defaultTextProps.underline,
      linethrough: defaultTextProps.linethrough,
      uppercase: defaultTextProps.uppercase,
      textAlign: defaultTextProps.textAlign,
      charSpacing: defaultTextProps.charSpacing,
      lineHeight: defaultTextProps.lineHeight,
      borderScaleFactor: 2, // the bigger number, the thicker border

      // Customizing the caret
      cursorColor: 'black', // Fabric.js v5+ supports this, but you may need a workaround for older versions
      cursorWidth: 1, // Makes the cursor thicker
      cursorDelay: 500, // Default 1000ms (lower = faster blink)
      cursorDuration: 300, // Cursor visible duration (lower = shorter visibility)
    });
    // reference: https://github.com/fabricjs/fabric.js/discussions/7797#discussioncomment-2958064
    // UX effect: when hovering over the textbox, its border becomes visible even if it is not selected.
    text.on('mouseover', () => {
      text._renderControls(
        text.canvas?.contextTop as CanvasRenderingContext2D,
        {
          hasControls: false,
        },
      );
    });
    text.on('mouseout', () => {
      text.canvas?.clearContext(
        text.canvas?.contextTop as CanvasRenderingContext2D,
      );
    });
    text.on('mousedown', () => {
      text.canvas?.clearContext(
        text.canvas?.contextTop as CanvasRenderingContext2D,
      );
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
        {
          scaleToWidth: fabricCanvas.current!.width * 0.8,
          left: fabricCanvas.current!.width / 2,
          top: fabricCanvas.current!.height / 2,
          originX: 'center',
          originY: 'center',
          borderScaleFactor: 2, // the bigger number, the thicker border
        },
        // TODO: adjust image size to fit canvas
        // (img: any) => {
        //   // Scale image to fit canvas if needed
        //   img.scaleToWidth(fabricCanvas.current!.width * 0.8);
        //   img.set({
        //     left: fabricCanvas.current!.width / 2,
        //     top: fabricCanvas.current!.height / 2,
        //     originX: 'center',
        //     originY: 'center',
        //   });
        // },
      );
      // reference: https://github.com/fabricjs/fabric.js/discussions/7797#discussioncomment-2958064
      // UX effect: when hovering over the image, its border becomes visible even if it is not selected.
      img.on('mouseover', () => {
        img._renderControls(
          img.canvas?.contextTop as CanvasRenderingContext2D,
          {
            hasControls: false,
          },
        );
      });
      img.on('mouseout', () => {
        img.canvas?.clearContext(
          img.canvas?.contextTop as CanvasRenderingContext2D,
        );
      });
      img.on('mousedown', () => {
        img.canvas?.clearContext(
          img.canvas?.contextTop as CanvasRenderingContext2D,
        );
      });
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

  // It is not working by changing the unselected textbox's borderColor property to make its border visible when hovering over it. Because according to the Fabric.js documentation, the borderColor property is Color of controlling borders of an object (when it's active!!!).
  //
  // const [originalBorderColor, setOriginalBorderColor] =
  //   useState<string>(DEFAULT_BORDER_COLOR);
  // // Add mouse hover events
  // canvas.on('mouse:over', handleMouseOver);
  // canvas.on('mouse:out', handleMouseOut);

  // const handleMouseOver = (e: any) => {
  //   if (!e.target || !fabricCanvas.current) return;

  //   const target = e.target;
  //   // Check if the object is currently selected
  //   const isSelected = fabricCanvas.current.getActiveObjects().includes(target);
  //   if (isSelected) return;

  //   setOriginalBorderColor(target.borderColor);
  //   target.set({
  //     borderColor: '#00ff00',
  //   });
  //   fabricCanvas.current.renderAll();
  // };

  // const handleMouseOut = (e: any) => {
  //   if (!e.target || !fabricCanvas.current) return;

  //   const target = e.target;
  //   const isSelected = fabricCanvas.current.getActiveObjects().includes(target);
  //   if (isSelected) return;

  //   // Restore original properties
  //   target.set({
  //     borderColor: originalBorderColor,
  //   });
  //   setOriginalBorderColor(DEFAULT_BORDER_COLOR);
  //   fabricCanvas.current.renderAll();
  // };

  // properties for all selected images
  const updateImageProperties = (updates: Record<string, any>) => {
    if (!fabricCanvas.current) return;

    fabricCanvas.current.getActiveObjects().forEach((obj) => {
      if (FABRIC_IMAGE_TYPE_ARRAY.includes(obj.type)) {
        Object.entries(updates).forEach(([property, value]) => {
          obj.set({ [property]: value });
        });
      }
    });

    setImageProps((prev) => ({
      ...prev,
      ...updates,
    }));
    fabricCanvas.current.requestRenderAll();
  };

  return (
    <main className='flex min-h-screen p-8 gap-8'>
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

      {/* Text Formatting Toolbar - Only shown when text is selected */}
      {showTextToolbar && (
        <TextToolbar
          textProps={textProps}
          copyMode={isOtherTextCopyMode}
          deleteTextCallback={handleDelete}
          updateTextProperties={updateTextProperties}
          copyAllTextStyleCallback={(updates, latestCopyMode) => {
            setIsOtherTextCopyMode(latestCopyMode);
            setOtherTextCopiedStyle(updates);
          }}
        />
      )}

      {/* Image Formatting Toolbar - Only shown when image is selected */}
      {showImageToolbar && (
        <ImageToolbar
          imageProps={imageProps}
          deleteImageCallback={handleDelete}
          updateImageProperties={updateImageProperties}
        />
      )}

      {/* Canvas Section */}
      <div className='flex-1 w-4/5 h-full'>
        {/* 
        The HTML <canvas> element is the actual rendering surface required by the browser to draw graphics. Fabric.js works as a wrapper/library around this native element - it can't exist without it. In short, canvas element is mendatory for fabricjs to work.
        */}
        <canvas
          id='canvas'
          ref={canvasRef}
          className='border border-gray-300'
        />
      </div>
      <Toaster />
    </main>
  );
}
