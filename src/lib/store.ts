/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import type { TaskData } from "../types";

import {
  configureStore,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";

export interface TaskBoxState {
  tasks: TaskData[];
  status: "idle" | "loading" | "failed" | "succeeded";
  error: string | null;
}

// asyncThunk to fetch task from a remote endpoint
export const fetchTasks = createAsyncThunk("taskbox/fetchTasks", async () => {
  const resp = await fetch(
    "https://jsonplaceholder.typicode.com/todos?userId=1"
  );
  const data = await resp.json();

  const result = data.map(
    (task: { id: number; title: string; completed: boolean }) => ({
      id: `${task.id}`,
      title: task.title,
      state: task.completed ? "TASK_ARCHIVED" : "TASK_INBOX",
    })
  );

  return result;
});

const TaskBoxData: TaskBoxState = {
  tasks: [],
  status: "idle",
  error: null,
};

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: "taskbox",
  initialState: TaskBoxData,
  reducers: {
    updateTaskState: (
      state,
      action: PayloadAction<{ id: string; newTaskState: TaskData["state"] }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.state = action.payload.newTaskState;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.tasks = [];
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        // Add any fetched tasks to the array
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.status = "failed";
        state.error = "Something went wrong";
        state.tasks = [];
      });
  },
});

// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

/*
 * Our app's store configuration goes here.
 * Read more about Redux's configureStore in the docs:
 * https://redux-toolkit.js.org/api/configureStore
 */

const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
