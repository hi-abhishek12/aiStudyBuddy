import { useAuthStore } from "@/features/auth/auth";
import { supabase } from "@/utils/supabase";

const API_URL = `http://127.0.0.1:3001`;

export async function apiPost<T>(path : string , body : unknown = {}) : Promise<T> {
    const {data} = await supabase.auth.getSession();

    const token = data.session?.access_token || useAuthStore.getState().session?.access_token;

    if(!token) throw new Error("Not authenticated");

    const response = await fetch((`${API_URL}${path}`),{
        method : 'POST',
        headers : {
            accept : "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Access-Token": token,
        },
        body : JSON.stringify(body)
    })

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed (${response.status})`);
    }

    return response.json();
}


export function processSource(sourceId: string) {
    return apiPost<{ status: string; chunkCount: number }>(
      `/sources/${sourceId}/process`,
    );
  }