import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { EmptyState } from "@/components/empty-state";
import {
    createConversation,
    sendStudyChat,
} from "@/features/study-sets/actions";
import { useStudySet } from "@/features/study-sets/query";

type Message = { id: string; role: "user" | "assistant"; content: string };

export default function ChatScreen() {
  const { studySetId } = useLocalSearchParams<{ studySetId: string }>();
  const { data: studySet } = useStudySet(studySetId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!studySetId) return;

    let active = true;

    async function startConversation() {
      try {
        const conversation = await createConversation(
          studySetId,
          `${studySet?.title ?? "Study"} chat`,
        );
        if (active) {
          setConversationId(conversation.id);
          setMessages([
            {
              id: `${conversation.id}-welcome`,
              role: "assistant",
              content:
                "Ask me anything about this study set and I’ll answer from the materials you’ve added.",
            },
          ]);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to start chat");
        }
      }
    }

    startConversation();

    return () => {
      active = false;
    };
  }, [studySetId]);

  async function handleSend() {
    if (!draft.trim() || !conversationId) return;

    const userMessage = draft.trim();
    setDraft("");
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", content: userMessage },
    ]);
    setLoading(true);
    setError(null);

    try {
      const result = await sendStudyChat(conversationId, userMessage);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: result.reply,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{ title: studySet ? `${studySet.title} chat` : "Chat" }}
      />
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-3 p-4"
          contentInsetAdjustmentBehavior="automatic"
        >
          {messages.length > 0 ? (
            messages.map((message) => (
              <View
                key={message.id}
                className={`max-w-[85%] rounded-2xl p-3 ${
                  message.role === "assistant"
                    ? "self-start border border-border bg-card"
                    : "self-end bg-primary"
                }`}
              >
                <Text
                  className={`text-sm leading-6 ${
                    message.role === "assistant"
                      ? "text-foreground"
                      : "text-primary-foreground"
                  }`}
                >
                  {message.content}
                </Text>
              </View>
            ))
          ) : (
            <EmptyState
              title="Start a conversation"
              description="Ask the assistant any question about your study set."
            />
          )}

          {loading ? (
            <View className="self-start rounded-2xl border border-border bg-card p-3">
              <ActivityIndicator color="#ffc799" />
            </View>
          ) : null}
        </ScrollView>

        {error ? (
          <View className="px-4 pb-2">
            <Text selectable className="text-sm text-danger">
              {error}
            </Text>
          </View>
        ) : null}

        <View className="border-t border-border bg-card p-4">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask about your notes..."
            placeholderTextColor="#71717a"
            multiline
            className="min-h-20 rounded-xl border border-border bg-input px-4 py-3 text-foreground"
          />
          <Pressable
            disabled={loading || !draft.trim() || !conversationId}
            onPress={handleSend}
            className="mt-3 items-center rounded-xl bg-primary px-4 py-3 disabled:opacity-50"
          >
            <Text className="font-semibold text-primary-foreground">Send</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
