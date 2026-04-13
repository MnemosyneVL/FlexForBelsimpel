import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: "This is a card with some content inside it.",
  },
};

export const Hoverable: Story = {
  args: {
    children: "Hover over me to see the effect.",
    hoverable: true,
  },
};
