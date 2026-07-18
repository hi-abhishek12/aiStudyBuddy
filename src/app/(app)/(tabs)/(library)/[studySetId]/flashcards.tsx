import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { EmptyState } from "@/components/empty-state";
import { generateFlashcards } from "@/features/study-sets/actions";
import { useStudySet } from "@/features/study-sets/query";

type Card = { front: string; back: string };

export default function FlashcardsScreen() {
  const { studySetId } = useLocalSearchParams<{ studySetId: string }>();
  const { data: studySet } = useStudySet(studySetId);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!studySetId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await generateFlashcards(studySetId, 8);
      setCards(result.cards);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to generate flashcards",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: studySet ? `${studySet.title} flashcards` : "Flashcards",
        }}
      />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-4 p-6"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-3 rounded-2xl border border-border bg-card p-4">
          <Text className="text-base font-semibold text-foreground">
            Generate flashcards
          </Text>
          <Text className="text-sm text-muted">
            Turn your ready material into a compact set of review cards.
          </Text>
          <Pressable
            disabled={loading || !studySetId}
            onPress={handleGenerate}
            className="items-center rounded-xl bg-primary px-4 py-3 disabled:opacity-50"
          >
            {loading ? (
              <ActivityIndicator color="#101010" />
            ) : (
              <Text className="font-semibold text-primary-foreground">
                Generate flashcards
              </Text>
            )}
          </Pressable>
        </View>

        {error ? (
          <Text selectable className="text-sm text-danger">
            {error}
          </Text>
        ) : null}

        {cards.length > 0 ? (
          <View className="gap-2">
            {cards.map((card, index) => (
              <View
                key={`${card.front}-${index}`}
                className="gap-2 rounded-2xl border border-border bg-card p-4"
              >
                <Text className="text-xs uppercase tracking-[0.2em] text-muted">
                  Card {index + 1}
                </Text>
                <Text className="text-base font-semibold text-foreground">
                  {card.front}
                </Text>
                <Text className="text-sm text-muted">{card.back}</Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            title="No flashcards yet"
            description="Generate flashcards from ready sources to see them here."
          />
        )}
      </ScrollView>
    </>
  );
}
