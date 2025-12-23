'use client';

import { Deck as DeckType } from '../../lib/types';
import { Button } from './Button';
import { formatDate } from '../../lib/utils';

interface DeckProps {
  deck: DeckType;
  onClick?: () => void;
  onStudyClick?: () => void;
  lastStudied?: Date | null;
  className?: string;
}

export function Deck({ deck, onClick, onStudyClick, lastStudied, className = '' }: DeckProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{deck.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{deck.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {lastStudied ? `Last studied ${formatDate(lastStudied)}` : `Created ${formatDate(deck.createdAt)}`}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            className="flex-1"
          >
            View Cards
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onStudyClick}
            disabled={deck.cards.length === 0}
            className="flex-1"
          >
            Study
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DeckListProps {
  decks: DeckType[];
  onDeckClick?: (deck: DeckType) => void;
  onStudyClick?: (deck: DeckType) => void;
  deckStats?: Map<string, { lastStudied: Date | null }>;
  className?: string;
}

export function DeckList({ decks, onDeckClick, onStudyClick, deckStats, className = '' }: DeckListProps) {
  if (decks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 18 7.5 18s3.332.523 4.5 1.247M12 6.253c1.168-.776 2.754-.253 4.5-.253s3.332.523 4.5 1.247v13C17.832 18.523 16.246 18 14.5 18S11.168 18.523 10 17.747" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Decks Yet</h3>
        <p className="text-gray-600 mb-6">Create your first flashcard deck to get started</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {decks.map((deck) => {
        const stats = deckStats?.get(deck.id);
        return (
          <Deck
            key={deck.id}
            deck={deck}
            onClick={() => onDeckClick?.(deck)}
            onStudyClick={() => onStudyClick?.(deck)}
            lastStudied={stats?.lastStudied}
          />
        );
      })}
    </div>
  );
}