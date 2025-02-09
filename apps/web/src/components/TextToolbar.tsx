export const defaultTextProps = {
  fontFamily: 'Impact',
  fontSize: 48,
  fill: '#ffffff',
  fontWeight: 'normal',
  underline: false,
};

interface TextToolbarProps {
  textProps: typeof defaultTextProps;
  updateTextProperties: (updates: Record<string, any>) => void;
}

export function TextToolbar({
  textProps,
  updateTextProperties,
}: TextToolbarProps) {
  return (
    <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex items-center gap-4 z-10'>
      {/* Font Family Selector */}
      <select
        value={textProps.fontFamily}
        onChange={(e) => updateTextProperties({ fontFamily: e.target.value })}
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
            updateTextProperties({
              fontSize: Math.max(1, textProps.fontSize - 2),
            })
          }
          className='px-2 hover:bg-gray-100 rounded'
        >
          -
        </button>
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
      </div>

      {/* Text Color Picker */}
      <input
        type='color'
        value={textProps.fill}
        onChange={(e) => updateTextProperties({ fill: e.target.value })}
        className='w-8 h-8'
      />

      {/* Bold Toggle */}
      <button
        onClick={() =>
          updateTextProperties({
            fontWeight: textProps.fontWeight === 'bold' ? 'normal' : 'bold',
          })
        }
        className={`px-2 py-1 rounded ${textProps.fontWeight === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        B
      </button>

      {/* Underline Toggle */}
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

      {/* Reset to Defaults */}
      <button
        onClick={() => updateTextProperties(defaultTextProps)}
        className='px-2 py-1 rounded hover:bg-gray-100 text-sm'
      >
        Reset
      </button>
    </div>
  );
}
