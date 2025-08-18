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
      test: 'todo',
    },
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  // This decorator wraps all stories in a div with full viewport dimensions
  decorators: [
    (Story) => (      
        <Story />
    ),
  ],
};

export default preview;
