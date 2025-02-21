'use client';

import {
  Canvas,
  FabricImage,
  Shadow,
  Textbox,
  TOriginX,
  TOriginY,
} from 'fabric';
import {
  Brush,
  CloudUpload,
  Download,
  LayoutPanelLeft,
  Type,
  UnfoldVertical,
  User,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SidebarButton } from 'src/components/sidebar-button';

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

  const handleAddTextInside = () => {
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

  // TODO: the code below just works during development, need to delete it before deployment.
  useEffect(() => {
    handleSelectTemplate();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas.current) return;

    console.log('file', file);

    const reader = new FileReader();
    reader.onload = async (event) => {
      console.log('fileUrl', event.target?.result as string);
      const img = await FabricImage.fromURL(
        event.target?.result as string,
        {},
        {
          selectable: false,
        },
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

      function getScaleRatio(img: FabricImage) {
        // Add dynamic scaling based on image dimensions
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.9;
        // Calculate scaling ratio while preserving aspect ratio
        const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!);
        return scale;
      }
      const scale = getScaleRatio(img);
      fabricCanvas.current!.setDimensions({
        width: img.width! * scale,
        height: img.height! * scale,
      });
      img.scale(scale);
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

  const handleSelectTemplate = () => {
    const settingPlaceholder = {
      width: 600,
      height: 908,
      textBoxes: [
        {
          height: 90.61224489795919,
          width: 187.3469387755102,
          left: 55.10204081632653,
          top: 84.48979591836735,
          rotation: 349,
        },
        {
          height: 80.81632653061224,
          width: 143.26530612244898,
          left: 273.0612244897959,
          top: 55.10204081632653,
          rotation: 352,
        },
        {
          height: 121.6938775510204,
          width: 559.5918367346939,
          left: 19.591836734693878,
          top: 753.1530612244899,
          rotation: 0,
        },
      ],
    };

    // Replace placeholder file creation with actual image loading
    fetch('/Two-Buttons-meme-1g8my4.jpg')
      .then((res) => res.blob())
      .then(async (blob) => {
        const img = await FabricImage.fromURL(
          URL.createObjectURL(blob),
          {},
          {
            selectable: false,
          },
        );
        function getScaleRatio() {
          // Add dynamic scaling based on image dimensions
          const maxWidth = window.innerWidth * 0.9;
          const maxHeight = window.innerHeight * 0.9;
          // Calculate scaling ratio while preserving aspect ratio
          const scale = Math.min(
            maxWidth / settingPlaceholder.width,
            maxHeight / settingPlaceholder.height,
            1, // need to add this constraint, otherwise the image will be scaled up to the window's height or width when it is smaller than the window dimensions.
          );
          return scale;
        }
        const scale = getScaleRatio();
        fabricCanvas.current!.setDimensions({
          width: settingPlaceholder.width * scale,
          height: settingPlaceholder.height * scale,
        });
        img.scale(scale);
        fabricCanvas.current!.add(img);

        // Add text boxes with scaled positions
        settingPlaceholder.textBoxes.forEach((textBox) => {
          let left = img.left! + textBox.left * scale; // Reference image's left position
          let top = img.top! + textBox.top * scale; // Reference image's top position
          let originX = 'left';
          let originY = 'top';
          if (textBox.rotation !== 0) {
            left = img.left! + textBox.left * scale;
            top = img.top! + (textBox.top + textBox.height / 2) * scale; //add half height to center the textbox.
            // rotation center is controlled by the originX and originY properties. When the textbox needs to be rotated, different originX-originY pairs produce different UX appearance. After comparing the different pairs, I found what pair produces the best one is originX: 'left', originY: 'center'.
            originX = 'left';
            originY = 'center';
          }
          const text = new Textbox('Edit me', {
            left: left,
            top: top,
            width: textBox.width * scale,
            height: textBox.height * scale,
            originX: originX as TOriginX,
            originY: originY as TOriginY,
            angle: textBox.rotation,
            shadow: defaultTextProps.shadow,
            fontSize: 30, // Dynamic font calculation
            fill: 'black',
            fontFamily: defaultTextProps.fontFamily,
          });

          // Add hover effects like other objects
          text.on('mouseover', () => {
            text._renderControls(
              text.canvas?.contextTop as CanvasRenderingContext2D,
              {
                hasControls: false,
              },
            );
          });
          text.on('mouseout', () =>
            text.canvas?.clearContext(text.canvas.contextTop),
          );
          text.on('mousedown', () =>
            text.canvas?.clearContext(text.canvas.contextTop),
          );

          fabricCanvas.current!.add(text);
        });
        fabricCanvas.current!.renderAll();
      });
  };

  const handleAddTextOutside = () => {
    toast({
      title: 'Text outside',
      description: 'Add text outside',
    });
  };

  const handleDraw = () => {
    toast({
      title: 'Draw',
      description: 'Draw',
    });
  };

  const handleMyAccount = () => {
    toast({
      title: 'My account',
      description: 'My account',
    });
  };
  return (
    <main className='flex min-h-screen gap-4'>
      {/* Simplified Sidebar Controls */}
      <div className='w-20 space-y-6 p-4 bg-gray-100 rounded-lg'>
        <div className='flex flex-col items-center gap-4'>
          {/* select meme template */}
          <SidebarButton
            icon={<LayoutPanelLeft />}
            onClick={handleSelectTemplate}
            text='Template'
          />

          {/* add Text inside*/}
          <SidebarButton
            icon={<Type />}
            onClick={handleAddTextInside}
            text='Inside'
          />

          {/* add text outside */}
          <SidebarButton
            icon={<UnfoldVertical />}
            onClick={handleAddTextOutside}
            text='Outside'
          />

          {/* draw */}
          <SidebarButton icon={<Brush />} onClick={handleDraw} text='Draw' />

          {/* Upload Image */}
          <div className='flex flex-col items-center gap-1 cursor-pointer'>
            <label className='w-fit h-fit p-2 border border-input bg-white rounded-xl'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='hidden'
              />
              <CloudUpload className='size-6' />
            </label>
            <span className='text-sm mt-1'>Upload</span>
          </div>

          <SidebarButton
            icon={<Download />}
            onClick={handleExport}
            text='Download'
          />

          {/* my account*/}
          <SidebarButton
            icon={<User />}
            onClick={handleMyAccount}
            text='Account'
          />
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
      <div className='mt-8 w-fit h-fit'>
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
