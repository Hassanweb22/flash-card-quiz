'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { DeckList } from '../components/ui/Deck';
import { toast, Toaster } from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const { data, isInitialized, addDeck } = useLocalStorage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleCreateDeck = () => {
    if (!newDeckTitle.trim()) {
      setTitleError('Deck title is required');
      return;
    }

    addDeck(newDeckTitle.trim(), newDeckDescription.trim());
    toast.success('Deck created successfully!');
    
    // Reset form
    setNewDeckTitle('');
    setNewDeckDescription('');
    setTitleError('');
    setIsCreateModalOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateDeck();
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Flashcard Study App
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Create, study, and master your knowledge
                </p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create New Deck
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Decks
            </h2>
            <DeckList
              decks={data.decks}
              onDeckClick={(deck) => router.push(`/deck/${deck.id}`)}
              onStudyClick={(deck) => router.push(`/study/${deck.id}`)}
            />
          </div>
        </main>
      </div>

      {/* Create Deck Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Deck"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="deck-title"
            placeholder="Enter deck title"
            value={newDeckTitle}
            onChange={(e) => {
              setNewDeckTitle(e.target.value);
              if (e.target.value.trim()) setTitleError('');
            }}
            onBlur={() => {
              if (!newDeckTitle.trim()) setTitleError('Deck title is required');
            }}
            error={titleError}
            required
          />
          
          <Input
            id="deck-description"
            placeholder="Enter deck description (optional)"
            value={newDeckDescription}
            onChange={(e) => setNewDeckDescription(e.target.value)}
            onBlur={() => {}}
            onKeyPress={handleKeyPress}
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCreateDeck}
              className="flex-1"
            >
              Create Deck
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}