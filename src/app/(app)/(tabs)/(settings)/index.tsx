import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { signOut, useAuthStore } from "@/features/auth/auth";

export default function SettingsScreen() {
  const email = useAuthStore((state) => state.session?.user.email);
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut();
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-2 rounded-2xl border border-border bg-card p-5">
        <Text className="text-sm text-muted">Signed in as</Text>
        <Text selectable className="text-base text-foreground">
          {email ?? "Not available"}
        </Text>
      </View>

      <View className="gap-2 rounded-2xl border border-border bg-card p-5">
        <Text className="text-base font-semibold text-foreground">
          Study workflow
        </Text>
        <Text className="text-sm text-muted">
          Create collections, add PDFs or notes, and turn them into summaries,
          flashcards, and conversational study help in seconds.
        </Text>
      </View>

      <Pressable
        disabled={loading}
        onPress={handleSignOut}
        className="items-center rounded-xl border border-border bg-card px-4 py-3"
      >
        {loading ? (
          <ActivityIndicator color="#ffc799" />
        ) : (
          <Text className="text-base font-medium text-primary">Sign out</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
