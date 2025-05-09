import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css';
import TaskList from './components/TaskList';
import Statistics from './components/Statistics/index.jsx';
import { loadTasks, saveTasks } from './utils/storage.js';

const INITIAL_TASKS = [
  {
    id: 1,
    title: '补锌',
    frequency: '每日一次',
    time: '饭后半小时',
    method: '10ml水冲泡',
    duration: '持续一个月',
    type: 'daily',
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().add(1, 'month').format('YYYY-MM-DD')
  },
  {
    id: 2,
    title: '补益生菌',
    frequency: '每日两次',
    time: '可以和母乳一起喂',
    method: '40度以下冲泡',
    duration: '暂时持续7天',
    type: 'daily',
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().add(7, 'day').format('YYYY-MM-DD')
  },
  {
    id: 3,
    title: '游泳',
    frequency: '每周两次',
    time: '白天饭后半小时',
    method: '游泳桶接37度左右水游15min',
    duration: '一直持续',
    type: 'weekly',
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: null
  },
  {
    id: 4,
    title: '户外活动',
    frequency: '每日多次',
    time: '白天任何时间',
    method: '每次1小时每天不少于3小时',
    duration: '一直持续',
    type: 'daily',
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: null
  }
];

function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    const initTasks = async () => {
      const savedTasks = await loadTasks();
      if (savedTasks) {
        setTasks(savedTasks);
      } else {
        await saveTasks(INITIAL_TASKS);
      }
    };
    initTasks();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTaskComplete = async (taskId, completed) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const completions = task.completions || {};
        completions[dayjs(selectedDate).format('YYYY-MM-DD')] = completed;
        return { ...task, completions };
      }
      return task;
    });
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>宝宝成长打卡</h1>
      </header>

      <nav className="nav-tabs">
        <div 
          className={`nav-tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          今日任务
        </div>
        <div 
          className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          数据统计
        </div>
      </nav>

      {activeTab === 'tasks' ? (
        <>
          <div className="calendar-wrapper">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              locale="zh-CN"
            />
          </div>
          <TaskList
            tasks={tasks}
            selectedDate={selectedDate}
            onTaskComplete={handleTaskComplete}
          />
        </>
      ) : (
        <Statistics tasks={tasks} />
      )}
    </div>
  );
}

export default App;
