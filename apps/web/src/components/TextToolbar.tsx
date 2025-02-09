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

export function TextToolbar({
  textProps,
  updateTextProperties,
}: TextToolbarProps) {
  return (
    <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex items-center gap-4 z-10'>
      {/* Font Family Selector */}
      <select
        title='Change font family'
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
          title='Decrease font size'
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
          title='Font size'
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
          title='Increase font size'
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
        title='Text color'
        type='color'
        value={textProps.fill}
        onChange={(e) => updateTextProperties({ fill: e.target.value })}
        className='w-8 h-8'
      />

      {/* Bold Toggle */}
      <button
        title='Bold'
        onClick={() =>
          updateTextProperties({
            fontWeight: textProps.fontWeight === 'bold' ? 'normal' : 'bold',
          })
        }
        className={`px-2 py-1 rounded ${textProps.fontWeight === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        B
      </button>

      {/* Italic Toggle */}
      <button
        title='Italic'
        onClick={() =>
          updateTextProperties({
            fontStyle: textProps.fontStyle === 'italic' ? 'normal' : 'italic',
          })
        }
        className={`px-2 py-1 rounded ${textProps.fontStyle === 'italic' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        I
      </button>

      {/* Underline Toggle */}
      <button
        title='Underline'
        onClick={() =>
          updateTextProperties({
            underline: !textProps.underline,
          })
        }
        className={`px-2 py-1 rounded ${textProps.underline ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        U
      </button>

      {/* Strikethrough Toggle */}
      <button
        title='Strikethrough'
        onClick={() =>
          updateTextProperties({
            linethrough: !textProps.linethrough,
          })
        }
        className={`px-2 py-1 rounded ${textProps.linethrough ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        S
      </button>

      {/* Uppercase Toggle */}
      <button
        title='Uppercase'
        onClick={() =>
          updateTextProperties({
            uppercase: !textProps.uppercase,
          })
        }
        className={`px-2 py-1 rounded ${textProps.uppercase ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        Aa
      </button>

      {/* Text Alignment */}
      <div className='flex gap-1'>
        <button
          title='Align left'
          onClick={() => updateTextProperties({ textAlign: 'left' })}
          className={`px-2 py-1 rounded ${textProps.textAlign === 'left' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          ←
        </button>
        <button
          title='Center align'
          onClick={() => updateTextProperties({ textAlign: 'center' })}
          className={`px-2 py-1 rounded ${textProps.textAlign === 'center' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          ↔
        </button>
        <button
          title='Align right'
          onClick={() => updateTextProperties({ textAlign: 'right' })}
          className={`px-2 py-1 rounded ${textProps.textAlign === 'right' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          →
        </button>
      </div>

      {/* Spacing Controls */}
      <div className='flex gap-2'>
        <input
          title='Letter spacing'
          type='range'
          value={textProps.charSpacing}
          onChange={(e) =>
            updateTextProperties({ charSpacing: parseFloat(e.target.value) })
          }
          className='w-16 border rounded px-2 py-1'
          min='-200'
          max='400'
          step='1'
          defaultValue='0'
        />
        <input
          title='Line spacing'
          type='range'
          value={textProps.lineHeight}
          onChange={(e) =>
            updateTextProperties({ lineHeight: parseFloat(e.target.value) })
          }
          className='w-16 border rounded px-2 py-1'
          min='0.5'
          max='2.5'
          step='0.01'
          defaultValue='1.05'
        />
      </div>

      {/* Opacity Control */}
      <div className='flex items-center gap-2'>
        <span className='text-sm'>Opacity:</span>
        <input
          title='Text opacity'
          type='range'
          min='0'
          max='1'
          step='0.1'
          value={textProps.opacity}
          onChange={(e) =>
            updateTextProperties({ opacity: parseFloat(e.target.value) })
          }
          className='w-24'
        />
      </div>

      {/* Reset to Defaults */}
      <button
        title='Reset to default settings'
        onClick={() => updateTextProperties(defaultTextProps)}
        className='px-2 py-1 rounded hover:bg-gray-100 text-sm'
      >
        Reset
      </button>
    </div>
  );
}
