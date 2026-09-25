// frontend/src/pages/Engagement/TasksPage.tsx
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { tasksTranslations } from '../../i18n/translations/tasks';

interface Task {
  id: number;
  titleKey: string;
  reward: string;
}

const tasks: Task[] = [
  {
    id: 1,
    titleKey: 'taskWatchVideo',
    reward: '0.01 Pi',
  },
  {
    id: 2,
    titleKey: 'taskJoinPoll',
    reward: '0.05 Pi',
  },
  {
    id: 3,
    titleKey: 'taskDailyCheckin',
    reward: '0.005 Pi',
  },
];

const taskTitleMap = {
  taskWatchVideo: tasksTranslations.taskWatchVideo,
  taskJoinPoll: tasksTranslations.taskJoinPoll,
  taskDailyCheckin: tasksTranslations.taskDailyCheckin,
} as const;

const EngagementTasksPage: React.FC = () => {
  const { t, lang } = useI18n();

  return (
    <div
      style={{
        padding: '20px',
        direction: lang === 'fa' ? 'rtl' : 'ltr',
        fontFamily: 'sans-serif',
      }}
    >
      <h2>{t(tasksTranslations.tasksTitle)}</h2>

      <p>{t(tasksTranslations.tasksSubtitle)}</p>

      <div style={{ marginTop: '20px' }}>
        {tasks.map((task) => (
          <div key={task.id} style={taskCardStyle}>
            <div>
              <strong>{t(taskTitleMap[task.titleKey as keyof typeof taskTitleMap] || task.titleKey)}</strong>

              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {t(tasksTranslations.reward)}: {task.reward}
              </div>
            </div>

            <button style={actionButtonStyle}>
              {t(tasksTranslations.claim)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const taskCardStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  marginBottom: '10px',
  backgroundColor: '#f9f9f9',
};

const actionButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default EngagementTasksPage;
