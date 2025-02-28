'use client';

import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import TextArea, {
  defaultTextConfig,
  textFitPlaceholderId,
} from 'src/components/text-area';

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

  const handleExport = async () => {
    if (!editorWorkspaceRef.current) return;

    try {
      const filter = (node: HTMLElement) => {
        return !node.id?.includes(textFitPlaceholderId);
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
        <TextArea
          initialPosition={{
            coordinates: {
              x: 55.10204081632653,
              y: 84.48979591836735,
            },
            rotation: 349,
            width: 187.3469387755102,
            height: 90.61224489795919,
          }}
          textConfig={defaultTextConfig}
        />

        {/* Second button rectangle */}
        <TextArea
          initialPosition={{
            coordinates: {
              x: 273.0612244897959,
              y: 55.10204081632653,
            },
            rotation: 352,
            width: 143.26530612244898,
            height: 80.81632653061224,
          }}
          textConfig={defaultTextConfig}
        />

        {/* Bottom text rectangle */}
        <TextArea
          initialPosition={{
            coordinates: {
              x: 19.591836734693878,
              y: 753.1530612244899,
            },
            rotation: 0,
            width: 559.5918367346939,
            height: 121.6938775510204,
          }}
          textConfig={defaultTextConfig}
        />
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
      </div>
    </div>
  );
}
