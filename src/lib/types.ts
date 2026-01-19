// Tipos para o aplicativo de acompanhamento nutricional

export interface InjectionRecord {
  id: string;
  date: string;
  time: string;
  medication: string;
  dosage: string;
  photoUrl?: string;
  notes?: string;
  location?: string; // Local da aplicação (braço, abdômen, etc)
}

export interface NutritionEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  protein: number; // gramas
  fiber: number; // gramas
  calories?: number;
  description: string;
}

export interface DailyGoals {
  protein: number; // gramas por dia
  fiber: number; // gramas por dia
}

export interface NotificationSettings {
  enabled: boolean;
  injectionReminders: {
    enabled: boolean;
    times: string[]; // Array de horários no formato "HH:mm"
  };
  nutritionReminders: {
    enabled: boolean;
    times: string[];
  };
}

export interface UserProfile {
  name: string;
  dailyGoals: DailyGoals;
  notifications: NotificationSettings;
  startDate: string;
}
