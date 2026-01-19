'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getWeeklyNutrition, getUserProfile } from '@/lib/storage';

export function ProgressCharts() {
  const [weeklyData, setWeeklyData] = useState<Array<{ date: string; protein: number; fiber: number }>>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setWeeklyData(getWeeklyNutrition());
    setProfile(getUserProfile());
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const maxProtein = Math.max(...weeklyData.map(d => d.protein), profile?.dailyGoals.protein || 80);
  const maxFiber = Math.max(...weeklyData.map(d => d.fiber), profile?.dailyGoals.fiber || 25);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Progresso Semanal
        </CardTitle>
        <CardDescription>
          Acompanhe sua evolução nos últimos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Gráfico de Proteína */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Proteína (g)
              </h4>
              <span className="text-xs text-gray-500">
                Meta: {profile?.dailyGoals.protein || 80}g
              </span>
            </div>
            <div className="space-y-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-12">
                    {formatDate(day.date)}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${Math.min((day.protein / maxProtein) * 100, 100)}%` }}
                    >
                      {day.protein > 0 && (
                        <span className="text-xs font-medium text-white">
                          {day.protein.toFixed(1)}g
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de Fibra */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fibra (g)
              </h4>
              <span className="text-xs text-gray-500">
                Meta: {profile?.dailyGoals.fiber || 25}g
              </span>
            </div>
            <div className="space-y-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-12">
                    {formatDate(day.date)}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${Math.min((day.fiber / maxFiber) * 100, 100)}%` }}
                    >
                      {day.fiber > 0 && (
                        <span className="text-xs font-medium text-white">
                          {day.fiber.toFixed(1)}g
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estatísticas da semana */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {(weeklyData.reduce((sum, day) => sum + day.protein, 0) / 7).toFixed(1)}g
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Média Proteína/dia</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {(weeklyData.reduce((sum, day) => sum + day.fiber, 0) / 7).toFixed(1)}g
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Média Fibra/dia</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
