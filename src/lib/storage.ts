// Utilitários para gerenciar Local Storage

import { InjectionRecord, NutritionEntry, UserProfile, DailyGoals } from './types';

const STORAGE_KEYS = {
  INJECTIONS: 'monjauro_injections',
  NUTRITION: 'monjauro_nutrition',
  PROFILE: 'monjauro_profile',
} as const;

// Funções para Injeções
export const saveInjection = (injection: InjectionRecord): void => {
  const injections = getInjections();
  injections.push(injection);
  localStorage.setItem(STORAGE_KEYS.INJECTIONS, JSON.stringify(injections));
};

export const getInjections = (): InjectionRecord[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.INJECTIONS);
  return data ? JSON.parse(data) : [];
};

export const deleteInjection = (id: string): void => {
  const injections = getInjections().filter(inj => inj.id !== id);
  localStorage.setItem(STORAGE_KEYS.INJECTIONS, JSON.stringify(injections));
};

// Funções para Nutrição
export const saveNutritionEntry = (entry: NutritionEntry): void => {
  const entries = getNutritionEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(entries));
};

export const getNutritionEntries = (): NutritionEntry[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.NUTRITION);
  return data ? JSON.parse(data) : [];
};

export const deleteNutritionEntry = (id: string): void => {
  const entries = getNutritionEntries().filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(entries));
};

// Funções para Perfil do Usuário
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

// Funções auxiliares para cálculos
export const getTodayNutrition = (): { protein: number; fiber: number } => {
  const today = new Date().toISOString().split('T')[0];
  const entries = getNutritionEntries().filter(entry => entry.date === today);
  
  return entries.reduce(
    (acc, entry) => ({
      protein: acc.protein + entry.protein,
      fiber: acc.fiber + entry.fiber,
    }),
    { protein: 0, fiber: 0 }
  );
};

export const getWeeklyNutrition = (): Array<{ date: string; protein: number; fiber: number }> => {
  const entries = getNutritionEntries();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return last7Days.map(date => {
    const dayEntries = entries.filter(entry => entry.date === date);
    return {
      date,
      protein: dayEntries.reduce((sum, entry) => sum + entry.protein, 0),
      fiber: dayEntries.reduce((sum, entry) => sum + entry.fiber, 0),
    };
  });
};

export const getRecentInjections = (limit: number = 5): InjectionRecord[] => {
  return getInjections()
    .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
    .slice(0, limit);
};

// Inicializar perfil padrão se não existir
export const initializeDefaultProfile = (): void => {
  if (!getUserProfile()) {
    const defaultProfile: UserProfile = {
      name: 'Usuário',
      dailyGoals: {
        protein: 80, // 80g de proteína por dia
        fiber: 25, // 25g de fibra por dia
      },
      notifications: {
        enabled: true,
        injectionReminders: {
          enabled: true,
          times: ['08:00', '20:00'],
        },
        nutritionReminders: {
          enabled: true,
          times: ['12:00', '19:00'],
        },
      },
      startDate: new Date().toISOString().split('T')[0],
    };
    saveUserProfile(defaultProfile);
  }
};
