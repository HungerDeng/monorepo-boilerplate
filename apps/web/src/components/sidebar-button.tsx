import React, { ReactElement } from 'react';

export const SidebarButton = ({
  icon,
  onClick,
  text,
}: {
  icon: ReactElement;
  onClick: () => void;
  text: string;
}) => (
  <div
    className='flex flex-col items-center gap-1 cursor-pointer'
    onClick={onClick}
  >
    {/* Added [&>svg]:!size-5 to target direct child SVGs sizing*/}
    <div className='w-fit h-fit p-2 border border-input bg-white rounded-xl hover:bg-gray-200 [&>svg]:!size-5'>
      {React.cloneElement(icon)}
    </div>
    <span className='text-sm'>{text}</span>
  </div>
);
