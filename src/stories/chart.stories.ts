import { EmployeesBarChart } from "../components/Chart";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof EmployeesBarChart> = {
  title: "Charts/EmployeesBarChart",
  component: EmployeesBarChart,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof EmployeesBarChart>;

export const Default: Story = {};
