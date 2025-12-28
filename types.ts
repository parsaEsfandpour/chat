
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'fa';
export type View = 'chat' | 'imageGen' | 'imageEdit' | 'search' | 'maps';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  isStreaming?: boolean;
  groundingSources?: GroundingSource[];
}

export type ChatMode = 'fast' | 'pro' | 'thinking';

export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";
export type ImageSize = "1K" | "2K" | "4K";

export interface GroundingSource {
    uri: string;
    title: string;
}
