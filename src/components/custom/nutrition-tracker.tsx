'use client';

import { useState } from 'react';
import { Apple, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { saveNutritionEntry } from '@/lib/storage';
import { NutritionEntry } from '@/lib/types';

interface NutritionTrackerProps {
  onSuccess?: () => void;
}

export function NutritionTracker({ onSuccess }: NutritionTrackerProps) {
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [description, setDescription] = useState('');
  const [protein, setProtein] = useState('');
  const [fiber, setFiber] = useState('');
  const [calories, setCalories] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: NutritionEntry = {
      id: `nutr_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mealType,
      protein: parseFloat(protein) || 0,
      fiber: parseFloat(fiber) || 0,
      calories: calories ? parseFloat(calories) : undefined,
      description,
    };

    saveNutritionEntry(entry);
    
    // Reset form
    setDescription('');
    setProtein('');
    setFiber('');
    setCalories('');
    setOpen(false);
    
    if (onSuccess) onSuccess();
  };

  const mealTypeLabels = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snack: 'Lanche',
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg">
          <Apple className="w-4 h-4 mr-2" />
          Adicionar Refeição
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Apple className="w-5 h-5 text-emerald-600" />
            Registrar Refeição
          </DialogTitle>
          <DialogDescription>
            Registre sua refeição para acompanhar proteínas e fibras diárias.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Tipo de refeição */}
          <div className="space-y-2">
            <Label htmlFor="mealType">Tipo de Refeição</Label>
            <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">☀️ Café da Manhã</SelectItem>
                <SelectItem value="lunch">🌤️ Almoço</SelectItem>
                <SelectItem value="dinner">🌙 Jantar</SelectItem>
                <SelectItem value="snack">🍎 Lanche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Frango grelhado com salada"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Grid de nutrientes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Proteína */}
            <div className="space-y-2">
              <Label htmlFor="protein">Proteína (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                required
              />
            </div>

            {/* Fibra */}
            <div className="space-y-2">
              <Label htmlFor="fiber">Fibra (g)</Label>
              <Input
                id="fiber"
                type="number"
                step="0.1"
                placeholder="0"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                required
              />
            </div>

            {/* Calorias (opcional) */}
            <div className="space-y-2">
              <Label htmlFor="calories">Calorias</Label>
              <Input
                id="calories"
                type="number"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
          </div>

          {/* Dicas rápidas */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              💡 <strong>Dica:</strong> Alimentos ricos em proteína: frango, peixe, ovos, leguminosas. 
              Ricos em fibra: aveia, frutas, vegetais, grãos integrais.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              Salvar Refeição
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
