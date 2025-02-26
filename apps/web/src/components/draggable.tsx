import { useDraggable } from '@dnd-kit/core';

interface DraggableProps {
  top: number;
  left: number;
  rotation: number;
  width: number;
  height: number;
  className?: string;
  children: React.ReactNode;
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
