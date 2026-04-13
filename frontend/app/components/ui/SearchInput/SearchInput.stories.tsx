import type { Meta, StoryObj } from "@storybook/react";
import SearchInput from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "UI/SearchInput",
  component: SearchInput,
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Empty: Story = {
  args: { value: "", placeholder: "Zoek telefoons..." },
};

export const WithValue: Story = {
  args: { value: "Samsung Galaxy", placeholder: "Zoek telefoons..." },
};

export const PlanSearch: Story = {
  args: { value: "", placeholder: "Zoek abonnementen..." },
};
