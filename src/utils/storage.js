import localforage from 'localforage';

const TASKS_KEY = 'parenting_tasks';

export const loadTasks = async () => {
  try {
    const tasks = await localforage.getItem(TASKS_KEY);
    return tasks;
  } catch (error) {
    console.error('Error loading tasks:', error);
    return null;
  }
};

export const saveTasks = async (tasks) => {
  try {
    await localforage.setItem(TASKS_KEY, tasks);
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
};
