import { TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Shadow } from 'fabric';
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

export const defaultTextProps = {
  fontFamily: 'Impact',
  fontSize: 48,
  fill: 'white', // text color
  stroke: 'black', // outline color
  strokeWidth: 2, // outline width
  shadow: new Shadow({
    color: 'transparent',
    blur: 0,
    offsetX: 0,
    offsetY: 0,
  }),
  backgroundColor: 'transparent',
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
  deleteTextCallback: () => void;
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

export function TextToolbar({
  textProps,
  updateTextProperties,
  deleteTextCallback,
}: TextToolbarProps) {
  const [fontFamilyOpen, setFontFamilyOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex items-center gap-1 z-10'>
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
                  {textProps.fontFamily
                    ? textProps.fontFamily
                    : 'Select font...'}
                  <ChevronsUpDown className='opacity-50' />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>
              <p>Change font family</p>
            </TooltipContent>
          </Tooltip>

          <PopoverContent className='w-auto p-1'>
            <Command>
              <CommandInput placeholder='Search font...' />
              <CommandList>
                <CommandEmpty>No font found.</CommandEmpty>
                <CommandGroup>
                  {fonts.map((font) => (
                    <CommandItem
                      key={font.value}
                      onSelect={() => {
                        updateTextProperties({ fontFamily: font.value });
                        setFontFamilyOpen(false);
                      }}
                    >
                      {font.label}
                      {textProps.fontFamily === font.value && (
                        <Check className='ml-auto h-4 w-4' aria-hidden='true' />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Font Size Input */}
        <div className='flex items-strech border-input border-[1px] rounded-md'>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  updateTextProperties({
                    fontSize: Math.max(1, textProps.fontSize - 2),
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
                value={textProps.fontSize}
                onChange={(e) =>
                  updateTextProperties({
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
                  updateTextProperties({
                    fontSize: textProps.fontSize + 2,
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
                updateTextProperties({
                  fontStyle:
                    textProps.fontStyle === 'italic' ? 'normal' : 'italic',
                })
              }
              className={`px-2 py-1 rounded ${textProps.fontStyle === 'italic' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
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
                updateTextProperties({
                  underline: !textProps.underline,
                })
              }
              className={`px-2 py-1 rounded ${textProps.underline ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
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
                updateTextProperties({
                  linethrough: !textProps.linethrough,
                })
              }
              className={`px-2 py-1 rounded ${textProps.linethrough ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
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
                updateTextProperties({
                  uppercase: !textProps.uppercase,
                })
              }
              className={`px-2 py-1 rounded ${textProps.uppercase ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
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
          <PopoverContent className='w-auto p-1'>
            <Tabs defaultValue='text'>
              <TabsList className='h-fit gap-1'>
                <TabsTrigger value='text'>
                  <div className='flex flex-col items-center gap-2'>
                    <div
                      className='w-8 h-8 rounded-md mb-0 border-2 border-gray-300'
                      style={{ backgroundColor: textProps.fill }}
                    />
                    Text
                  </div>
                </TabsTrigger>
                <TabsTrigger value='outline'>
                  <div className='flex flex-col items-center gap-2'>
                    <div
                      className='w-8 h-8 rounded-md mb-0 border-2 border-gray-300'
                      style={{ backgroundColor: textProps.stroke }}
                    />
                    Outline
                  </div>
                </TabsTrigger>
                <TabsTrigger value='shadow'>
                  <div className='flex flex-col items-center gap-2'>
                    <div
                      className='w-8 h-8 rounded-md mb-0 border-2 border-gray-300'
                      style={{ backgroundColor: textProps.shadow.color }}
                    />
                    Shadow
                  </div>
                </TabsTrigger>
                <TabsTrigger value='background'>
                  <div className='flex flex-col items-center gap-2'>
                    <div
                      className='w-8 h-8 rounded-md mb-0 border-2 border-gray-300'
                      style={{ backgroundColor: textProps.backgroundColor }}
                    />
                    Bg
                  </div>
                </TabsTrigger>
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
                <TextColorPicker
                  textColor={textProps.stroke}
                  updateTextColorCallback={(color) =>
                    updateTextProperties({ stroke: color })
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
                      value={textProps.strokeWidth}
                      onChange={(e) =>
                        updateTextProperties({
                          strokeWidth: parseFloat(e.target.value),
                        })
                      }
                      className='flex-1 mt-2'
                    />
                    <div className='w-12 h-8 flex items-center justify-center border rounded'>
                      {textProps.strokeWidth}
                    </div>
                  </div>
                </label>
              </TabsContent>

              <TabsContent value='shadow'>
                <TextColorPicker
                  textColor={textProps.shadow.color}
                  updateTextColorCallback={(color) =>
                    updateTextProperties({
                      shadow: new Shadow({
                        color,
                        blur: textProps.shadow.blur,
                        offsetX: textProps.shadow.offsetX,
                        offsetY: textProps.shadow.offsetY,
                      }),
                    })
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
                      value={textProps.shadow.blur}
                      onChange={(e) =>
                        updateTextProperties({
                          shadow: new Shadow({
                            color: textProps.shadow.color,
                            blur: parseFloat(e.target.value),
                            offsetX: textProps.shadow.offsetX,
                            offsetY: textProps.shadow.offsetY,
                          }),
                        })
                      }
                      className='flex-1 mt-2'
                    />
                    <div className='w-12 h-8 flex items-center justify-center border rounded'>
                      {textProps.shadow.blur}
                    </div>
                  </div>
                </label>
              </TabsContent>

              <TabsContent value='background'>
                <TextColorPicker
                  textColor={textProps.backgroundColor}
                  updateTextColorCallback={(color) =>
                    updateTextProperties({ backgroundColor: color })
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
                  {textProps.textAlign === 'left' ? (
                    <AlignLeft className='w-5 h-5' />
                  ) : textProps.textAlign === 'center' ? (
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

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={deleteTextCallback}
              className='px-2 py-1 rounded hover:bg-gray-100 text-sm'
            >
              <Trash2 className='w-5 h-5' />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
