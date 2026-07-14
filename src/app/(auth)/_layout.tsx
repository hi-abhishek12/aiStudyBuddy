import { useAuthStore } from "@/features/auth/auth";
import { Stack , Href , Redirect } from "expo-router";


export default function AuthLayout() {
    const initialized = useAuthStore((state) => state.initialized);
    const session = useAuthStore((state) => state.session);

    if(!initialized) return null;
    if(session) return <Redirect href={'/' as Href}/>
    
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: "#101010"
                }
            }}
        />
    )
}
