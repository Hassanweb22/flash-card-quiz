"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { CardList } from "../../../components/ui/Card";
import { Modal } from "../../../components/ui/Modal";
import { StatsCard } from "../../../components/ui/StatsCard";
import { SessionList } from "../../../components/ui/SessionList";
import { computeDeckStats } from "../../../lib/stats";
import { formatDate } from "../../../lib/utils";
import { toast, Toaster } from "react-hot-toast";

export default function DeckPage() {
  const router = useRouter();
  const params = useParams();
  const { data, addCard, updateCard, deleteCard } = useLocalStorage();
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");
  const [frontError, setFrontError] = useState("");
  const [backError, setBackError] = useState("");

  const deckId = params.id as string;
  const deck = data.decks.find((d) => d.id === deckId);
  const deckStats = deck ? computeDeckStats(data, deckId) : null;

  if (!deck) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Deck not found
          </h2>
          <Button onClick={() => router.push("/")}>Go Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleAddCard = () => {
    if (!newFront.trim()) {
      setFrontError("Front text is required");
      return;
    }
    if (!newBack.trim()) {
      setBackError("Back text is required");
      return;
    }

    addCard(deckId, newFront.trim(), newBack.trim());
    toast.success("Card added successfully!");

    // Reset form
    setNewFront("");
    setNewBack("");
    setFrontError("");
    setBackError("");
    setIsAddCardModalOpen(false);
  };

  const handleEditCard = () => {
    if (!editFront.trim()) {
      setFrontError("Front text is required");
      return;
    }
    if (!editBack.trim()) {
      setBackError("Back text is required");
      return;
    }

    updateCard(deckId, editingCardId!, {
      front: editFront.trim(),
      back: editBack.trim(),
    });
    toast.success("Card updated successfully!");

    // Reset form
    setEditingCardId(null);
    setEditFront("");
    setEditBack("");
    setFrontError("");
    setBackError("");
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      deleteCard(deckId, cardId);
      toast.success("Card deleted successfully!");
    }
  };

  const startEditCard = (card: any) => {
    setEditingCardId(card.id);
    setEditFront(card.front);
    setEditBack(card.back);
    setFrontError("");
    setBackError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingCardId) {
        handleEditCard();
      } else {
        handleAddCard();
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {deck.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {deck.cards.length} card{deck.cards.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push(`/study/${deckId}`)}
                  disabled={deck.cards.length === 0}
                >
                  Study Deck
                </Button>
                <Button onClick={() => setIsAddCardModalOpen(true)}>
                  Add Card
                </Button>
                <Button onClick={() => router.push("/")} variant="outline">
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Deck Stats Section */}
          {deckStats && deckStats.totalSessions > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Study Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatsCard
                  label="Total Sessions"
                  value={deckStats.totalSessions}
                />
                <StatsCard
                  label="Last Studied"
                  value={deckStats.lastStudied ? formatDate(deckStats.lastStudied) : 'Never'}
                />
                <StatsCard
                  label="Last Accuracy"
                  value={deckStats.lastAccuracy !== null ? `${Math.round(deckStats.lastAccuracy)}%` : 'N/A'}
                />
                <StatsCard
                  label="Study Streak"
                  value={`${deckStats.streakDays} day${deckStats.streakDays !== 1 ? 's' : ''}`}
                />
              </div>
            </div>
          )}

          {/* Recent Sessions Section */}
          {deckStats && deckStats.recentSessions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Study Sessions
              </h2>
              <SessionList sessions={deckStats.recentSessions} deckTitle={deck.title} />
            </div>
          )}

          {/* Cards Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Cards in this Deck
            </h2>
            <CardList
              cards={deck.cards}
              onCardClick={(card) => startEditCard(card)}
            />
          </div>
        </main>
      </div>

      {/* Add Card Modal */}
      <Modal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        title="Add New Card"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="card-front"
            placeholder="Enter the question or term"
            value={newFront}
            onChange={(e) => {
              setNewFront(e.target.value);
              if (e.target.value.trim()) setFrontError("");
            }}
            onBlur={() => {
              if (!newFront.trim()) setFrontError("Front text is required");
            }}
            error={frontError}
            required
            autoFocus
          />

          <Input
            id="card-back"
            placeholder="Enter the answer or definition"
            value={newBack}
            onChange={(e) => {
              setNewBack(e.target.value);
              if (e.target.value.trim()) setBackError("");
            }}
            onBlur={() => {
              if (!newBack.trim()) setBackError("Back text is required");
            }}
            error={backError}
            required
            onKeyPress={handleKeyPress}
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleAddCard} className="flex-1">
              Add Card
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsAddCardModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Card Modal */}
      <Modal
        isOpen={editingCardId !== null}
        onClose={() => setEditingCardId(null)}
        title="Edit Card"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="edit-card-front"
            placeholder="Enter the question or term"
            value={editFront}
            onChange={(e) => {
              setEditFront(e.target.value);
              if (e.target.value.trim()) setFrontError("");
            }}
            onBlur={() => {
              if (!editFront.trim()) setFrontError("Front text is required");
            }}
            error={frontError}
            required
            autoFocus
          />

          <Input
            id="edit-card-back"
            placeholder="Enter the answer or definition"
            value={editBack}
            onChange={(e) => {
              setEditBack(e.target.value);
              if (e.target.value.trim()) setBackError("");
            }}
            onBlur={() => {
              if (!editBack.trim()) setBackError("Back text is required");
            }}
            error={backError}
            required
            onKeyPress={handleKeyPress}
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleEditCard} className="flex-1">
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditingCardId(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteCard(editingCardId!)}
              variant="outline"
              className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete Card
            </Button>
          </div>
        </div>
      </Modal>

      <Toaster position="top-right" />
    </>
  );
}
