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

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "Fácil" | "Intermedio" | "Difícil";
  category: "Desayuno" | "Almuerzo" | "Cena" | "Postre" | "Snack";
  imageUrl: string;
}
