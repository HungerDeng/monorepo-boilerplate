import { DndContext, useSensor, useSensors } from '@dnd-kit/core';
import { Coordinates } from '@dnd-kit/core/dist/types';
import { Move, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

import Draggable, { MouseSensor } from './draggable';

interface PositionProps {
  coordinates: Coordinates;
  rotation: number;
  width: number;
  height: number;
}

interface DRRContainerProps {
  initialPosition: PositionProps;
  validAreaId: string;
  isHandlesVisible: boolean;
  children: React.ReactNode;
  sizeChangeCallback?: (newWidth: number, newHeight: number) => void;
  toastCallback?: ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => void;
}

// DRR stands for "Drag, Rotate, Resize"
const DRRHandles = ({
  isVisible,
  onRotateHandleMouseDown,
  isRotating,
  onResizeHandleMouseDown,
}: {
  isVisible: boolean;
  onRotateHandleMouseDown: (e: React.MouseEvent) => void;
  isRotating: boolean;
  onResizeHandleMouseDown: (handleType: string, e: React.MouseEvent) => void;
}) => {
  const borderColor = 'border-gray-800';
  const borderWidth = 'border-[1px]';
  const bgColor = 'bg-stone-50';
  return (
    <div className='absolute left-0 top-0 w-full h-full cursor-move'>
      {/* scale corner handles */}
      {/* Top-left corner square */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -top-1.5 -left-1.5 cursor-nwse-resize ${
          isVisible ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('top-left', e)}
      />
      {/* Top-right corner square */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -top-1.5 -right-1.5 cursor-nesw-resize ${
          isVisible ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('top-right', e)}
      />
      {/* Bottom-left corner square */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -bottom-1.5 -left-1.5 cursor-nesw-resize ${
          isVisible ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('bottom-left', e)}
      />
      {/* Bottom-right corner square */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -bottom-1.5 -right-1.5 cursor-nwse-resize ${
          isVisible ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('bottom-right', e)}
      />

      {/* resize corner handles */}
      {/* Center-top handle */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -top-1.5 left-1/2 -translate-x-1/2 hover:cursor-row-resize ${
          isVisible ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('top', e)}
      />
      {/* Center-bottom handle */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -bottom-1.5 left-1/2 -translate-x-1/2 hover:cursor-row-resize ${
          isVisible ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('bottom', e)}
      />
      {/* Left-center handle */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -left-1.5 top-1/2 -translate-y-1/2 hover:cursor-col-resize ${
          isVisible ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('left', e)}
      />
      {/* Right-center handle */}
      <div
        data-no-dnd
        className={`handle absolute w-3 h-3 ${bgColor} ${borderWidth} ${borderColor} -right-1.5 top-1/2 -translate-y-1/2 hover:cursor-col-resize ${
          isVisible ? 'visible' : 'invisible'
        } `}
        onMouseDown={(e) => onResizeHandleMouseDown('right', e)}
      />

      {/* rotate handle */}
      <div
        data-no-dnd
        className={`handle absolute w-4 h-4 ${bgColor} ${borderWidth} ${borderColor} -bottom-6 left-[40%] -translate-x-1/2 rounded-full hover:cursor-ew-resize ${
          isRotating ? 'bg-blue-300' : 'hover:bg-blue-300'
        } ${isVisible ? 'visible' : 'invisible'} `}
        onMouseDown={onRotateHandleMouseDown}
      >
        <RefreshCcw className='w-full h-full p-[2px] text-gray-800' />
      </div>

      {/* move handle */}
      {/* left-[60%] and -translate-x-1/2 work together to create different reference points:
      - left-[60%]: Positions the element's left edge at 60% of the parent's width
      - -translate-x-1/2: Then shifts the entire element leftward by 50% of its own width

      Visual Result: The element's center point aligns with the parent's 60% position, rather than its left edge. This creates precise control over centering relative to a specific percentage position.

      Without translation: The element's left edge would be at 60%, potentially misaligned from design intent
      */}
      <div
        className={`handle absolute w-4 h-4 ${bgColor} ${borderWidth} ${borderColor} -bottom-6 left-[60%] -translate-x-1/2 rounded-full hover:cursor-move hover:bg-blue-300 ${
          isVisible ? 'visible' : 'invisible'
        } `}
      >
        <Move className='w-full h-full p-[2px] text-gray-800' />
      </div>
    </div>
  );
};

function DRRContainer({
  initialPosition,
  validAreaId,
  isHandlesVisible,
  children,
  sizeChangeCallback,
  toastCallback,
}: DRRContainerProps) {
  const [rectWidth, setRectWidth] = useState(initialPosition.width);
  const [rectHeight, setRectHeight] = useState(initialPosition.height);
  const [{ x, y }, setCoordinates] = useState<Coordinates>(
    initialPosition.coordinates,
  );
  const [rotation, setRotation] = useState(initialPosition.rotation);
  const mouseSensor = useSensor(MouseSensor);
  const sensors = useSensors(mouseSensor);
  const [isRotating, setIsRotating] = useState(false);

  const checkVisibleAreaValid = (
    x: number,
    y: number,
    width: number,
    height: number,
    threshold = 0.5,
  ) => {
    const workspace = document.getElementById(validAreaId);
    if (!workspace) return true;

    const { width: workspaceWidth, height: workspaceHeight } =
      workspace.getBoundingClientRect();
    const draggableArea = width * height;

    const visibleWidth = Math.max(
      0,
      Math.min(x + width, workspaceWidth) - Math.max(x, 0),
    );
    const visibleHeight = Math.max(
      0,
      Math.min(y + height, workspaceHeight) - Math.max(y, 0),
    );
    const visibleArea = visibleWidth * visibleHeight;

    return visibleArea / draggableArea >= threshold;
  };

  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRotating(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const centerX = x + rectWidth / 2;
    const centerY = y + rectHeight / 2;
    const initialAngle =
      Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI);
    const initialRotation = rotation;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const currentY = moveEvent.clientY;
      const currentAngle =
        Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI);
      const delta = currentAngle - initialAngle;
      let newRotation = initialRotation + delta;
      newRotation = ((newRotation % 360) + 360) % 360; // Normalize to 0-360
      // seems that the rotation will always pass the checkVisibleAreaValid function, so we don't need to check it again.
      setRotation(newRotation);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsRotating(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (handleType: string, e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = rectWidth;
    const initialHeight = rectHeight;
    const initialX = x;
    const initialY = y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const currentY = moveEvent.clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      let newWidth = initialWidth;
      let newHeight = initialHeight;
      let newX = initialX;
      let newY = initialY;

      switch (handleType) {
        // TODO(not high priority): If we want to fix the position of one edge of the draggable element when using the opposite resize corner handle, we also need to modify the rotation angle of the element, but it makes the code more complex. Given that the current interaction effect is totally acceptable, so it's not a high priority task now.
        case 'top':
          newHeight = initialHeight - deltaY;
          newY = initialY + deltaY;
          newWidth = initialWidth;
          break;
        case 'bottom':
          newHeight = initialHeight + deltaY;
          newWidth = initialWidth;
          break;
        case 'left':
          newWidth = initialWidth - deltaX;
          newX = initialX + deltaX;
          newHeight = initialHeight;
          break;
        case 'right':
          newWidth = initialWidth + deltaX;
          newHeight = initialHeight;
          break;
        case 'top-left':
          newWidth = initialWidth - deltaX;
          newHeight = initialHeight - deltaY;
          newX = initialX + deltaX;
          newY = initialY + deltaY;
          break;
        case 'top-right':
          newWidth = initialWidth + deltaX;
          newHeight = initialHeight - deltaY;
          newY = initialY + deltaY;
          break;
        case 'bottom-left':
          newWidth = initialWidth - deltaX;
          newHeight = initialHeight + deltaY;
          newX = initialX + deltaX;
          break;
        case 'bottom-right':
          newWidth = initialWidth + deltaX;
          newHeight = initialHeight + deltaY;
          break;
      }

      if (newWidth > 0 && newHeight > 0) {
        if (!checkVisibleAreaValid(newX, newY, newWidth, newHeight)) {
          toastCallback?.({
            title: 'For your information',
            message:
              'It is not allowed to extend the text area outside its container area by more than 50%. BTW, only the area within the template+spacing area will be rendered when you download.',
          });
          return;
        } else {
          setRectWidth(newWidth);
          setRectHeight(newHeight);
          setCoordinates({ x: newX, y: newY });
          sizeChangeCallback?.(newWidth, newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ delta }) => {
        const newX = x + delta.x;
        const newY = y + delta.y;
        const workspace = document.getElementById(validAreaId);

        if (workspace) {
          if (!checkVisibleAreaValid(newX, newY, rectWidth, rectHeight)) {
            toastCallback?.({
              title: 'For your information',
              message:
                'It is not allowed to move the text area outside its container area by more than 50%. BTW, only the area within the template+spacing area will be rendered when you download.',
            });
            // directly return without updating the coordinates, so the text area will return to the last valid position
            return;
          }
        }

        setCoordinates({ x: newX, y: newY });
      }}
    >
      <Draggable
        left={x}
        top={y}
        rotation={rotation}
        width={rectWidth}
        height={rectHeight}
        className={`absolute hover:outline-[1.5px] ${
          isHandlesVisible
            ? 'outline-gray-800 outline-dashed'
            : 'hover:outline-gray-800 hover:outline-dashed'
        }`}
      >
        {children}
        <DRRHandles
          isVisible={isHandlesVisible}
          onRotateHandleMouseDown={handleRotateMouseDown}
          onResizeHandleMouseDown={handleResizeMouseDown}
          isRotating={isRotating}
        />
      </Draggable>
    </DndContext>
  );
}

export default DRRContainer;
