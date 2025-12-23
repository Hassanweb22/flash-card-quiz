'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { toast, Toaster } from 'react-hot-toast';
import { shuffleArray } from '../../../lib/utils';
import { StudySession } from '../../../lib/types';

export default function StudyPage() {
  const router = useRouter();
  const params = useParams();
  const { data, addStudySession } = useLocalStorage();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [cardsStudied, setCardsStudied] = useState<Set<string>>(new Set());
  const [studyStats, setStudyStats] = useState({
    correctAnswers: 0,
    totalQuestions: 0,
  });

  const deckId = params.id as string;
  const deck = data.decks.find(d => d.id === deckId);

  const shuffledCards = useMemo(() => {
    if (deck && deck.cards.length > 0) {
      return shuffleArray(deck.cards);
    }
    return [];
  }, [deck, shuffleCount]);

  // Initialize session start time when component mounts or reshuffles
  useEffect(() => {
    if (shuffledCards.length > 0 && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
  }, [shuffledCards.length, sessionStartTime]);

  if (!deck) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Deck not found</h2>
          <Button onClick={() => router.push('/')}>Go Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (shuffledCards.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Preparing study session...</p>
        </div>
      </div>
    );
  }

  const currentCard = shuffledCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / shuffledCards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // Save session when study is complete
      if (sessionStartTime && studyStats.totalQuestions > 0) {
        const session: StudySession = {
          deckId,
          mode: 'classic',
          startTime: sessionStartTime,
          endTime: new Date(),
          cardsStudied: Array.from(cardsStudied),
          correctAnswers: studyStats.correctAnswers,
          totalQuestions: studyStats.totalQuestions,
        };
        addStudySession(session);
      }
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkCorrect = () => {
    const cardId = shuffledCards[currentCardIndex].id;
    setCardsStudied(prev => new Set(prev).add(cardId));
    setStudyStats({
      ...studyStats,
      correctAnswers: studyStats.correctAnswers + 1,
      totalQuestions: studyStats.totalQuestions + 1,
    });
    handleNext();
  };

  const handleMarkIncorrect = () => {
    const cardId = shuffledCards[currentCardIndex].id;
    setCardsStudied(prev => new Set(prev).add(cardId));
    setStudyStats({
      ...studyStats,
      totalQuestions: studyStats.totalQuestions + 1,
    });
    handleNext();
  };

  const resetStudySession = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyStats({ correctAnswers: 0, totalQuestions: 0 });
    setShowResults(false);
    setCardsStudied(new Set());
    setSessionStartTime(null);
    // Trigger reshuffle by incrementing counter
    setShuffleCount(prev => prev + 1);
  };

  const exitStudySession = () => {
    router.push('/');
  };

  if (showResults) {
    const accuracy = studyStats.totalQuestions > 0 
      ? (studyStats.correctAnswers / studyStats.totalQuestions) * 100 
      : 0;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Session Complete!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">You studied {shuffledCards.length} cards</p>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{studyStats.correctAnswers}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">{studyStats.totalQuestions}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{Math.round(accuracy)}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Accuracy</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetStudySession} variant="outline">
                Study Again
              </Button>
              <Button onClick={exitStudySession}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{deck.title}</h1>
                <p className="text-gray-600 dark:text-gray-300">Study Mode</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Card {currentCardIndex + 1} of {shuffledCards.length}
                </p>
                <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Study Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Flashcard */}
            <div className="flex justify-center">
              <Card card={currentCard} isFlipped={isFlipped} onFlip={handleFlip} />
            </div>

            {/* Study Controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Button 
                  onClick={handlePrevious} 
                  disabled={currentCardIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button onClick={handleFlip} variant="outline">
                  {isFlipped ? 'Flip Back' : 'Flip Card'}
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleMarkIncorrect} variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                  Need Practice
                </Button>
                <Button onClick={handleMarkCorrect} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                  Got It
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={exitStudySession} variant="ghost">
                Exit Study
              </Button>
              <Button onClick={handleNext} disabled={currentCardIndex === shuffledCards.length - 1}>
                Next Card →
              </Button>
            </div>
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
    </>
  );
}