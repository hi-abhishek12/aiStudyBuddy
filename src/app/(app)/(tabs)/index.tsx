import { Link } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { EmptyState } from "@/components/empty-state";
import { StudySetCard } from "@/components/study-set-card";
import { useStudySets } from "@/features/study-sets/query";

export default function HomeScreen() {
  const { data: studySets, isLoading } = useStudySets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-3 rounded-3xl border border-border bg-card p-5">
        <Text className="text-sm text-muted">Welcome back</Text>
        <Text className="text-2xl font-semibold text-foreground">
          Turn your study material into something you can actually use.
        </Text>
        <Text className="text-sm text-muted">
          Build study sets from PDFs, notes, and web links, then generate
          summaries, flashcards, and a study chat in one place.
        </Text>
        <Link href="/(app)/(tabs)/(library)" asChild>
          <Pressable className="items-center rounded-xl bg-primary px-4 py-3">
            <Text className="font-semibold text-primary-foreground">
              Open library
            </Text>
          </Pressable>
        </Link>
      </View>

      <View className="gap-3 rounded-2xl border border-border bg-card p-4">
        <Text className="text-base font-semibold text-foreground">
          Your collections
        </Text>
        {isLoading ? (
          <View className="items-center py-3">
            <ActivityIndicator color="#ffc799" />
          </View>
        ) : studySets && studySets.length > 0 ? (
          <View className="gap-2">
            {studySets.slice(0, 3).map((studySet) => (
              <StudySetCard key={studySet.id} studySet={studySet} />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No study sets yet"
            description="Create your first collection and start building smarter notes."
          />
        )}
      </View>
    </ScrollView>
  );
}
