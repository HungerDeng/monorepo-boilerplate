export const defaultImageProps = {
  backgroundColor: '#ffffff',
  opacity: 1,
  flipX: false,
  flipY: false,
};

interface ImageToolbarProps {
  imageProps: typeof defaultImageProps;
  updateImageProperties: (updates: Record<string, any>) => void;
}

export function ImageToolbar({
  imageProps,
  updateImageProperties,
}: ImageToolbarProps) {
  return (
    <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex items-center gap-4 z-10'>
      {/* Background Color Picker */}
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

      {/* Flip Controls */}
      <div className='flex gap-2'>
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
      </div>

      {/* Transparency Slider */}
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

      {/* Reset to Defaults */}
      <button
        onClick={() => {
          updateImageProperties(defaultImageProps);
        }}
        className='px-2 py-1 rounded hover:bg-gray-100 text-sm'
      >
        Reset
      </button>
    </div>
  );
}
