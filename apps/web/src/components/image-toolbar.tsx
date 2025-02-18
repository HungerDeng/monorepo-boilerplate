import { TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

import { Tooltip, TooltipContent } from '~*/components/ui/tooltip';

export const defaultImageProps = {
  backgroundColor: '#ffffff',
  opacity: 1,
  flipX: false,
  flipY: false,
};

interface ImageToolbarProps {
  imageProps: typeof defaultImageProps;
  updateImageProperties: (updates: Record<string, any>) => void;
  deleteImageCallback: () => void;
}

export function ImageToolbar({
  imageProps,
  updateImageProperties,
  deleteImageCallback,
}: ImageToolbarProps) {
  return (
    <TooltipProvider>
      <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex items-center gap-4 z-10'>
        {/* Background Color Picker */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='flex items-center gap-2'>
              <span className='text-sm'>BGColor:</span>
              <input
                type='color'
                value={imageProps.backgroundColor}
                onChange={(e) =>
                  updateImageProperties({
                    backgroundColor: e.target.value,
                  })
                }
                className='w-8 h-8'
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Background color</p>
          </TooltipContent>
        </Tooltip>

        {/* Flip Controls */}
        <div className='flex gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  updateImageProperties({
                    flipX: !imageProps.flipX,
                  })
                }
                className={`px-3 py-1 rounded ${imageProps.flipX ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                ↔️ Flip X
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Flip horizontally</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  updateImageProperties({
                    flipY: !imageProps.flipY,
                  })
                }
                className={`px-3 py-1 rounded ${imageProps.flipY ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                ↕️ Flip Y
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Flip vertically</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Transparency Slider */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='flex items-center gap-2 w-32'>
              <span className='text-sm'>Opacity:</span>
              <input
                type='range'
                min='0'
                max='1'
                step='0.1'
                value={imageProps.opacity}
                onChange={(e) =>
                  updateImageProperties({
                    opacity: parseFloat(e.target.value),
                  })
                }
                className='w-full'
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Opacity</p>
          </TooltipContent>
        </Tooltip>

        {/* Reset to Defaults */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                updateImageProperties(defaultImageProps);
              }}
              className='px-2 py-1 rounded hover:bg-gray-100 text-sm'
            >
              Reset
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset to default settings</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                deleteImageCallback();
              }}
              className='px-2 py-1 rounded hover:bg-gray-100 text-sm'
            >
              Delete
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
