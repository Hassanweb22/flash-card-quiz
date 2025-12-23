import { useState, useEffect } from 'react';
import { getStoredData, saveData, initializeSampleData, AppData } from '../lib/storage';

export function useLocalStorage() {
  const [data, setData] = useState<AppData>(() => getStoredData());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedData = getStoredData();
    if (storedData.decks.length === 0) {
      initializeSampleData();
    }
    setData(getStoredData());
    setIsInitialized(true);
  }, []);

  const updateData = (newData: AppData) => {
    setData(newData);
    saveData(newData);
  };

  const addDeck = (title: string, description: string) => {
    const newDeck = {
      id: generateId(),
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      cards: [],
    };
    updateData({ ...data, decks: [...data.decks, newDeck] });
  };

  const updateDeck = (id: string, updates: Partial<{ title: string; description: string }>) => {
    updateData({
      ...data,
      decks: data.decks.map(deck =>
        deck.id === id ? { ...deck, ...updates, updatedAt: new Date() } : deck
      ),
    });
  };

  const deleteDeck = (id: string) => {
    updateData({
      ...data,
      decks: data.decks.filter(deck => deck.id !== id),
    });
  };

  const addCard = (deckId: string, front: string, back: string) => {
    updateData({
      ...data,
      decks: data.decks.map(deck =>
        deck.id === deckId
          ? {
              ...deck,
              updatedAt: new Date(),
              cards: [
                ...deck.cards,
                {
                  id: generateId(),
                  front,
                  back,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            }
          : deck
      ),
    });
  };

  const updateCard = (
    deckId: string,
    cardId: string,
    updates: Partial<{ front: string; back: string }>
  ) => {
    updateData({
      ...data,
      decks: data.decks.map(deck =>
        deck.id === deckId
          ? {
              ...deck,
              updatedAt: new Date(),
              cards: deck.cards.map(card =>
                card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
              ),
            }
          : deck
      ),
    });
  };

  const deleteCard = (deckId: string, cardId: string) => {
    updateData({
      ...data,
      decks: data.decks.map(deck =>
        deck.id === deckId
          ? {
              ...deck,
              updatedAt: new Date(),
              cards: deck.cards.filter(card => card.id !== cardId),
            }
          : deck
      ),
    });
  };

  return {
    data,
    isInitialized,
    addDeck,
    updateDeck,
    deleteDeck,
    addCard,
    updateCard,
    deleteCard,
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}