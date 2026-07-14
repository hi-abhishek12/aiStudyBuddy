import { useAuthStore } from "@/features/auth/auth";
import { Href, Redirect, Stack } from "expo-router";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function AppLayout() {
  const initialized = useAuthStore((state) => state.initialized);
  const session = useAuthStore((state) => state.session);

  if (!initialized) return null;

  if (!session) return <Redirect href={"/login" as Href} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
