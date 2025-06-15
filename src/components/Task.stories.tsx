import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Task from "./Task";

export const ActionData = {
  onArchiveTask: fn(),
  onPinTask: fn(),
};

const meta = {
  title: "Task",
  component: Task,
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
  args: {
    ...ActionData,
  },
} satisfies Meta<typeof Task>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    task: {
      id: "1",
      title: "Test task",
      state: "TASK_INBOX",
    },
  },
};
export const Pinned: Story = {
  args: {
    task: {
      ...Default.args.task,
      state: "TASK_PINNED",
    },
  },
};
export const Archived: Story = {
  args: {
    task: {
      ...Default.args.task,
      state: "TASK_ARCHIVED",
    },
  },
};
