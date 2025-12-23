'use client';

import { useRouter } from 'next/navigation';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Button } from '../../components/ui/Button';
import { StatsCard } from '../../components/ui/StatsCard';
import { SessionList } from '../../components/ui/SessionList';
import { getRecentSessions, getOverallStats } from '../../lib/stats';

export default function StatsPage() {
  const router = useRouter();
  const { data } = useLocalStorage();

  const recentSessions = getRecentSessions(data, 20);
  const overallStats = getOverallStats(data);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Study Statistics
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Track your learning progress across all decks
              </p>
            </div>
            <Button onClick={() => router.push('/')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Stats */}
        {overallStats.totalSessions > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Overall Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard
                label="Total Sessions"
                value={overallStats.totalSessions}
              />
              <StatsCard
                label="Cards Studied"
                value={overallStats.totalCardsStudied}
              />
              <StatsCard
                label="Average Accuracy"
                value={`${Math.round(overallStats.averageAccuracy)}%`}
              />
              <StatsCard
                label="Total Study Time"
                value={`${overallStats.totalStudyTime} min`}
              />
            </div>
          </div>
        )}

        {/* Recent Sessions */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Study Sessions
          </h2>
          {recentSessions.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="mb-4 text-gray-400">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Study Sessions Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Start studying your decks to see statistics here
              </p>
              <Button onClick={() => router.push('/')}>
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <SessionList sessions={recentSessions} />
          )}
        </div>
      </main>
    </div>
  );
}


