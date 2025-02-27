'use client';

import { DndContext, useSensor, useSensors } from '@dnd-kit/core';
import { Coordinates } from '@dnd-kit/core/dist/types/coordinates';
import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import { Textfit } from 'react-textfit';
import Draggable, { MouseSensor } from 'src/components/draggable';

const CornerHandles = ({
  isTextEditorFocused,
}: {
  isTextEditorFocused: boolean;
}) => {
  const borderColor = 'border-gray-800';
  const borderWidth = 'border-[1px]';
  const bgColor = 'bg-stone-50';
  const hoverOpacity = 'opacity-100';
  return (
    <div className='absolute left-0 top-0 w-full h-full'>
      {/* scale corner handles */}
      {/* Top-left corner square */}
      <div
        data-no-dnd
        className={`border-2 absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -top-1.5 -left-1.5 ${
          isTextEditorFocused
            ? 'opacity-100'
            : `opacity-0 group-hover:${hoverOpacity}`
        } `}
      />
      {/* Top-right corner square */}
      <div
        data-no-dnd
        className={`absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -top-1.5 -right-1.5 ${
          isTextEditorFocused
            ? 'opacity-100'
            : `opacity-0 group-hover:${hoverOpacity}`
        } `}
      />
      {/* Bottom-left corner square */}
      <div
        data-no-dnd
        className={`absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -bottom-1.5 -left-1.5 ${
          isTextEditorFocused
            ? 'opacity-100'
            : `opacity-0 group-hover:${hoverOpacity}`
        } `}
      />
      {/* Bottom-right corner square */}
      <div
        data-no-dnd
        className={`absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -bottom-1.5 -right-1.5 ${
          isTextEditorFocused
            ? 'opacity-100'
            : `opacity-0 group-hover:${hoverOpacity}`
        } `}
      />

      {/* resize corner handles */}
      {/* todo: add resize handles */}
      {/* Center-top handle */}
      <div
        data-no-dnd
        className={`absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -top-1.5 left-1/2 -translate-x-1/2 ${
          isTextEditorFocused
            ? 'opacity-100'
            : `opacity-0 group-hover:${hoverOpacity}`
        } `}
      />
      {/* Center-bottom handle */}
      <div
        data-no-dnd
        className={`absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -bottom-1.5 left-1/2 -translate-x-1/2 ${
          isTextEditorFocused
            ? 'opacity-100'
            : `opacity-0 group-hover:${hoverOpacity}`
        } `}
      />
      {/* Left-center handle */}
      <div
        data-no-dnd
        className={`absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -left-1.5 top-1/2 -translate-y-1/2 ${
          isTextEditorFocused
            ? 'opacity-100'
            : `opacity-0 group-hover:${hoverOpacity}`
        } `}
      />
      {/* Right-center handle */}
      <div
        data-no-dnd
        className={`absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -right-1.5 top-1/2 -translate-y-1/2 ${
          isTextEditorFocused
            ? 'opacity-100'
            : `opacity-0 group-hover:${hoverOpacity}`
        } `}
      />
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
  // const [rotation, setRotation] = useState(349);
  const mouseSensor = useSensor(MouseSensor);
  const sensors = useSensors(mouseSensor);
  const [isTextEditorFocused, setIsTextEditorFocused] = useState(false);

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
            setCoordinates((prev) => ({
              x: prev.x + delta.x,
              y: prev.y + delta.y,
            }));
          }}
        >
          <Draggable
            left={x}
            top={y}
            rotation={349}
            width={rectWidth}
            height={rectHeight}
            className={`absolute bg-green-200 hover:outline-[1.5px] ${
              isTextEditorFocused
                ? 'outline-gray-800 outline-dashed'
                : 'hover:outline-gray-800 hover:outline-dashed'
            } group`}
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
                // TODO: [Textfit Font Scaling] Investigate binary search implementation in resize fontSize algorithm
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
                  className='relative z-10'
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
                  onBlur={() => setIsTextEditorFocused(false)}
                >
                  Edit Me.
                </div>
              </div>
            </div>

            <CornerHandles isTextEditorFocused={isTextEditorFocused} />
          </Draggable>
        </DndContext>

        {/* Second button rectangle */}
        <div
          className='absolute bg-gray-500/50'
          style={{
            height: rectHeight,
            width: rectWidth,
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
