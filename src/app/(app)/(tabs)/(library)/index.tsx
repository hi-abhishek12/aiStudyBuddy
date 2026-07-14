import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { EmptyState } from "@/components/empty-state";
import { StudySetCard } from "@/components/study-set-card";
import { studySetKeys, useStudySets } from "@/features/study-sets/query";
import { createStudySet } from "@/features/study-sets/actions";

const libraryScreen = () => {
  const queryClient = useQueryClient();
  const {
    data: studySets,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useStudySets();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const createMutation = useMutation({
    mutationFn: () => createStudySet(title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studySetKeys.all });
      setTitle("");
      setDescription("");
      setShowForm(false);
    },
  });

  const listHeader = (
    <View className="gap-4 pb-4">
      <View className="gap-2">
        <Text className="text-sm text-muted">Your study collections</Text>
        <Text className="text-base text-foreground">
          Upload materials, generate summaries, flashcards, and chat with your
          notes.
        </Text>
      </View>

      {showForm ? (
        <View className="gap-3 rounded-2xl border border-border bg-card p-4">
          <Text className="text-base font-medium text-foreground">
            New study set
          </Text>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#71717a"
            value={title}
            onChangeText={setTitle}
            className="rounded-xl border border-border bg-input px-4 py-3 text-foreground"
          />
          <TextInput
            placeholder="Description (optional)"
            placeholderTextColor="#71717a"
            value={description}
            onChangeText={setDescription}
            multiline
            className="min-h-20 rounded-xl border border-border bg-input px-4 py-3 text-foreground"
          />
          {createMutation.error ? (
            <Text selectable className="text-sm text-danger">
              {createMutation.error.message}
            </Text>
          ) : null}
          <View className="flex-row gap-2">
            <Pressable
              disabled={!title.trim() || createMutation.isPending}
              onPress={() => createMutation.mutate()}
              className="flex-1 items-center rounded-xl bg-primary px-4 py-3 disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="#101010" />
              ) : (
                <Text className="font-semibold text-primary-foreground">
                  Create
                </Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => setShowForm(false)}
              className="items-center rounded-xl border border-border px-4 py-3"
            >
              <Text className="text-foreground">Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => setShowForm(true)}
          className="items-center rounded-xl bg-primary px-4 py-3"
        >
          <Text className="font-semibold text-primary-foreground">
            New study set
          </Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <FlatList
      className="flex-1 bg-background"
      data={studySets ?? []}
      keyExtractor={(item) => item.id}
      contentContainerClassName="gap-3 p-6"
      contentInsetAdjustmentBehavior="automatic"
      refreshing={isRefetching}
      onRefresh={refetch}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={
        <EmptyState
          title="No study sets yet"
          description="Create your first study set, then add a PDF or note to get started."
        />
      }
      renderItem={({ item }) => <StudySetCard studySet={item} />}
    />
  );
};

export default libraryScreen;
