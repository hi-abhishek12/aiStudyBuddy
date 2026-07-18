import { useAuthStore } from "@/features/auth/auth";
import { supabase } from "@/utils/supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type ChunkMatch = { id: string; content: string; similarity: number };

function getApiUrl(path: string) {
    if (!API_URL?.trim()) {
        throw new Error(
            "Missing EXPO_PUBLIC_API_URL. Set it to your backend URL, for example http://YOUR_LAN_IP:3001",
        );
    }

    const baseUrl = API_URL.trim().replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
}

async function readErrorMessage(response: Response) {
    const text = await response.text();
    if (!text) return `Request failed (${response.status})`;

    try {
        const json = JSON.parse(text) as { error?: unknown; message?: unknown };
        if (typeof json.error === "string") return json.error;
        if (typeof json.message === "string") return json.message;
    } catch {
        // Fall back to the raw response body below.
    }

    return text;
}

export async function apiPost<T>(path : string , body : unknown = {}) : Promise<T> {
    const {data} = await supabase.auth.getSession();

    const token = data.session?.access_token || useAuthStore.getState().session?.access_token;

    if(!token) throw new Error("Not authenticated");

    const url = getApiUrl(path);
    let response: Response;

    try {
        response = await fetch(url,{
            method : 'POST',
            headers : {
                accept : "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Access-Token": token,
            },
            body : JSON.stringify(body)
        })
    } catch (err) {
        const message = err instanceof Error ? err.message : "Network request failed";
        throw new Error(
            `Cannot reach API at ${url}. Make sure the backend is running and EXPO_PUBLIC_API_URL includes the port. ${message}`,
        );
    }

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    return response.json();
}


export function processSource(sourceId: string) {
    return apiPost<{ status: string; chunkCount: number }>(
      `/sources/${sourceId}/process`,
    );
  }

  export function generateSummary(studySetId: string) {
    return apiPost<{ id: string; content: string }>(
      `/study-sets/${studySetId}/summary`,
    );
  }
  
  export function generateFlashcards(studySetId: string, count?: number) {
    return apiPost<{
      deckId: string;
      cards: { front: string; back: string }[];
    }>(`/study-sets/${studySetId}/flashcards`, { count });
  }
  
  export function sendChatMessage(conversationId: string, message: string) {
    return apiPost<{ reply: string; sources: ChunkMatch[] }>(
      `/conversations/${conversationId}/chat`,
      { message },
    );
  }
