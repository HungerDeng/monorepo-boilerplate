export const defaultTextProps = {
  fontFamily: 'Impact',
  fontSize: 48,
  fill: '#ffffff',
  fontWeight: 'normal',
  underline: false,
};

interface TextToolbarProps {
  textProps: typeof defaultTextProps;
  updateTextProperty: (property: string, value: any) => void;
}

export function TextToolbar({
  textProps,
  updateTextProperty,
}: TextToolbarProps) {
  // Helper to get common properties or defaults
  const getTextProperty = (property: string): any => {
    if (property === 'fontFamily') {
      return textProps.fontFamily;
    } else if (property === 'fontSize') {
      return textProps.fontSize;
    } else if (property === 'fill') {
      return textProps.fill;
    } else if (property === 'fontWeight') {
      return textProps.fontWeight;
    } else if (property === 'underline') {
      return textProps.underline;
    }
    return undefined;
  };

  return (
    <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex items-center gap-4 z-10'>
      {/* Font Family Selector */}
      <select
        value={getTextProperty('fontFamily')}
        onChange={(e) => updateTextProperty('fontFamily', e.target.value)}
        className='border rounded px-2 py-1'
      >
        <option value='Open Sans'>Open Sans</option>
        <option value='Impact'>Impact</option>
        <option value='Arial'>Arial</option>
        <option value='Times New Roman'>Times New Roman</option>
      </select>

      {/* Font Size Input */}
      <div className='flex items-center gap-2'>
        <button
          onClick={() =>
            updateTextProperty(
              'fontSize',
              Math.max(1, getTextProperty('fontSize') - 2),
            )
          }
          className='px-2 hover:bg-gray-100 rounded'
        >
          -
        </button>
        <input
          type='number'
          value={getTextProperty('fontSize')}
          onChange={(e) =>
            updateTextProperty(
              'fontSize',
              Math.max(1, parseInt(e.target.value) || 1),
            )
          }
          className='w-16 border rounded px-2 py-1'
        />
        <button
          onClick={() =>
            updateTextProperty('fontSize', getTextProperty('fontSize') + 2)
          }
          className='px-2 hover:bg-gray-100 rounded'
        >
          +
        </button>
      </div>

      {/* Text Color Picker */}
      <input
        type='color'
        value={getTextProperty('fill')}
        onChange={(e) => updateTextProperty('fill', e.target.value)}
        className='w-8 h-8'
      />

      {/* Bold Toggle */}
      <button
        onClick={() =>
          updateTextProperty(
            'fontWeight',
            getTextProperty('fontWeight') === 'bold' ? 'normal' : 'bold',
          )
        }
        className={`px-2 py-1 rounded ${getTextProperty('fontWeight') === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        B
      </button>

      {/* Underline Toggle */}
      <button
        onClick={() =>
          updateTextProperty('underline', !getTextProperty('underline'))
        }
        className={`px-2 py-1 rounded ${getTextProperty('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        U
      </button>

      {/* Reset to Defaults */}
      <button
        onClick={() =>
          updateTextProperty('fontFamily', defaultTextProps.fontFamily)
        }
        className='px-2 py-1 rounded hover:bg-gray-100 text-sm'
      >
        Reset
      </button>
    </div>
  );
}
