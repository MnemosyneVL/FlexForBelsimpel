import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router";
import PhoneCard from "./PhoneCard";

const meta: Meta<typeof PhoneCard> = {
  title: "Phones/PhoneCard",
  component: PhoneCard,
  decorators: [
    // PhoneCard uses <Link> from react-router, which needs a Router context
    (Story) => <MemoryRouter><Story /></MemoryRouter>,
  ],
};

export default meta;
type Story = StoryObj<typeof PhoneCard>;

const samplePhone = {
  id: "1",
  name: "Samsung Galaxy S24 Ultra",
  slug: "samsung-galaxy-s24-ultra",
  image_url: null,
  price_eur: 1449,
  storage_gb: 256,
  is_5g: true,
  phoneBrand: { name: "Samsung" },
};

export const Default: Story = {
  args: { phone: samplePhone },
};

export const Comparing: Story = {
  args: {
    phone: samplePhone,
    isComparing: true,
    onToggleCompare: () => {},
  },
};

export const BudgetPhone: Story = {
  args: {
    phone: {
      ...samplePhone,
      id: "2",
      name: "Samsung Galaxy A16",
      slug: "samsung-galaxy-a16",
      price_eur: 199,
      storage_gb: 128,
      is_5g: true,
    },
  },
};
