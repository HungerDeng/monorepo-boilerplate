'use client';

import { DndContext, useSensor, useSensors } from '@dnd-kit/core';
import { Coordinates } from '@dnd-kit/core/dist/types/coordinates';
import { toPng } from 'html-to-image';
import { Move, RefreshCcw } from 'lucide-react';
import { useRef, useState } from 'react';
import { Textfit } from 'react-textfit';
import Draggable, { MouseSensor } from 'src/components/draggable';

// DRR stands for "Drag, Rotate, Resize"
const DRRHandles = ({
  isTextEditorFocused,
  onRotateHandleMouseDown,
  isRotating,
  onResizeHandleMouseDown,
}: {
  isTextEditorFocused: boolean;
  onRotateHandleMouseDown: (e: React.MouseEvent) => void;
  isRotating: boolean;
  onResizeHandleMouseDown: (handleType: string, e: React.MouseEvent) => void;
}) => {
  const borderColor = 'border-gray-800';
  const borderWidth = 'border-[1px]';
  const bgColor = 'bg-stone-50';
  return (
    <div className='absolute left-0 top-0 w-full h-full cursor-move'>
      {/* scale corner handles */}
      {/* Top-left corner square */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -top-1.5 -left-1.5 cursor-nwse-resize ${
          isTextEditorFocused ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('top-left', e)}
      />
      {/* Top-right corner square */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -top-1.5 -right-1.5 cursor-nesw-resize ${
          isTextEditorFocused ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('top-right', e)}
      />
      {/* Bottom-left corner square */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -bottom-1.5 -left-1.5 cursor-nesw-resize ${
          isTextEditorFocused ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('bottom-left', e)}
      />
      {/* Bottom-right corner square */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -bottom-1.5 -right-1.5 cursor-nwse-resize ${
          isTextEditorFocused ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('bottom-right', e)}
      />

      {/* resize corner handles */}
      {/* Center-top handle */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -top-1.5 left-1/2 -translate-x-1/2 hover:cursor-row-resize ${
          isTextEditorFocused ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('top', e)}
      />
      {/* Center-bottom handle */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -bottom-1.5 left-1/2 -translate-x-1/2 hover:cursor-row-resize ${
          isTextEditorFocused ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('bottom', e)}
      />
      {/* Left-center handle */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -left-1.5 top-1/2 -translate-y-1/2 hover:cursor-col-resize ${
          isTextEditorFocused ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('left', e)}
      />
      {/* Right-center handle */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -right-1.5 top-1/2 -translate-y-1/2 hover:cursor-col-resize ${
          isTextEditorFocused ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('right', e)}
      />

      {/* rotate handle */}
      <div
        data-no-dnd
        className={`handle absolute w-4 h-4 ${bgColor} ${borderWidth} ${borderColor} -bottom-6 left-[40%] -translate-x-1/2 rounded-full hover:cursor-ew-resize ${
          isRotating ? 'bg-blue-300' : 'hover:bg-blue-300'
        } ${isTextEditorFocused ? 'visible' : 'invisible'} `}
        onMouseDown={onRotateHandleMouseDown}
      >
        <RefreshCcw className='w-full h-full p-[2px] text-gray-800' />
      </div>

      {/* move handle */}
      {/* left-[60%] and -translate-x-1/2 work together to create different reference points:
      - left-[60%]: Positions the element's left edge at 60% of the parent's width
      - -translate-x-1/2: Then shifts the entire element leftward by 50% of its own width

      Visual Result: The element's center point aligns with the parent's 60% position, rather than its left edge. This creates precise control over centering relative to a specific percentage position.

      Without translation: The element's left edge would be at 60%, potentially misaligned from design intent
      */}
      <div
        className={`handle absolute w-4 h-4 ${bgColor} ${borderWidth} ${borderColor} -bottom-6 left-[60%] -translate-x-1/2 rounded-full hover:cursor-move hover:bg-blue-300 ${
          isTextEditorFocused ? 'visible' : 'invisible'
        } `}
      >
        <Move className='w-full h-full p-[2px] text-gray-800' />
      </div>
    </div>
  );
};

export default function TwoButtonsPage() {
  const editorWorkspaceRef = useRef<HTMLDivElement>(null);
  const [fontColor, setFontColor] = useState('#000000');
  const [underline, setUnderline] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [horizontalTextAlign, setHorizontalTextAlign] = useState('center');
  const [verticalTextAlign, setVerticalTextAlign] = useState('center');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [lineHeight, setLineHeight] = useState(1.2);
  const [textOpacity, setTextOpacity] = useState(1);
  const [isItalic, setIsItalic] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [outlineWidth, setOutlineWidth] = useState(0);
  const [outlineStyle, setOutlineStyle] = useState('solid');
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [textShadowX, setTextShadowX] = useState(0);
  const [textShadowY, setTextShadowY] = useState(0);
  const [textShadowBlur, setTextShadowBlur] = useState(0);
  const [textShadowColor, setTextShadowColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  const textEditorPlaceholderId = 'te-ph';

  const [text, setText] = useState('Edit Me.');
  const [textFontSize, setTextFontSize] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleExport = async () => {
    if (!editorWorkspaceRef.current) return;

    try {
      const filter = (node: HTMLElement) => {
        return !node.id?.includes(textEditorPlaceholderId);
      };
      const dataUrl = await toPng(editorWorkspaceRef.current, {
        cacheBust: true,
        filter: filter,
      });
      const link = document.createElement('a');
      link.download = 'meme-export.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const defaultCoordinates = {
    x: 55.10204081632653, //left
    y: 84.48979591836735, //top
  };
  const [rectWidth, setRectWidth] = useState(187.3469387755102);
  const [rectHeight, setRectHeight] = useState(90.61224489795919);
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const [rotation, setRotation] = useState(349);
  const mouseSensor = useSensor(MouseSensor);
  const sensors = useSensors(mouseSensor);
  const [isTextEditorFocused, setIsTextEditorFocused] = useState(false);

  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRotating(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const centerX = x + rectWidth / 2;
    const centerY = y + rectHeight / 2;
    const initialAngle =
      Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI);
    const initialRotation = rotation;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const currentY = moveEvent.clientY;
      const currentAngle =
        Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI);
      const delta = currentAngle - initialAngle;
      let newRotation = initialRotation + delta;
      newRotation = ((newRotation % 360) + 360) % 360; // Normalize to 0-360
      setRotation(newRotation);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsRotating(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (handleType: string, e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = rectWidth;
    const initialHeight = rectHeight;
    const initialX = x;
    const initialY = y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const currentY = moveEvent.clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      let newWidth = initialWidth;
      let newHeight = initialHeight;
      let newX = initialX;
      let newY = initialY;

      switch (handleType) {
        // TODO(not high priority): If we want to fix the position of one edge of the draggable element when using the opposite resize corner handle, we also need to modify the rotation angle of the element, but it makes the code more complex. Given that the current interaction effect is totally acceptable, so it's not a high priority task now.
        case 'top':
          newHeight = initialHeight - deltaY;
          newY = initialY + deltaY;
          newWidth = initialWidth;
          break;
        case 'bottom':
          newHeight = initialHeight + deltaY;
          newWidth = initialWidth;
          break;
        case 'left':
          newWidth = initialWidth - deltaX;
          newX = initialX + deltaX;
          newHeight = initialHeight;
          break;
        case 'right':
          newWidth = initialWidth + deltaX;
          newHeight = initialHeight;
          break;
        case 'top-left':
          newWidth = initialWidth - deltaX;
          newHeight = initialHeight - deltaY;
          newX = initialX + deltaX;
          newY = initialY + deltaY;
          break;
        case 'top-right':
          newWidth = initialWidth + deltaX;
          newHeight = initialHeight - deltaY;
          newY = initialY + deltaY;
          break;
        case 'bottom-left':
          newWidth = initialWidth - deltaX;
          newHeight = initialHeight + deltaY;
          newX = initialX + deltaX;
          break;
        case 'bottom-right':
          newWidth = initialWidth + deltaX;
          newHeight = initialHeight + deltaY;
          break;
      }

      if (newWidth > 0 && newHeight > 0) {
        setRectWidth(newWidth);
        setRectHeight(newHeight);
        setCoordinates({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className='flex gap-4 justify-center items-start min-h-screen bg-gray-100'>
      <div id='editor-workspace' className='relative' ref={editorWorkspaceRef}>
        <img
          src='/Two-Buttons-meme-1g8my4.jpg'
          alt='Two Buttons Meme'
          width={600}
          height={908}
        />

        {/* First button rectangle */}
        {/* dnd-kit usage refer to: https://github.com/clauderic/dnd-kit/blob/master/stories/1%20-%20Core/Draggable/1-Draggable.story.tsx#L112 */}
        <DndContext
          sensors={sensors}
          onDragEnd={({ delta }) => {
            const newX = x + delta.x;
            const newY = y + delta.y;
            const workspace = document.getElementById('editor-workspace');

            if (workspace) {
              const { width: workspaceWidth, height: workspaceHeight } =
                workspace.getBoundingClientRect();
              const draggableArea = rectWidth * rectHeight;

              // Calculate visible area within workspace
              const visibleWidth = Math.max(
                0,
                Math.min(newX + rectWidth, workspaceWidth) - Math.max(newX, 0),
              );
              const visibleHeight = Math.max(
                0,
                Math.min(newY + rectHeight, workspaceHeight) -
                  Math.max(newY, 0),
              );
              const visibleArea = visibleWidth * visibleHeight;

              // Show error if less than {threshold * 100 }% of area is visible
              const threshold = 0.5;
              if (visibleArea / draggableArea < threshold) {
                // TODO(today): expose a callback to toast error message
                console.error(
                  `It is not allowed to move the text area outside the template area by more than ${threshold * 100}%. BTW, only the area within the meme template area will be rendered when you download.`,
                );
                // directly return without updating the coordinates, so the text area will return to the last valid position
                return;
              }
            }

            setCoordinates({ x: newX, y: newY });
          }}
        >
          <Draggable
            left={x}
            top={y}
            rotation={rotation}
            width={rectWidth}
            height={rectHeight}
            className={`absolute bg-green-200 hover:outline-[1.5px] ${
              isTextEditorFocused
                ? 'outline-gray-800 outline-dashed'
                : 'hover:outline-gray-800 hover:outline-dashed'
            }`}
          >
            {/* Textfit is invisible, because we just use it for calculating suitabletextFontSize */}
            <Textfit
              id={textEditorPlaceholderId}
              mode='multi'
              className={`invisible w-full h-full flex ${
                verticalTextAlign === 'top'
                  ? 'items-start'
                  : verticalTextAlign === 'center'
                    ? 'items-center'
                    : 'items-end'
              }`}
              onReady={(e) => {
                // TODO(not high priority): [Textfit Font Scaling] Investigate binary search implementation in resize fontSize algorithm
                //
                // Problem: Font size adjustments exhibit non-linear jumps when text exceeds container bounds.
                // - Observed 2px decrements after reaching critical threshold (13px → 11px -> 9px -> 7px -> ...)
                // - Overflow state persists between size transitions
                //
                // Reproduction steps:
                // 1. Input long continuous string (e.g., "range?.insertNode(document.createTextNode(text));")
                // 2. Observe gradual font scaling until threshold (13px)
                // 3. Continue input → overflow occurs without immediately resizing
                // 4. Subsequent input triggers abrupt 2px decrements
                //
                // Suspected cause: Binary search implementation in font scaling algorithm may:
                // - Use improper bounds calculation
                // - Lack debouncing between resize calculations
                // - Have minimum step size constraints
                //
                // Conclusion: the bug is not a top priority now.
                if (e != textFontSize) {
                  // console.log('onReady textFontSize changed, update: ', e);
                  setTextFontSize(e);
                }
              }}
            >
              <div
                style={{
                  color: fontColor,
                  textDecoration: underline ? 'underline' : 'none',
                  fontFamily,
                  textAlign: horizontalTextAlign as 'left' | 'center' | 'right',
                  letterSpacing: `${letterSpacing}px`,
                  WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
                  lineHeight: `${lineHeight}em`,
                  opacity: textOpacity,
                  fontStyle: isItalic ? 'italic' : 'normal',
                  fontWeight: isBold ? 'bold' : 'normal',
                  outline: `${outlineWidth}px ${outlineStyle} ${outlineColor}`,
                  textShadow: `${textShadowX}px ${textShadowY}px ${textShadowBlur}px ${textShadowColor}`,
                  backgroundColor: backgroundColor,
                }}
              >
                {text}
              </div>
            </Textfit>

            {/* Text editor */}
            <div
              className={`absolute left-0 top-0 w-full h-full flex ${
                verticalTextAlign === 'top'
                  ? 'items-start'
                  : verticalTextAlign === 'center'
                    ? 'items-center'
                    : 'items-end'
              }`}
            >
              <div style={{ display: 'block' }}>
                <div
                  id='text-editor'
                  contentEditable
                  suppressContentEditableWarning
                  data-no-dnd
                  className='relative z-10 cursor-text'
                  style={{
                    color: fontColor,
                    textDecoration: underline ? 'underline' : 'none',
                    fontFamily,
                    fontSize: textFontSize,
                    textAlign: horizontalTextAlign as
                      | 'left'
                      | 'center'
                      | 'right',
                    letterSpacing: `${letterSpacing}px`,
                    WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
                    lineHeight: `${lineHeight}em`,
                    opacity: textOpacity,
                    fontStyle: isItalic ? 'italic' : 'normal',
                    fontWeight: isBold ? 'bold' : 'normal',
                    outline: `${outlineWidth}px ${outlineStyle} ${outlineColor}`,
                    textShadow: `${textShadowX}px ${textShadowY}px ${textShadowBlur}px ${textShadowColor}`,
                    backgroundColor: backgroundColor,
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    // when pasting text from clipboard, we need to strip out any existing formatting styles from the pasted text
                    const text = e.clipboardData.getData('text/plain');
                    const range = document.getSelection()?.getRangeAt(0);
                    range?.deleteContents();
                    range?.insertNode(document.createTextNode(text));

                    // need to manually trigger input update event (onInput) to update the textFontSize
                    const event = new Event('input', { bubbles: true });
                    e.currentTarget.dispatchEvent(event);
                  }}
                  onInput={(e) => {
                    setText(e.currentTarget.textContent || '');
                  }}
                  onFocus={() => setIsTextEditorFocused(true)}
                  onBlur={(e) => {
                    // Only blur if the new focused element isn't a handle
                    const relatedTarget = e.relatedTarget as HTMLElement;
                    if (!relatedTarget?.querySelector('.handle')) {
                      setIsTextEditorFocused(false);
                    } else {
                      // TODO(not high priority): interacting with the drag handle when the text editor is focused will cause the focus to be lost. But the 'isTextEditorFocused' state is still true, preventing the DRRHandles from becoming invisible. So looks like it's not a big issue now.
                      e.currentTarget.focus();
                    }
                  }}
                >
                  Edit Me.
                </div>
              </div>
            </div>

            <DRRHandles
              isTextEditorFocused={isTextEditorFocused}
              onRotateHandleMouseDown={handleRotateMouseDown}
              onResizeHandleMouseDown={handleResizeMouseDown}
              isRotating={isRotating}
            />
          </Draggable>
        </DndContext>

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
            key={`${rectWidth}-${rectHeight}`}
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

        <div className='flex flex-col gap-4 p-4 bg-gray-50 rounded-lg'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Text Color</label>
            <input
              type='color'
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className='w-20 h-10'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Background Color</label>
            <input
              type='color'
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className='w-20 h-10'
            />
          </div>

          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={underline}
              onChange={(e) => setUnderline(e.target.checked)}
              className='w-4 h-4'
            />
            <label className='text-sm font-medium'>Underline</label>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className='p-2 border rounded'
            >
              <option value='Arial'>Arial</option>
              <option value='Helvetica'>Helvetica</option>
              <option value='Times New Roman'>Times New Roman</option>
              <option value='Courier New'>Courier New</option>
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>
              Horizontal Text Alignment
            </label>
            <select
              value={horizontalTextAlign}
              onChange={(e) => setHorizontalTextAlign(e.target.value)}
              className='p-2 border rounded'
            >
              <option value='left'>Left</option>
              <option value='center'>Center</option>
              <option value='right'>Right</option>
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>
              Vertical Text Alignment
            </label>
            <select
              value={verticalTextAlign}
              onChange={(e) => setVerticalTextAlign(e.target.value)}
              className='p-2 border rounded'
            >
              <option value='top'>Top</option>
              <option value='center'>Center</option>
              <option value='bottom'>Bottom</option>
            </select>
          </div>

          {/* Letter Spacing */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>
              Letter Spacing: {letterSpacing}px
            </label>
            <input
              type='range'
              min='-5'
              max='20'
              step='0.1'
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(Number(e.target.value))}
              className='w-48'
            />
          </div>

          {/* Text Stroke */}
          <div className='flex flex-col gap-2'>
            <div className='flex gap-4'>
              <div className='flex-1'>
                <label className='text-sm font-medium'>
                  Text Stroke: {strokeWidth}px
                </label>
                <input
                  type='range'
                  min='0'
                  max='5'
                  step='0.1'
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className='w-full'
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm font-medium'>Stroke Color</label>
                <input
                  type='color'
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className='w-10 h-10'
                />
              </div>
            </div>
          </div>

          {/* Line Height */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>
              Line Height: {lineHeight}em
            </label>
            <input
              type='range'
              min='0.5'
              max='3'
              step='0.1'
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className='w-48'
            />
          </div>

          {/* Text Opacity */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>
              Text Opacity: {Math.round(textOpacity * 100)}%
            </label>
            <input
              type='range'
              min='0'
              max='1'
              step='0.01'
              value={textOpacity}
              onChange={(e) => setTextOpacity(Number(e.target.value))}
              className='w-48'
            />
          </div>

          {/* Outline Controls */}
          <div className='flex flex-col gap-2'>
            <div className='flex gap-4'>
              <div className='flex-1'>
                <label className='text-sm font-medium'>
                  Outline Width: {outlineWidth}px
                </label>
                <input
                  type='range'
                  min='0'
                  max='10'
                  value={outlineWidth}
                  onChange={(e) => setOutlineWidth(Number(e.target.value))}
                  className='w-full'
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm font-medium'>Outline Color</label>
                <input
                  type='color'
                  value={outlineColor}
                  onChange={(e) => setOutlineColor(e.target.value)}
                  className='w-10 h-10'
                />
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium'>Outline Style</label>
              <select
                value={outlineStyle}
                onChange={(e) => setOutlineStyle(e.target.value)}
                className='p-2 border rounded'
              >
                <option value='solid'>Solid</option>
                <option value='dotted'>Dotted</option>
                <option value='dashed'>Dashed</option>
                <option value='double'>Double</option>
              </select>
            </div>
          </div>

          {/* Style Toggles */}
          <div className='flex gap-4'>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={isItalic}
                onChange={(e) => setIsItalic(e.target.checked)}
                className='w-4 h-4'
              />
              <label className='text-sm font-medium'>Italic</label>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={isBold}
                onChange={(e) => setIsBold(e.target.checked)}
                className='w-4 h-4'
              />
              <label className='text-sm font-medium'>Bold</label>
            </div>
          </div>

          {/* Text Shadow Controls */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium'>
                Text Shadow X: {textShadowX}px
              </label>
              <input
                type='range'
                min='-10'
                max='10'
                value={textShadowX}
                onChange={(e) => setTextShadowX(Number(e.target.value))}
                className='w-48'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium'>
                Text Shadow Y: {textShadowY}px
              </label>
              <input
                type='range'
                min='-10'
                max='10'
                value={textShadowY}
                onChange={(e) => setTextShadowY(Number(e.target.value))}
                className='w-48'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium'>
                Blur Radius: {textShadowBlur}px
              </label>
              <input
                type='range'
                min='0'
                max='20'
                value={textShadowBlur}
                onChange={(e) => setTextShadowBlur(Number(e.target.value))}
                className='w-48'
              />
            </div>
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium'>Shadow Color</label>
              <input
                type='color'
                value={textShadowColor}
                onChange={(e) => setTextShadowColor(e.target.value)}
                className='w-20 h-10'
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>
              Height: {rectHeight.toFixed(1)}px
            </label>
            <input
              type='range'
              min='50'
              max='200'
              step='1'
              value={rectHeight}
              onChange={(e) => setRectHeight(parseFloat(e.target.value))}
              className='w-48'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>
              Width: {rectWidth.toFixed(1)}px
            </label>
            <input
              type='range'
              min='100'
              max='300'
              step='1'
              value={rectWidth}
              onChange={(e) => setRectWidth(parseFloat(e.target.value))}
              className='w-48'
            />
          </div>
        </div>

        {/* <div
          contentEditable
          suppressContentEditableWarning
          className='outline-4 max-w-[100px] focus:ring-2 focus:ring-blue-500'
          onInput={(e) => {
            const text = e.currentTarget.textContent || '';
            // Create temporary span for text measurement
            const span = document.createElement('span');
            span.style.whiteSpace = 'nowrap';
            span.textContent = text;

            // Copy computed styles from original element
            const styles = window.getComputedStyle(e.currentTarget);
            span.style.font = styles.font;
            span.style.padding = styles.padding;

            // Measure text width
            document.body.appendChild(span);
            const textWidth = span.offsetWidth;
            document.body.removeChild(span);

            console.log(
              'text:',
              text,
              'text-width:',
              textWidth,
              'container-width:',
              e.currentTarget.clientWidth,
            );
          }}
        >
          Edit Me
        </div> */}
      </div>
    </div>
  );
}
