// Storybook preview config — global decorators and parameters
// that apply to ALL stories.
//
// This file imports our CSS reset, variables, and global styles
// so stories look exactly like they do in the real app.

import type { Preview } from "@storybook/react";

// Import the same styles used in root.tsx
import "../app/styles/reset.css";
import "../app/styles/variables.css";
import "../app/styles/global.css";

const preview: Preview = {
  parameters: {
    // Sort stories alphabetically in the sidebar
    options: {
      storySort: {
        order: ["UI", "Domain", "Layout"],
      },
    },

    // Default background colors for the preview canvas
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f9fafb" },
        { name: "dark", value: "#111827" },
        { name: "white", value: "#ffffff" },
      ],
    },

    // Viewport presets for responsive testing
    viewport: {
      viewports: {
        mobile: { name: "Mobile", styles: { width: "375px", height: "667px" } },
        tablet: { name: "Tablet", styles: { width: "768px", height: "1024px" } },
        desktop: { name: "Desktop", styles: { width: "1200px", height: "800px" } },
      },
    },
  },
};

export default preview;
