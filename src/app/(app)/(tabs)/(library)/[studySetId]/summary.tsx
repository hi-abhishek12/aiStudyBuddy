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
import { generateStudySummary } from "@/features/study-sets/actions";
import { useStudySet } from "@/features/study-sets/query";

export default function SummaryScreen() {
  const { studySetId } = useLocalSearchParams<{ studySetId: string }>();
  const { data: studySet } = useStudySet(studySetId);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!studySetId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await generateStudySummary(studySetId);
      setSummary(result.content);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to generate summary",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{ title: studySet ? `${studySet.title} summary` : "Summary" }}
      />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-4 p-6"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-3 rounded-2xl border border-border bg-card p-4">
          <Text className="text-base font-semibold text-foreground">
            Generate a study summary
          </Text>
          <Text className="text-sm text-muted">
            This uses the processed material in your collection to produce a
            concise summary you can review.
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
                Generate summary
              </Text>
            )}
          </Pressable>
        </View>

        {error ? (
          <Text selectable className="text-sm text-danger">
            {error}
          </Text>
        ) : null}

        {summary ? (
          <View className="rounded-2xl border border-border bg-card p-4">
            <Text className="text-sm leading-6 text-foreground">{summary}</Text>
          </View>
        ) : (
          <EmptyState
            title="No summary yet"
            description="Generate a summary from your ready sources to see it here."
          />
        )}
      </ScrollView>
    </>
  );
}
