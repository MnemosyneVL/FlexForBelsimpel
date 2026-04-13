// Storybook 8 config — tells Storybook where to find stories
// and which addons to load.
//
// We use the Vite builder (not Webpack) because this project
// already uses Vite as its build tool. This means Storybook
// shares the same config, aliases, and CSS Modules setup.

import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  // Find all story files in the app directory
  stories: ["../app/**/*.stories.@(ts|tsx)"],

  // Addons enhance the Storybook UI:
  // - essentials: controls panel, actions, viewport, docs
  // - a11y: accessibility checks (color contrast, ARIA labels, etc.)
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],

  // Use Vite instead of Webpack — matches our actual build tool
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  // Generate automatic documentation from component props
  docs: {
    autodocs: true,
  },

  // Reuse Vite config for path aliases (~/ → app/) and CSS Modules
  viteFinal: async (config) => {
    return config;
  },
};

export default config;
