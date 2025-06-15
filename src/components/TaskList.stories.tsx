import { Meta, StoryObj } from "@storybook/react";
import TaskList from "./TaskList";
import * as TaskStories from "./Task.stories";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { TaskBoxState } from "../lib/store";
import React from "react";
import { Provider } from "react-redux";
import { TaskData } from "../types";

export const MockedState: TaskBoxState = {
  tasks: [
    { ...TaskStories.Default.args.task, id: "1", title: "Task 1" },
    { ...TaskStories.Default.args.task, id: "2", title: "Task 2" },
    { ...TaskStories.Default.args.task, id: "3", title: "Task 3" },
    { ...TaskStories.Default.args.task, id: "4", title: "Task 4" },
    { ...TaskStories.Default.args.task, id: "5", title: "Task 5" },
    { ...TaskStories.Default.args.task, id: "6", title: "Task 6" },
  ],
  status: "idle",
  error: null,
};

const MockStore = ({
  taskboxState,
  children,
}: {
  taskboxState: TaskBoxState;
  children: React.ReactNode;
}) => (
  <Provider
    store={configureStore({
      reducer: {
        taskbox: createSlice({
          name: "taskbox",
          initialState: taskboxState,
          reducers: {
            updateTaskState: (state, action) => {
              const { id, newTaskState } = action.payload;
              const task = state.tasks.findIndex((task) => task.id === id);
              if (task >= 0) {
                state.tasks[task].state = newTaskState;
              }
            },
          },
        }).reducer,
      },
    })}
  >
    {children}
  </Provider>
);

const meta = {
  title: "TaskList",
  component: TaskList,
  excludeStories: /.*MockedState$/,
  tags: ["autodocs"],
  decorators: [(story) => <div style={{ margin: "3rem" }}>{story()}</div>],
  args: {
    ...TaskStories.ActionData,
  },
} satisfies Meta<typeof TaskList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (story) => <MockStore taskboxState={MockedState}>{story()}</MockStore>,
  ],
};

export const WithPinnedTasks: Story = {
  decorators: [
    (story) => {
      const pinnedTasks: TaskData[] = [
        ...MockedState.tasks.slice(0, 5),
        { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" },
      ];

      return (
        <MockStore taskboxState={{ ...MockedState, tasks: pinnedTasks }}>
          {story()}
        </MockStore>
      );
    },
  ],
};

export const Loading: Story = {
  decorators: [
    (story) => (
      <MockStore
        taskboxState={{
          ...MockedState,
          status: "loading",
        }}
      >
        {story()}
      </MockStore>
    ),
  ],
};
export const Empty: Story = {
  decorators: [
    (story) => (
      <MockStore
        taskboxState={{
          ...MockedState,
          tasks: [],
        }}
      >
        {story()}
      </MockStore>
    ),
  ],
};
