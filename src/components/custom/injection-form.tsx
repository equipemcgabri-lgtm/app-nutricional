'use client';

import { useState } from 'react';
import { Camera, Syringe, MapPin, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { saveInjection } from '@/lib/storage';
import { InjectionRecord } from '@/lib/types';

interface InjectionFormProps {
  onSuccess?: () => void;
}

export function InjectionForm({ onSuccess }: InjectionFormProps) {
  const [open, setOpen] = useState(false);
  const [medication, setMedication] = useState('Mounjaro');
  const [dosage, setDosage] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const injection: InjectionRecord = {
      id: `inj_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0].substring(0, 5),
      medication,
      dosage,
      location,
      notes,
      photoUrl: photoPreview || undefined,
    };

    saveInjection(injection);
    
    // Reset form
    setMedication('Mounjaro');
    setDosage('');
    setLocation('');
    setNotes('');
    setPhotoPreview(null);
    setOpen(false);
    
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg">
          <Syringe className="w-4 h-4 mr-2" />
          Registrar Injeção
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Syringe className="w-5 h-5 text-blue-600" />
            Registrar Nova Injeção
          </DialogTitle>
          <DialogDescription>
            Registre sua aplicação com detalhes e foto para acompanhamento completo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Medicamento */}
          <div className="space-y-2">
            <Label htmlFor="medication">Medicamento</Label>
            <Select value={medication} onValueChange={setMedication}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mounjaro">Mounjaro (Tirzepatida)</SelectItem>
                <SelectItem value="Ozempic">Ozempic (Semaglutida)</SelectItem>
                <SelectItem value="Wegovy">Wegovy (Semaglutida)</SelectItem>
                <SelectItem value="Saxenda">Saxenda (Liraglutida)</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dosagem */}
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosagem</Label>
            <Input
              id="dosage"
              placeholder="Ex: 2.5mg, 5mg, 7.5mg..."
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
            />
          </div>

          {/* Local da aplicação */}
          <div className="space-y-2">
            <Label htmlFor="location">Local da Aplicação</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Abdômen">Abdômen</SelectItem>
                <SelectItem value="Coxa">Coxa</SelectItem>
                <SelectItem value="Braço">Braço</SelectItem>
                <SelectItem value="Glúteo">Glúteo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload de foto */}
          <div className="space-y-2">
            <Label>Foto da Aplicação (Opcional)</Label>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                <Camera className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {photoPreview ? 'Alterar foto' : 'Adicionar foto'}
                </span>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              
              {photoPreview && (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Como você está se sentindo? Algum efeito colateral?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
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
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              Salvar Registro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
