import { TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowUpDown,
  Bold,
  Check,
  ChevronsUpDown,
  Grid3X3,
  Italic,
  PaintRoller,
  Palette,
  Strikethrough,
  Trash2,
  Underline,
} from 'lucide-react';
import { useState } from 'react';
import { SketchPicker } from 'react-color';

import { Button } from '~*/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~*/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~*/components/ui/popover';
import { Separator } from '~*/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~*/components/ui/tabs';
import { Tooltip, TooltipContent } from '~*/components/ui/tooltip';

import { TextConfig } from './text-area';

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
      <div className='grid grid-cols-4 gap-1 justify-items-center'>
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

const fonts = [
  {
    label: 'Open Sans',
    value: 'Open Sans',
  },
  {
    label: 'Impact',
    value: 'Impact',
  },
  {
    label: 'Arial',
    value: 'Arial',
  },
  {
    label: 'Times New Roman',
    value: 'Times New Roman',
  },
  {
    label: 'Comic Sans MS',
    value: 'Comic Sans MS',
  },
];

interface TextToolbarProps {
  className?: string;
  textConfig?: TextConfig;
  copyMode: boolean;
  deleteTextCallback: () => void;
  updateTextConfig: (updates: Record<string, any>) => void;
  copyAllTextStyleCallback: (
    updates: TextConfig | null,
    latestCopyMode: boolean,
  ) => void;
}

export function TextToolbar({
  className,
  textConfig,
  copyMode,
  deleteTextCallback,
  updateTextConfig,
  copyAllTextStyleCallback,
}: TextToolbarProps) {
  const [fontFamilyOpen, setFontFamilyOpen] = useState(false);
  return textConfig ? (
    <TooltipProvider>
      <div
        className={`bg-white shadow-lg rounded-lg p-2 flex items-center gap-1 border border-gray-200 ${className}`}
      >
        {/* Font Family Selector */}
        <Popover open={fontFamilyOpen} onOpenChange={setFontFamilyOpen}>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={fontFamilyOpen}
                  className='justify-between truncate w-[100px] pl-1'
                >
                  {textConfig.fontFamily
                    ? textConfig.fontFamily
                    : 'Select font...'}
                  <ChevronsUpDown className='opacity-50' />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>
              <p>Change font family</p>
            </TooltipContent>
          </Tooltip>

          <PopoverContent className='text-toolbar-popover w-auto p-1'>
            <Command>
              <CommandInput placeholder='Search font...' />
              <CommandList>
                <CommandEmpty>No font found.</CommandEmpty>
                <CommandGroup>
                  {fonts.map((font) => (
                    <CommandItem
                      key={font.value}
                      onSelect={() => {
                        updateTextConfig({ fontFamily: font.value });
                        setFontFamilyOpen(false);
                      }}
                    >
                      {font.label}
                      {textConfig.fontFamily === font.value && (
                        <Check className='ml-auto h-4 w-4' aria-hidden='true' />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Font Size Input. text fontSize adjustment is unsupported, because fontSize is calculated by dimension of the text area*/}
        {/* <div className='flex items-strech border-input border-[1px] rounded-md'>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  updateTextConfig({
                    fontSize: Math.max(1, textConfig.fontSize - 2),
                  })
                }
                className='px-2 hover:bg-gray-100'
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
                value={textConfig.fontSize}
                onChange={(e) =>
                  updateTextConfig({
                    fontSize: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className='w-10 rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
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
                  updateTextConfig({
                    fontSize: textConfig.fontSize + 2,
                  })
                }
                className='px-2 hover:bg-gray-100'
              >
                +
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Increase font size</p>
            </TooltipContent>
          </Tooltip>
        </div> */}

        {/* Bold Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                updateTextConfig({
                  fontWeight:
                    textConfig.fontWeight === 'bold' ? 'normal' : 'bold',
                })
              }
              className={`px-2 py-1 rounded ${textConfig.fontWeight === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Bold className='w-5 h-5' />
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
                updateTextConfig({
                  fontStyle:
                    textConfig.fontStyle === 'italic' ? 'normal' : 'italic',
                })
              }
              className={`px-2 py-1 rounded ${textConfig.fontStyle === 'italic' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Italic className='w-5 h-5' />
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
                updateTextConfig({
                  underline: !textConfig.underline,
                })
              }
              className={`px-2 py-1 rounded ${textConfig.underline ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Underline className='w-5 h-5' />
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
                updateTextConfig({
                  linethrough: !textConfig.linethrough,
                })
              }
              className={`px-2 py-1 rounded ${textConfig.linethrough ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Strikethrough className='w-5 h-5' />
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
                updateTextConfig({
                  uppercase: !textConfig.uppercase,
                })
              }
              className={`px-2 py-1 rounded ${textConfig.uppercase ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <span className='text-lg'>Aa</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Uppercase</p>
          </TooltipContent>
        </Tooltip>

        {/* Text Color Picker */}
        <Popover>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <button className='px-2 py-1 rounded hover:bg-gray-100'>
                  <Palette className='w-5 h-5' />
                </button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>
              <p>Color</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className='text-toolbar-popover w-auto p-1'>
            <Tabs defaultValue='text'>
              <TabsList className='h-fit gap-1'>
                <TabsTrigger value='text'>
                  <div className='flex flex-col items-center gap-2'>
                    <div
                      className='w-8 h-8 rounded-md mb-0 border-2 border-gray-300'
                      style={{ backgroundColor: textConfig.fontColor }}
                    />
                    Text
                  </div>
                </TabsTrigger>
                <TabsTrigger value='outline'>
                  <div className='flex flex-col items-center gap-2'>
                    <div
                      className='w-8 h-8 rounded-md mb-0 border-2 border-gray-300'
                      style={{ backgroundColor: textConfig.strokeColor }}
                    />
                    Outline
                  </div>
                </TabsTrigger>
                <TabsTrigger value='shadow'>
                  <div className='flex flex-col items-center gap-2'>
                    <div
                      className='w-8 h-8 rounded-md mb-0 border-2 border-gray-300'
                      style={{ backgroundColor: textConfig.textShadowColor }}
                    />
                    Shadow
                  </div>
                </TabsTrigger>
                <TabsTrigger value='background'>
                  <div className='flex flex-col items-center gap-2'>
                    <div
                      className='w-8 h-8 rounded-md mb-0 border-2 border-gray-300'
                      style={{ backgroundColor: textConfig.backgroundColor }}
                    />
                    Bg
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value='text'>
                <TextColorPicker
                  textColor={textConfig.fontColor}
                  updateTextColorCallback={(color) =>
                    updateTextConfig({ fontColor: color })
                  }
                />
              </TabsContent>

              <TabsContent value='outline'>
                <TextColorPicker
                  textColor={textConfig.strokeColor}
                  updateTextColorCallback={(color) =>
                    updateTextConfig({ strokeColor: color })
                  }
                />
                <Separator className='my-4' />
                <label className='block text-sm font-medium'>
                  Outline Width
                  <div className='flex items-center gap-2'>
                    <input
                      type='range'
                      min='0'
                      max='5'
                      step='0.2'
                      value={textConfig.strokeWidth}
                      onChange={(e) =>
                        updateTextConfig({
                          strokeWidth: parseFloat(e.target.value),
                        })
                      }
                      className='flex-1 mt-2'
                    />
                    <div className='w-12 h-8 flex items-center justify-center border rounded'>
                      {textConfig.strokeWidth}
                    </div>
                  </div>
                </label>
              </TabsContent>

              <TabsContent value='shadow'>
                <TextColorPicker
                  textColor={textConfig.textShadowColor}
                  updateTextColorCallback={(color) =>
                    updateTextConfig({ textShadowColor: color })
                  }
                />
                <Separator className='my-4' />
                <label className='block text-sm font-medium'>
                  Shadow Width
                  <div className='flex items-center gap-2'>
                    <input
                      type='range'
                      min='0'
                      max='30'
                      step='1'
                      value={textConfig.textShadowBlur}
                      onChange={(e) =>
                        updateTextConfig({
                          textShadowBlur: parseFloat(e.target.value),
                        })
                      }
                      className='flex-1 mt-2'
                    />
                    <div className='w-12 h-8 flex items-center justify-center border rounded'>
                      {textConfig.textShadowBlur}
                    </div>
                  </div>
                </label>
              </TabsContent>

              <TabsContent value='background'>
                <TextColorPicker
                  textColor={textConfig.backgroundColor}
                  updateTextColorCallback={(color) =>
                    updateTextConfig({ backgroundColor: color })
                  }
                />
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        {/* Text Alignment - Updated to Popover */}
        <Popover>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <button className='px-2 py-1 rounded hover:bg-gray-100'>
                  {textConfig.horizontalTextAlign === 'left' ? (
                    <AlignLeft className='w-5 h-5' />
                  ) : textConfig.horizontalTextAlign === 'center' ? (
                    <AlignCenter className='w-5 h-5' />
                  ) : (
                    <AlignRight className='w-5 h-5' />
                  )}
                </button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>
              <p>Alignment</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className='text-toolbar-popover w-auto p-1'>
            <div className='flex flex-col gap-1'>
              <button
                onClick={() =>
                  updateTextConfig({ horizontalTextAlign: 'left' })
                }
                className={`px-2 py-1 rounded ${
                  textConfig.horizontalTextAlign === 'left'
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                ← Left
              </button>
              <button
                onClick={() =>
                  updateTextConfig({ horizontalTextAlign: 'center' })
                }
                className={`px-2 py-1 rounded ${
                  textConfig.horizontalTextAlign === 'center'
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                ↔ Center
              </button>
              <button
                onClick={() =>
                  updateTextConfig({ horizontalTextAlign: 'right' })
                }
                className={`px-2 py-1 rounded ${
                  textConfig.horizontalTextAlign === 'right'
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
            <Tooltip>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <button className='px-2 py-1 rounded hover:bg-gray-100'>
                    <ArrowUpDown className='w-5 h-5' />
                  </button>
                </TooltipTrigger>
              </PopoverTrigger>
              <TooltipContent>
                <p>Spacing</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent className='text-toolbar-popover w-64 p-4'>
              <div className='space-y-4'>
                <label className='block text-sm font-medium'>
                  Letter Spacing
                  <div className='flex items-center gap-2'>
                    <input
                      type='range'
                      value={textConfig.letterSpacing}
                      onChange={(e) =>
                        updateTextConfig({
                          letterSpacing: parseFloat(e.target.value),
                        })
                      }
                      className='flex-1 mt-2'
                      min='-200'
                      max='400'
                      step='1'
                    />
                    <div className='w-12 h-8 flex items-center justify-center border rounded'>
                      {textConfig.letterSpacing}
                    </div>
                  </div>
                </label>

                <label className='block text-sm font-medium'>
                  Line Height
                  <div className='flex items-center gap-2'>
                    <input
                      type='range'
                      value={textConfig.lineHeight}
                      onChange={(e) =>
                        updateTextConfig({
                          lineHeight: parseFloat(e.target.value),
                        })
                      }
                      className='flex-1 mt-2'
                      min='0.5'
                      max='2.5'
                      step='0.1'
                    />
                    <div className='w-12 h-8 flex items-center justify-center border rounded'>
                      {textConfig.lineHeight}
                    </div>
                  </div>
                </label>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Opacity Control */}
        <Popover>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <button className='px-2 py-1 rounded hover:bg-gray-100'>
                  <Grid3X3 className='w-5 h-5' />
                </button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>
              <p>Opacity</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className='text-toolbar-popover w-64 p-4'>
            <div className='space-y-4'>
              <label className='block text-sm font-medium'>
                Opacity
                <div className='flex items-center gap-2'>
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.1'
                    value={textConfig.textOpacity}
                    onChange={(e) =>
                      updateTextConfig({
                        textOpacity: parseFloat(e.target.value),
                      })
                    }
                    className='flex-1 mt-2'
                  />
                  <div className='w-12 h-8 flex items-center justify-center border rounded'>
                    {textConfig.textOpacity}
                  </div>
                </div>
              </label>
            </div>
          </PopoverContent>
        </Popover>

        {/* Reset to Defaults */}
        {/* <Tooltip>
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
        </Tooltip> */}

        {/* copy style to affect other textbox fast */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                if (copyMode) {
                  copyAllTextStyleCallback(null, false);
                } else {
                  copyAllTextStyleCallback(textConfig, true);
                }
              }}
              className={`px-2 py-1 rounded ${
                copyMode ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-100'
              } text-sm`}
            >
              <PaintRoller className='w-5 h-5' />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copyMode ? 'Click any text to apply style' : 'Copy style'}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={deleteTextCallback}
              className='px-2 py-1 rounded hover:bg-gray-100 text-sm'
            >
              <Trash2 className='w-5 h-5 text-red-500' />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ) : null;
}
