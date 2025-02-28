import { Coordinates } from '@dnd-kit/core/dist/types';
import { useState } from 'react';
import { Textfit } from 'react-textfit';

import DRRContainer from './drr-container';

const textFitPlaceholderId = 'te-ph';

const defaultTextConfig: TextConfig = {
  initialText: 'Edit Me.',
  fontColor: '#000000',
  underline: false,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  fontStyle: 'normal',
  verticalTextAlign: 'center',
  horizontalTextAlign: 'center',
  letterSpacing: 0,
  strokeWidth: 0,
  strokeColor: '#000000',
  lineHeight: 1.2,
  textOpacity: 1,
  outlineWidth: 0,
  outlineStyle: 'solid',
  outlineColor: '#000000',
  textShadowX: 0,
  textShadowY: 0,
  textShadowBlur: 0,
  textShadowColor: '#000000',
  backgroundColor: 'transparent',
};

interface TextConfig {
  initialText: string;
  fontColor: string;
  underline: boolean;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  verticalTextAlign: 'top' | 'center' | 'bottom';
  horizontalTextAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  strokeWidth: number;
  strokeColor: string;
  lineHeight: number;
  textOpacity: number;
  outlineWidth: number;
  outlineStyle: string;
  outlineColor: string;
  textShadowX: number;
  textShadowY: number;
  textShadowBlur: number;
  textShadowColor: string;
  backgroundColor: string;
}

interface PositionProps {
  coordinates: Coordinates;
  rotation: number;
  width: number;
  height: number;
}

interface TextAreaProps {
  initialPosition: PositionProps;
  textConfig: TextConfig;
  validAreaId: string;
  toastCallback?: ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => void;
}

function TextArea({
  initialPosition,
  textConfig,
  validAreaId,
  toastCallback,
}: TextAreaProps) {
  const [text, setText] = useState(textConfig.initialText);
  const [textFontSize, setTextFontSize] = useState(0);
  const [isTextEditorFocused, setIsTextEditorFocused] = useState(false);
  const [textAreaWidth, setTextAreaWidth] = useState(initialPosition.width);
  const [textAreaHeight, setTextAreaHeight] = useState(initialPosition.height);

  return (
    <DRRContainer
      initialPosition={initialPosition}
      validAreaId={validAreaId}
      isHandlesVisible={isTextEditorFocused}
      sizeChangeCallback={(newWidth, newHeight) => {
        setTextAreaWidth(newWidth);
        setTextAreaHeight(newHeight);
      }}
      toastCallback={toastCallback}
    >
      <div className='w-full h-full'>
        {/* Textfit is invisible, because we just use it for calculating suitabletextFontSize */}
        <Textfit
          id={textFitPlaceholderId}
          mode='multi'
          className={`invisible ${textAreaWidth}px ${textAreaHeight}px h-full flex ${
            textConfig.verticalTextAlign === 'top'
              ? 'items-start'
              : textConfig.verticalTextAlign === 'center'
                ? 'items-center'
                : 'items-end'
          }`}
          onReady={(e) => {
            // TODO(not high priority): [Textfit Font Scaling] Investigate binary search implementation in resize fontSize algorithm
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
              color: textConfig.fontColor,
              textDecoration: textConfig.underline ? 'underline' : 'none',
              fontFamily: textConfig.fontFamily,
              textAlign: textConfig.horizontalTextAlign as
                | 'left'
                | 'center'
                | 'right',
              letterSpacing: `${textConfig.letterSpacing}px`,
              WebkitTextStroke: `${textConfig.strokeWidth}px ${textConfig.strokeColor}`,
              lineHeight: `${textConfig.lineHeight}em`,
              opacity: textConfig.textOpacity,
              fontStyle:
                textConfig.fontStyle === 'italic' ? 'italic' : 'normal',
              fontWeight: textConfig.fontWeight === 'bold' ? 'bold' : 'normal',
              outline: `${textConfig.outlineWidth}px ${textConfig.outlineStyle} ${textConfig.outlineColor}`,
              textShadow: `${textConfig.textShadowX}px ${textConfig.textShadowY}px ${textConfig.textShadowBlur}px ${textConfig.textShadowColor}`,
              backgroundColor: textConfig.backgroundColor,
            }}
          >
            {text}
          </div>
        </Textfit>

        {/* Text editor */}
        <div
          className={`absolute left-0 top-0 w-full h-full flex ${
            textConfig.verticalTextAlign === 'top'
              ? 'items-start'
              : textConfig.verticalTextAlign === 'center'
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
              className='relative z-10 cursor-text'
              style={{
                color: textConfig.fontColor,
                textDecoration: textConfig.underline ? 'underline' : 'none',
                fontFamily: textConfig.fontFamily,
                fontSize: textFontSize,
                textAlign: textConfig.horizontalTextAlign as
                  | 'left'
                  | 'center'
                  | 'right',
                letterSpacing: `${textConfig.letterSpacing}px`,
                WebkitTextStroke: `${textConfig.strokeWidth}px ${textConfig.strokeColor}`,
                lineHeight: `${textConfig.lineHeight}em`,
                opacity: textConfig.textOpacity,
                fontStyle:
                  textConfig.fontStyle === 'italic' ? 'italic' : 'normal',
                fontWeight:
                  textConfig.fontWeight === 'bold' ? 'bold' : 'normal',
                outline: `${textConfig.outlineWidth}px ${textConfig.outlineStyle} ${textConfig.outlineColor}`,
                textShadow: `${textConfig.textShadowX}px ${textConfig.textShadowY}px ${textConfig.textShadowBlur}px ${textConfig.textShadowColor}`,
                backgroundColor: textConfig.backgroundColor,
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
              onBlur={(e) => {
                // Only blur if the new focused element isn't a handle
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget?.querySelector('.handle')) {
                  setIsTextEditorFocused(false);
                } else {
                  // TODO(not high priority): interacting with the drag handle when the text editor is focused will cause the focus to be lost. But the 'isTextEditorFocused' state is still true, preventing the DRRHandles from becoming invisible. So looks like it's not a big issue now.
                  e.currentTarget.focus();
                }
              }}
            >
              Edit Me.
            </div>
          </div>
        </div>
      </div>
    </DRRContainer>
  );
}

export default TextArea;
export { defaultTextConfig, textFitPlaceholderId };
