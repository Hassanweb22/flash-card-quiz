'use client';

import { StudySession } from '../../lib/types';
import { formatDate, formatTime } from '../../lib/utils';

interface SessionListProps {
  sessions: StudySession[];
  deckTitle?: string;
  className?: string;
}

export function SessionList({ sessions, deckTitle, className = '' }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        <p>No study sessions yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {sessions.map((session, index) => {
        const accuracy = session.totalQuestions > 0
          ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
          : 0;
        const sessionDate = session.endTime || session.startTime;
        const duration = session.endTime
          ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60)
          : null;

        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(sessionDate)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(sessionDate)}
                  </span>
                  {duration !== null && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      • {duration} min
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {session.cardsStudied.length} card{session.cardsStudied.length !== 1 ? 's' : ''} studied
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {session.correctAnswers}/{session.totalQuestions} correct
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${
                  accuracy >= 80 ? 'text-green-600 dark:text-green-400' :
                  accuracy >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {accuracy}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


