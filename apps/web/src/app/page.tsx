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
import { useEffect, useRef, useState } from 'react';
import { SidebarButton } from 'src/components/sidebar-button';
import TextArea, {
  defaultTextConfig,
  textFitPlaceholderId,
} from 'src/components/text-area';
import { TextToolbar } from 'src/components/text-toolbar';
import { fetchTemplateInfo, TemplateInfo } from 'src/types/template';
import { v4 as uuidv4 } from 'uuid';

import { Toaster } from '~*/components/ui/toaster';
import { useToast } from '~*/hooks/use-toast';

interface TextAreaConfig {
  uniqueId: string;
  initialPosition: {
    coordinates: { x: number; y: number };
    width: number;
    height: number;
    rotation: number;
  };
  validAreaId: string;
}

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

  const { toast } = useToast();
  const textAreaToastCallback = ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => {
    toast({
      title: title,
      description: message,
    });
  };

  const [templateData, setTemplateData] = useState<TemplateInfo | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextAreaConfig[]>([]);
  const [textConfigs, setTextConfigs] = useState<
    Record<string, typeof defaultTextConfig>
  >({});
  // toolbar config
  const [isTextToolbarVisible, setIsTextToolbarVisible] = useState(false);
  const [selectedTextAreaId, setSelectedTextAreaId] = useState('');

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const data = await fetchTemplateInfo();
        setTemplateData(data);
      } catch (error) {
        console.error('Error loading template:', error);
      }
    };
    loadTemplate();
  }, []);

  useEffect(() => {
    if (templateData) {
      const textConfigs: Record<string, typeof defaultTextConfig> = {};
      const textBoxes = templateData.settings.textBoxes.map((textBox) => {
        const uniqueId = uuidv4();
        textConfigs[uniqueId] = defaultTextConfig;
        return {
          uniqueId: uniqueId,
          initialPosition: {
            coordinates: { x: textBox.left, y: textBox.top },
            width: textBox.width,
            height: textBox.height,
            rotation: textBox.rotation,
          },
          validAreaId: templateAreaId,
        };
      });
      setTextBoxes(textBoxes);
      setTextConfigs(textConfigs);
    }
  }, [templateData]);

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
    <main className='flex min-h-screen gap-4'>
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
          className='text-toolbar w-full h-[55px] flex justify-center items-center border-b-[1px] border-gray-400 bg-blue-200'
        >
          {isTextToolbarVisible && (
            <TextToolbar
              textConfig={textConfigs[selectedTextAreaId]}
              copyMode={false}
              deleteTextCallback={() => {
                console.log('delete text');
              }}
              updateTextConfig={(updates) => {
                setTextConfigs({
                  ...textConfigs,
                  [selectedTextAreaId]: {
                    ...textConfigs[selectedTextAreaId],
                    ...updates,
                  },
                });
              }}
              copyAllTextStyleCallback={() => {
                console.log('copy all text style');
              }}
            />
          )}
        </div>

        {templateData && (
          <div id={exportAreaId} ref={editorAreaRef} className='w-fit'>
            <div
              id={topSpacingAreaId}
              className={`w-full bg-green-200`}
              style={{ height: `${topSpacingHeight}px` }}
            />

            <div id={templateAreaId} className='relative w-fit'>
              <img
                src={templateData.imageUrl}
                alt='Two Buttons Meme'
                width={templateData.settings.width}
                height={templateData.settings.height}
              />

              {textBoxes.map((textBox) => (
                <TextArea
                  key={textBox.uniqueId}
                  {...textBox}
                  textConfig={textConfigs[textBox.uniqueId]}
                  toastCallback={textAreaToastCallback}
                  onSelectedCallback={() => {
                    setSelectedTextAreaId(textBox.uniqueId);
                    setIsTextToolbarVisible(true);
                  }}
                  onDeselectedCallback={() => {
                    setSelectedTextAreaId('');
                    setIsTextToolbarVisible(false);
                  }}
                />
              ))}
            </div>

            <div
              id={bottomSpacingAreaId}
              className={`w-full bg-green-200`}
              style={{ height: `${bottomSpacingHeight}px` }}
            />
          </div>
        )}
      </div>
      <Toaster />
    </main>
  );
}
