export interface ChefVoiceResponse {
  response: string;
  // Si usas generación de audio en backend:
  // audioUrl?: string;
  // audioDuration?: number;
}

export interface ConversationItem {
  role: "user" | "chef";
  content: string;
  timestamp?: Date;
}
