import React from 'react';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Statistics({ tasks }) {
  const calculateCompletionRate = () => {
    const today = dayjs().format('YYYY-MM-DD');
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completions?.[today]).length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getWeeklyData = () => {
    const labels = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      labels.push(date.format('MM/DD'));
      
      const dateStr = date.format('YYYY-MM-DD');
      const completedTasks = tasks.filter(task => task.completions?.[dateStr]).length;
      const totalTasks = tasks.filter(task => {
        const startDate = dayjs(task.startDate);
        const endDate = task.endDate ? dayjs(task.endDate) : dayjs();
        return date.isSame(startDate) || 
               (date.isAfter(startDate) && date.isBefore(endDate)) ||
               date.isSame(endDate);
      }).length;
      
      data.push(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0);
    }

    return { labels, data };
  };

  const weeklyData = getWeeklyData();

  const chartData = {
    labels: weeklyData.labels,
    datasets: [
      {
        label: '完成率 (%)',
        data: weeklyData.data,
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '近7天完成率统计',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="stats">
      <div className="completion-rate">
        <div className="rate-label">今日完成率</div>
        <div className="rate-value">{calculateCompletionRate()}%</div>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default Statistics;
