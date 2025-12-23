'use client';

import { Card as CardType } from '../../lib/types';
import { Button } from './Button';

interface CardProps {
  card: CardType;
  isFlipped?: boolean;
  onFlip?: () => void;
  className?: string;
}

export function Card({ card, isFlipped = false, onFlip, className = '' }: CardProps) {
  return (
    <div
      className={`relative w-full h-64 cursor-pointer transition-transform duration-500 ${
        className
      }`}
      onClick={onFlip}
    >
      <div
        className={`absolute inset-0 w-full h-full backface-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 ${
          isFlipped ? 'rotate-y-180 opacity-0' : 'rotate-y-0 opacity-100'
        }`}
      >
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl h-full flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Front</h3>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-800 dark:text-gray-200 text-center text-lg leading-relaxed">{card.front}</p>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            Click to flip
          </div>
        </div>
      </div>
      
      <div
        className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 ${
          isFlipped ? 'rotate-y-0 opacity-100' : '-rotate-y-180 opacity-0'
        }`}
      >
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl h-full flex flex-col">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-4">Back</h3>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-indigo-800 dark:text-indigo-200 text-center text-lg leading-relaxed">{card.back}</p>
          </div>
          <div className="mt-4 text-sm text-indigo-600 dark:text-indigo-300 text-center">
            Click to flip back
          </div>
        </div>
      </div>
    </div>
  );
}

interface CardListProps {
  cards: CardType[];
  onCardClick?: (card: CardType) => void;
  className?: string;
}

export function CardList({ cards, onCardClick, className = '' }: CardListProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No cards in this deck</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {cards.map((card) => (
        <div
          key={card.id}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => onCardClick?.(card)}
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">{card.front}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{card.back}</p>
        </div>
      ))}
    </div>
  );
}