// Storybook stories for the Button component.
//
// Each "story" renders the component in a specific state.
// Storybook creates a visual catalog at localhost:6006 where you can
// browse all component variants without running the full app.

import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default primary button
export const Primary: Story = {
  args: {
    children: "Vergelijk nu",
    variant: "primary",
  },
};

// Secondary (outlined) button
export const Secondary: Story = {
  args: {
    children: "Meer info",
    variant: "secondary",
  },
};

// Small size
export const Small: Story = {
  args: {
    children: "Filter",
    size: "sm",
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    children: "Niet beschikbaar",
    disabled: true,
  },
};
