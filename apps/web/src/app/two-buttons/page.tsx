'use client';

import { toPng } from 'html-to-image';
import {
  Download,
  Image,
  LayoutPanelLeft,
  NotebookPen,
  Type,
  UnfoldVertical,
  User,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { SidebarButton } from 'src/components/sidebar-button';
import TextArea, {
  defaultTextConfig,
  textFitPlaceholderId,
} from 'src/components/text-area';

export default function TwoButtonsPage() {
  const topSpacingAreaId = 'top-spacing-rect';
  const templateAreaId = 'template-rect';
  const bottomSpacingAreaId = 'bottom-spacing-rect';
  const exportAreaId = 'export-rect';
  const editorAreaRef = useRef<HTMLDivElement>(null);

  // Add new state variables
  const [showTextOutsideConfig, setShowTextOutsideConfig] = useState(false);
  const [topSpacingHeight, setTopSpacingHeight] = useState(0);
  const [bottomSpacingHeight, setBottomSpacingHeight] = useState(0);

  const handleSelectTemplate = () => {
    console.log('select template');
  };

  const handleAddTextInside = () => {
    console.log('add text inside');
  };

  const handleAddTextOutside = () => {
    if (showTextOutsideConfig) {
      setShowTextOutsideConfig(false);
    } else {
      setShowTextOutsideConfig(true);
    }
  };

  const handleIcon = () => {
    console.log('icon');
  };

  const handleWatermark = () => {
    console.log('watermark');
  };

  const handleMyAccount = () => {
    console.log('my account');
  };

  const handleExport = async () => {
    if (!editorAreaRef.current) return;

    try {
      const filter = (node: HTMLElement) => {
        return !node.id?.includes(textFitPlaceholderId);
      };
      const dataUrl = await toPng(editorAreaRef.current, {
        cacheBust: true,
        filter: filter,
      });
      const link = document.createElement('a');
      link.download = 'meme-export.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className='flex min-h-screen gap-4'>
      {/* Simplified Sidebar Controls */}
      <div
        id='sidebar-container'
        className='w-20 space-y-6 p-4 bg-gray-100 rounded-lg h-[calc(100vh-2rem)] overflow-y-auto sticky top-2'
      >
        <div className='flex flex-col items-center gap-4'>
          {/* select meme template */}
          <SidebarButton
            icon={<LayoutPanelLeft />}
            onClick={handleSelectTemplate}
            text='Template'
          />

          {/* add Text inside*/}
          <SidebarButton
            icon={<Type />}
            onClick={handleAddTextInside}
            text='Inside'
          />

          {/* add text outside */}
          <SidebarButton
            icon={<UnfoldVertical />}
            onClick={handleAddTextOutside}
            text='Outside'
          />

          <SidebarButton icon={<Image />} onClick={handleIcon} text='Icon' />

          <SidebarButton
            icon={<NotebookPen />}
            onClick={handleWatermark}
            text='Watermark'
          />

          <SidebarButton
            icon={<Download />}
            onClick={handleExport}
            text='Download'
          />

          {/* my account*/}
          <SidebarButton
            icon={<User />}
            onClick={handleMyAccount}
            text='Account'
          />
        </div>
      </div>

      <div
        id='panel-container'
        className='h-[calc(100vh-2rem)] overflow-y-auto sticky top-2'
      >
        {showTextOutsideConfig && (
          <div className='w-64 bg-white p-4 border border-gray-200 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4'>
              Text Outside Settings
            </h3>

            {/* Top Spacing Slider */}
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>
                Top Spacing: {topSpacingHeight}px
              </label>
              <input
                type='range'
                min='0'
                max='400'
                step='20'
                value={topSpacingHeight}
                onChange={(e) => setTopSpacingHeight(parseInt(e.target.value))}
                className='w-full'
              />
            </div>

            {/* Bottom Spacing Slider */}
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>
                Bottom Spacing: {bottomSpacingHeight}px
              </label>
              <input
                type='range'
                min='0'
                max='400'
                step='20'
                value={bottomSpacingHeight}
                onChange={(e) =>
                  setBottomSpacingHeight(parseInt(e.target.value))
                }
                className='w-full'
              />
            </div>

            <button
              onClick={() => setShowTextOutsideConfig(false)}
              className='w-full mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
            >
              Close
            </button>
          </div>
        )}
      </div>

      <div
        id='workspace-container'
        className='flex flex-col gap-3 w-fit'
        style={{
          boxShadow: '0 0 60px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          id='toolbar-container'
          className='w-full h-fit flex justify-center items-center border-b-[1px] border-gray-400 bg-blue-200'
        >
          <div id='toolbar'> Text Text</div>
        </div>

        <div id={exportAreaId} ref={editorAreaRef} className='w-fit'>
          <div
            id={topSpacingAreaId}
            className={`w-full bg-green-200`}
            style={{ height: `${topSpacingHeight}px` }}
          />

          <div id={templateAreaId} className='relative w-fit'>
            <img
              src='/Two-Buttons-meme-1g8my4.jpg'
              alt='Two Buttons Meme'
              width={600}
              height={908}
            />

            {/* First button rectangle */}
            <TextArea
              initialPosition={{
                coordinates: {
                  x: 55.10204081632653,
                  y: 84.48979591836735,
                },
                rotation: 349,
                width: 187.3469387755102,
                height: 90.61224489795919,
              }}
              validAreaId={templateAreaId}
              textConfig={defaultTextConfig}
            />

            {/* Second button rectangle */}
            <TextArea
              initialPosition={{
                coordinates: {
                  x: 273.0612244897959,
                  y: 55.10204081632653,
                },
                rotation: 352,
                width: 143.26530612244898,
                height: 80.81632653061224,
              }}
              validAreaId={templateAreaId}
              textConfig={defaultTextConfig}
            />

            {/* Bottom text rectangle */}
            <TextArea
              initialPosition={{
                coordinates: {
                  x: 19.591836734693878,
                  y: 753.1530612244899,
                },
                rotation: 0,
                width: 559.5918367346939,
                height: 121.6938775510204,
              }}
              validAreaId={templateAreaId}
              textConfig={defaultTextConfig}
            />
          </div>

          <div
            id={bottomSpacingAreaId}
            className={`w-full bg-green-200`}
            style={{ height: `${bottomSpacingHeight}px` }}
          />
        </div>
      </div>
    </div>
  );
}
