export interface TextBoxDefinition {
  height: number;
  width: number;
  left: number;
  top: number;
  rotation: number;
}

export interface TemplateSettings {
  width: number;
  height: number;
  textBoxes: TextBoxDefinition[];
}

export interface TemplateInfo {
  createdAt: number;
  description: string;
  id: string;
  imageUrl: string;
  isTransparent: boolean;
  settings: TemplateSettings;
  siteId: string;
  slugKey: string;
  thumbnailUrl: string;
  title: string;
}

// Update your mock API function
export const fetchTemplateInfo = async (): Promise<TemplateInfo> => {
  await new Promise((resolve) => setTimeout(resolve, 1));

  return {
    createdAt: 1686101929966,
    description: '2 red buttons, choice button...',
    id: '5',
    imageUrl: '/Two-Buttons-meme-1g8my4.jpg',
    isTransparent: false,
    settings: {
      width: 600,
      height: 908,
      textBoxes: [
        {
          height: 90.61224489795919,
          width: 187.3469387755102,
          left: 55.10204081632653,
          top: 84.48979591836735,
          rotation: 349,
        },
        {
          height: 80.81632653061224,
          width: 143.26530612244898,
          left: 273.0612244897959,
          top: 55.10204081632653,
          rotation: 352,
        },
        {
          height: 121.6938775510204,
          width: 559.5918367346939,
          left: 19.591836734693878,
          top: 753.1530612244899,
          rotation: 0,
        },
      ],
    },
    siteId: 'memegenerator',
    slugKey: 'two-buttons',
    thumbnailUrl: 'https://content.imageresizer.com/images/memes/...',
    title: 'Two Buttons',
  };
};
