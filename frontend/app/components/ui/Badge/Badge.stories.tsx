import type { Meta, StoryObj } from "@storybook/react";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "128 GB" } };
export const FiveG: Story = { args: { children: "5G", variant: "info" } };
export const Unlimited: Story = { args: { children: "Onbeperkt", variant: "success" } };
export const Deal: Story = { args: { children: "Aanbieding", variant: "warning" } };
