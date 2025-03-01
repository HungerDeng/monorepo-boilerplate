import {
  MouseSensor as LibMouseSensor,
  TouchSensor as LibTouchSensor,
  useDraggable,
} from '@dnd-kit/core';
import { MouseEvent, TouchEvent } from 'react';

// copyright: https://github.com/clauderic/dnd-kit/issues/477#issuecomment-1713536492
// Block DnD event propagation if element have "data-no-dnd" attribute
const handler = ({ nativeEvent: event }: MouseEvent | TouchEvent) => {
  let cur = event.target as HTMLElement;

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement as HTMLElement;
  }

  return true;
};

export class MouseSensor extends LibMouseSensor {
  static activators = [
    { eventName: 'onMouseDown', handler },
  ] as (typeof LibMouseSensor)['activators'];
}

export class TouchSensor extends LibTouchSensor {
  static activators = [
    { eventName: 'onTouchStart', handler },
  ] as (typeof LibTouchSensor)['activators'];
}

interface DraggableProps {
  top: number;
  left: number;
  rotation: number;
  width: number;
  height: number;
  className?: string;
  children: React.ReactNode;
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
}

function Draggable(props: DraggableProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: 'draggable',
    });

  return (
    <div
      className={`${props.className}`}
      ref={setNodeRef}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      style={{
        top: props.top,
        left: props.left,
        width: props.width,
        height: props.height,
        transform: `rotate(${props.rotation}deg)`,
        translate: `${transform?.x ?? 0}px ${transform?.y ?? 0}px`,
      }}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </div>
  );
}

export default Draggable;
