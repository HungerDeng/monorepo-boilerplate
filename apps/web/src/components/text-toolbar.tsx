import { TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { SketchPicker } from 'react-color';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~*/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~*/components/ui/tabs';
import { Tooltip, TooltipContent } from '~*/components/ui/tooltip';

export const defaultTextProps = {
  fontFamily: 'Impact',
  fontSize: 48,
  fill: '#ffffff',
  fontWeight: 'normal', // bold or normal
  fontStyle: 'normal', // italic or normal
  underline: false,
  linethrough: false, // strikethrough
  uppercase: false,
  textAlign: 'left', // left, center, right
  charSpacing: 0, // letter spacing: -200 to 400
  lineHeight: 1.2, // line spacing: 0.5 to 2.5
  opacity: 1, // opacity: 0 to 1
};

interface TextToolbarProps {
  textProps: typeof defaultTextProps;
  updateTextProperties: (updates: Record<string, any>) => void;
}

interface TextColorPickerProps {
  textColor: string;
  updateTextColorCallback: (color: string) => void;
}

const TextColorPicker = ({
  textColor,
  updateTextColorCallback,
}: TextColorPickerProps) => {
  return (
    <div className='flex flex-col gap-4 p-2'>
      <div className='grid grid-cols-4 gap-1'>
        {[
          '#abcdfg',
          '#D0021B',
          '#F5A623',
          '#F8E71C',
          '#8B572A',
          '#7ED321',
          '#417505',
          '#BD10E0',
          '#9013FE',
          '#4A90E2',
          '#50E3C2',
          '#B8E986',
          '#000000',
          '#4A4A4A',
          '#9B9B9B',
          '#FFFFFF',
        ].map((color, index) => (
          <div
            key={color}
            onClick={() => {
              if (index === 0) return;
              updateTextColorCallback(color);
            }}
            className='relative w-10 h-10 rounded-full cursor-pointer'
            style={{
              backgroundColor: index === 0 ? '#FFFFFF' : color,
              border: '2px solid white',
              boxShadow:
                color === textColor ? '0 0 0 2px #000' : '0 0 0 1px #ddd',
            }}
          >
            {index === 0 && (
              <Popover>
                <PopoverTrigger
                  asChild
                  className='absolute inset-0 flex items-center justify-center'
                >
                  <span className='text-2xl text-gray-600'>+</span>
                </PopoverTrigger>
                <PopoverContent className='max-w-fit p-0 m-0'>
                  <SketchPicker
                    color={textColor}
                    onChangeComplete={(color: any) =>
                      updateTextColorCallback(color.hex)
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export function TextToolbar({
  textProps,
  updateTextProperties,
}: TextToolbarProps) {
  return (
    <TooltipProvider>
      <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex items-center gap-4 z-10'>
        {/* Font Family Selector */}
        <Tooltip>
          <TooltipTrigger asChild>
            <select
              value={textProps.fontFamily}
              onChange={(e) =>
                updateTextProperties({ fontFamily: e.target.value })
              }
              className='border rounded px-2 py-1'
            >
              <option value='Open Sans'>Open Sans</option>
              <option value='Impact'>Impact</option>
              <option value='Arial'>Arial</option>
              <option value='Times New Roman'>Times New Roman</option>
            </select>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change font family</p>
          </TooltipContent>
        </Tooltip>

        {/* Font Size Input */}
        <div className='flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  updateTextProperties({
                    fontSize: Math.max(1, textProps.fontSize - 2),
                  })
                }
                className='px-2 hover:bg-gray-100 rounded'
              >
                -
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Decrease font size</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <input
                type='number'
                value={textProps.fontSize}
                onChange={(e) =>
                  updateTextProperties({
                    fontSize: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className='w-16 border rounded px-2 py-1'
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Change font size</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  updateTextProperties({
                    fontSize: textProps.fontSize + 2,
                  })
                }
                className='px-2 hover:bg-gray-100 rounded'
              >
                +
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Increase font size</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Bold Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                updateTextProperties({
                  fontWeight:
                    textProps.fontWeight === 'bold' ? 'normal' : 'bold',
                })
              }
              className={`px-2 py-1 rounded ${textProps.fontWeight === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              B
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold</p>
          </TooltipContent>
        </Tooltip>

        {/* Italic Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                updateTextProperties({
                  fontStyle:
                    textProps.fontStyle === 'italic' ? 'normal' : 'italic',
                })
              }
              className={`px-2 py-1 rounded ${textProps.fontStyle === 'italic' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              I
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic</p>
          </TooltipContent>
        </Tooltip>

        {/* Underline Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                updateTextProperties({
                  underline: !textProps.underline,
                })
              }
              className={`px-2 py-1 rounded ${textProps.underline ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              U
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Underline</p>
          </TooltipContent>
        </Tooltip>

        {/* Strikethrough Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                updateTextProperties({
                  linethrough: !textProps.linethrough,
                })
              }
              className={`px-2 py-1 rounded ${textProps.linethrough ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              S
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strikethrough</p>
          </TooltipContent>
        </Tooltip>

        {/* Uppercase Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                updateTextProperties({
                  uppercase: !textProps.uppercase,
                })
              }
              className={`px-2 py-1 rounded ${textProps.uppercase ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              Aa
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Uppercase</p>
          </TooltipContent>
        </Tooltip>

        {/* Text Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button className='px-2 py-1 rounded hover:bg-gray-100'>
              color
            </button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-1'>
            <Tabs defaultValue='text' className='w-[400px]'>
              <TabsList>
                <TabsTrigger value='text'>Text</TabsTrigger>
                <TabsTrigger value='outline'>Outline</TabsTrigger>
                <TabsTrigger value='shadow'>Shadow</TabsTrigger>
                <TabsTrigger value='background'>Background</TabsTrigger>
              </TabsList>

              <TabsContent value='text'>
                <TextColorPicker
                  textColor={textProps.fill}
                  updateTextColorCallback={(color) =>
                    updateTextProperties({ fill: color })
                  }
                />
              </TabsContent>

              <TabsContent value='outline'>
                <label className='block text-sm font-medium'>
                  Outline
                  <input
                    type='color'
                    value={textProps.fill}
                    onChange={(e) =>
                      updateTextProperties({ fill: e.target.value })
                    }
                    className='w-8 h-8'
                  />
                </label>
              </TabsContent>
              <TabsContent value='shadow'>
                <label className='block text-sm font-medium'>
                  Shadow
                  <input
                    type='color'
                    value={textProps.fill}
                    onChange={(e) =>
                      updateTextProperties({ fill: e.target.value })
                    }
                    className='w-8 h-8'
                  />
                </label>
              </TabsContent>
              <TabsContent value='background'>
                <label className='block text-sm font-medium'>
                  Background
                  <input
                    type='color'
                    value={textProps.fill}
                    onChange={(e) =>
                      updateTextProperties({ fill: e.target.value })
                    }
                    className='w-8 h-8'
                  />
                </label>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        {/* Text Alignment - Updated to Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`px-2 py-1 rounded ${
                ['left', 'center', 'right'].includes(textProps.textAlign)
                  ? 'bg-gray-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              alignment
            </button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-1'>
            <div className='flex flex-col gap-1'>
              <button
                onClick={() => updateTextProperties({ textAlign: 'left' })}
                className={`px-2 py-1 rounded ${
                  textProps.textAlign === 'left'
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                ← Left
              </button>
              <button
                onClick={() => updateTextProperties({ textAlign: 'center' })}
                className={`px-2 py-1 rounded ${
                  textProps.textAlign === 'center'
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                ↔ Center
              </button>
              <button
                onClick={() => updateTextProperties({ textAlign: 'right' })}
                className={`px-2 py-1 rounded ${
                  textProps.textAlign === 'right'
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                → Right
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Spacing Controls */}
        <div className='flex gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <button className='px-2 py-1 rounded hover:bg-gray-100'>
                spacing
              </button>
            </PopoverTrigger>
            <PopoverContent className='w-64 p-4'>
              <div className='space-y-4'>
                <label className='block text-sm font-medium'>
                  Letter Spacing
                  <div className='flex items-center gap-2'>
                    <input
                      type='range'
                      value={textProps.charSpacing}
                      onChange={(e) =>
                        updateTextProperties({
                          charSpacing: parseFloat(e.target.value),
                        })
                      }
                      className='flex-1 mt-2'
                      min='-200'
                      max='400'
                      step='1'
                    />
                    <div className='w-12 h-8 flex items-center justify-center border rounded'>
                      {textProps.charSpacing}
                    </div>
                  </div>
                </label>

                <label className='block text-sm font-medium'>
                  Line Height
                  <div className='flex items-center gap-2'>
                    <input
                      type='range'
                      value={textProps.lineHeight}
                      onChange={(e) =>
                        updateTextProperties({
                          lineHeight: parseFloat(e.target.value),
                        })
                      }
                      className='flex-1 mt-2'
                      min='0.5'
                      max='2.5'
                      step='0.1'
                    />
                    <div className='w-12 h-8 flex items-center justify-center border rounded'>
                      {textProps.lineHeight}
                    </div>
                  </div>
                </label>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Opacity Control */}
        <Popover>
          <PopoverTrigger asChild>
            <button className='px-2 py-1 rounded hover:bg-gray-100'>
              opacity
            </button>
          </PopoverTrigger>
          <PopoverContent className='w-64 p-4'>
            <div className='space-y-4'>
              <label className='block text-sm font-medium'>
                Opacity
                <div className='flex items-center gap-2'>
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.1'
                    value={textProps.opacity}
                    onChange={(e) =>
                      updateTextProperties({
                        opacity: parseFloat(e.target.value),
                      })
                    }
                    className='flex-1 mt-2'
                  />
                  <div className='w-12 h-8 flex items-center justify-center border rounded'>
                    {textProps.opacity}
                  </div>
                </div>
              </label>
            </div>
          </PopoverContent>
        </Popover>

        {/* Reset to Defaults */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => updateTextProperties(defaultTextProps)}
              className='px-2 py-1 rounded hover:bg-gray-100 text-sm'
            >
              Reset
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset to default settings</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
