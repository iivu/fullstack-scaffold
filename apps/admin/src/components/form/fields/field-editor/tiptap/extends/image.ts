import Image from '@tiptap/extension-image';

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alignment: {
        default: 'left',
        parseHTML: (element) => element.style.textAlign || 'left',
        renderHTML: (attributes) => {
          if (attributes.alignment === 'center') {
            return { style: 'display: block; margin-left: auto; margin-right: auto;' };
          }
          if (attributes.alignment === 'right') {
            return { style: 'display: block; margin-left: auto;' };
          }
          return { style: 'display: block;' };
        },
      },
    };
  },
});
