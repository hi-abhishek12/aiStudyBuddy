import { NativeTabs } from "expo-router/unstable-native-tabs";

import { colors } from "@/lib/theme";
import { useAuthStore } from "@/features/auth/auth";

export default function TabsLayout() {

  const initialized = useAuthStore((state) => state.initialized);
  const session = useAuthStore((state) => state.session);

  if(!initialized) return null;

  
  return (
    <NativeTabs tintColor={colors.primary} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(library)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "books.vertical", selected: "books.vertical.fill" }}
          md="menu_book"
        />
        <NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}