import type { Preview } from "@storybook/react";
import { mswLoader, initialize } from "msw-storybook-addon";
import "../src/index.css";

// Register msw addon
initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  loaders: [mswLoader],
};

export default preview;
