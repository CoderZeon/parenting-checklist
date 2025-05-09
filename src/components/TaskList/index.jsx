import React from 'react';
import dayjs from 'dayjs';

function TaskList({ tasks, selectedDate, onTaskComplete }) {
  const isTaskActive = (task) => {
    const currentDate = dayjs(selectedDate);
    const startDate = dayjs(task.startDate);
    const endDate = task.endDate ? dayjs(task.endDate) : null;
    
    if (endDate) {
      return currentDate.isSame(startDate) || 
             (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) ||
             currentDate.isSame(endDate);
    }
    
    return currentDate.isSame(startDate) || currentDate.isAfter(startDate);
  };

  const getTaskStatus = (task) => {
    const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');
    return task.completions?.[dateStr] || false;
  };

  const activeTasks = tasks.filter(isTaskActive);

  const getTaskStatusStyle = (task) => {
    const completed = getTaskStatus(task);
    return {
      backgroundColor: completed ? '#e8f5e9' : '#fff',
      borderLeft: `4px solid ${completed ? '#4CAF50' : '#f0f0f0'}`
    };
  };

  const getTimeIcon = (task) => {
    if (task.type === 'daily') {
      return <i className="fas fa-sun" style={{ color: '#FFA726' }}></i>;
    }
    return <i className="fas fa-calendar-week" style={{ color: '#5C6BC0' }}></i>;
  };

  return (
    <div className="task-list">
      {activeTasks.map(task => (
        <div key={task.id} className="task-item" style={getTaskStatusStyle(task)}>
          <div className="task-header">
            <div className="task-title-wrapper">
              {getTimeIcon(task)}
              <span className="task-title">{task.title}</span>
            </div>
            <span className="task-frequency">{task.frequency}</span>
          </div>
          
          <div className="task-details">
            <div className="detail-item">
              <i className="fas fa-clock"></i>
              <span>{task.time}</span>
            </div>
            <div className="detail-item">
              <i className="fas fa-info-circle"></i>
              <span>{task.method}</span>
            </div>
            <div className="detail-item">
              <i className="fas fa-hourglass-half"></i>
              <span>{task.duration}</span>
            </div>
          </div>

          <div className="task-actions">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={getTaskStatus(task)}
                onChange={(e) => onTaskComplete(task.id, e.target.checked)}
              />
              <span className="checkbox-label">
                {getTaskStatus(task) ? '已完成' : '待完成'}
              </span>
            </label>
            {!getTaskStatus(task) && (
              <div className="reminder-text">
                <i className="fas fa-bell"></i>
                <span>记得按时完成哦</span>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {activeTasks.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-check-circle"></i>
          <p>当前日期没有需要执行的任务</p>
        </div>
      )}
    </div>
  );
}

export default TaskList;
