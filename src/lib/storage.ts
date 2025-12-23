import { Deck, Card } from './types';

const STORAGE_KEY = 'flashcard-app-data';

export interface AppData {
  decks: Deck[];
}

function getDefaultData(): AppData {
  return {
    decks: [],
  };
}

export function getStoredData(): AppData {
  if (typeof window === 'undefined') return getDefaultData();
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getDefaultData();
    
    const parsed = JSON.parse(data);
    // Convert string dates back to Date objects
    return {
      ...parsed,
      decks: parsed.decks.map((deck: any) => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt),
        cards: deck.cards.map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        })),
      })),
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return getDefaultData();
  }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function initializeSampleData(): void {
  const sampleDeck: Deck = {
    id: 'german-basics',
    title: 'German Basics',
    description: 'Essential German vocabulary for beginners',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    cards: [
      {
        id: 'card-1',
        front: 'Hallo',
        back: 'Hello',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'card-2',
        front: 'Danke',
        back: 'Thank you',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'card-3',
        front: 'Bitte',
        back: 'Please/You\'re welcome',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'card-4',
        front: 'Ja',
        back: 'Yes',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'card-5',
        front: 'Nein',
        back: 'No',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'card-6',
        front: 'Guten Tag',
        back: 'Good day/Hello',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'card-7',
        front: 'Entschuldigung',
        back: 'Excuse me/Sorry',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'card-8',
        front: 'Sprechen Sie Englisch?',
        back: 'Do you speak English?',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'card-9',
        front: 'Wie viel kostet das?',
        back: 'How much does it cost?',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'card-10',
        front: 'Wo ist die Toilette?',
        back: 'Where is the bathroom?',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
  };

  saveData({ decks: [sampleDeck] });
}