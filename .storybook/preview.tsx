import React from 'react';
import type { Preview } from '@storybook/nextjs-vite';
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      manual: false,
    },
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

export default preview;
