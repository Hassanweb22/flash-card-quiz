import { AppData } from './storage';
import { StudySession } from './types';

export interface DeckStats {
  lastStudied: Date | null;
  totalSessions: number;
  lastAccuracy: number | null;
  streakDays: number;
  recentSessions: StudySession[];
}

/**
 * Get all study sessions for a specific deck
 */
export function getDeckSessions(data: AppData, deckId: string): StudySession[] {
  return data.studySessions
    .filter(session => session.deckId === deckId)
    .sort((a, b) => {
      const timeA = a.endTime || a.startTime;
      const timeB = b.endTime || b.startTime;
      return timeB.getTime() - timeA.getTime();
    });
}

/**
 * Compute study streak based on distinct calendar days studied
 */
export function computeStreak(sessions: StudySession[]): number {
  if (sessions.length === 0) return 0;

  // Get unique study dates (YYYY-MM-DD format)
  const studyDates = new Set<string>();
  sessions.forEach(session => {
    const date = session.endTime || session.startTime;
    const dateStr = date.toISOString().split('T')[0];
    studyDates.add(dateStr);
  });

  // Sort dates descending
  const sortedDates = Array.from(studyDates).sort().reverse();

  // Calculate streak: consecutive days from today backwards
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const checkDateStr = checkDate.toISOString().split('T')[0];
    
    if (sortedDates.includes(checkDateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Compute comprehensive stats for a specific deck
 */
export function computeDeckStats(data: AppData, deckId: string): DeckStats {
  const sessions = getDeckSessions(data, deckId);
  
  if (sessions.length === 0) {
    return {
      lastStudied: null,
      totalSessions: 0,
      lastAccuracy: null,
      streakDays: 0,
      recentSessions: [],
    };
  }

  const lastSession = sessions[0];
  const lastStudied = lastSession.endTime || lastSession.startTime;
  
  const lastAccuracy = lastSession.totalQuestions > 0
    ? (lastSession.correctAnswers / lastSession.totalQuestions) * 100
    : null;

  const streakDays = computeStreak(sessions);
  
  // Get recent sessions (last 10)
  const recentSessions = sessions.slice(0, 10);

  return {
    lastStudied,
    totalSessions: sessions.length,
    lastAccuracy,
    streakDays,
    recentSessions,
  };
}

/**
 * Get all recent sessions across all decks (sorted by most recent)
 */
export function getRecentSessions(data: AppData, limit: number = 20): StudySession[] {
  return data.studySessions
    .sort((a, b) => {
      const timeA = a.endTime || a.startTime;
      const timeB = b.endTime || b.startTime;
      return timeB.getTime() - timeA.getTime();
    })
    .slice(0, limit);
}

/**
 * Get overall statistics across all decks
 */
export function getOverallStats(data: AppData) {
  const allSessions = data.studySessions;
  const totalSessions = allSessions.length;
  
  if (totalSessions === 0) {
    return {
      totalSessions: 0,
      totalCardsStudied: 0,
      averageAccuracy: 0,
      totalStudyTime: 0,
    };
  }

  const totalCardsStudied = allSessions.reduce((sum, session) => sum + session.cardsStudied.length, 0);
  
  const totalCorrect = allSessions.reduce((sum, session) => sum + session.correctAnswers, 0);
  const totalQuestions = allSessions.reduce((sum, session) => sum + session.totalQuestions, 0);
  const averageAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  // Calculate total study time in minutes
  const totalStudyTime = allSessions.reduce((sum, session) => {
    if (session.endTime) {
      const duration = session.endTime.getTime() - session.startTime.getTime();
      return sum + Math.round(duration / 1000 / 60); // Convert to minutes
    }
    return sum;
  }, 0);

  return {
    totalSessions,
    totalCardsStudied,
    averageAccuracy,
    totalStudyTime,
  };
}


