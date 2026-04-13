import type { Meta, StoryObj } from "@storybook/react";
import PriceTag from "./PriceTag";

const meta: Meta<typeof PriceTag> = {
  title: "UI/PriceTag",
  component: PriceTag,
};

export default meta;
type Story = StoryObj<typeof PriceTag>;

export const MonthlyOnly: Story = {
  args: { monthlyPrice: 45.0 },
};

export const WithUpfront: Story = {
  args: { monthlyPrice: 32.5, upfrontPrice: 149.0 },
};

export const SimFreePrice: Story = {
  args: { monthlyPrice: 899.0, period: "" },
};
