export interface Card {
  id: string;
  front: string;
  back: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  cards: Card[];
}

export interface StudyStats {
  totalCards: number;
  masteredCards: number;
  needsPracticeCards: number;
  lastStudied: Date | null;
  studyStreak: number;
}

export type StudyMode = 'classic' | 'multiple-choice' | 'type-answer';

export interface StudySession {
  deckId: string;
  mode: StudyMode;
  startTime: Date;
  endTime: Date | null;
  cardsStudied: string[];
  correctAnswers: number;
  totalQuestions: number;
}