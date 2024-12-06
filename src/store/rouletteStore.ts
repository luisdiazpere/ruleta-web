import { create } from 'zustand';
import { RouletteState, RouletteOption } from '../types/roulette';

interface RouletteStore extends RouletteState {
  addOption: (text: string) => void;
  removeOption: (id: string) => void;
  resetOptions: () => void;
  spin: () => void;
  loadOptions: (options: string[]) => void;
}

export const useRouletteStore = create<RouletteStore>((set, get) => ({
  options: [],
  spinning: false,
  selectedOption: null,
  
  addOption: (text) => {
    const newOption: RouletteOption = {
      id: crypto.randomUUID(),
      text,
    };
    set((state) => ({ options: [...state.options, newOption] }));
  },
  
  removeOption: (id) => {
    set((state) => ({
      options: state.options.filter((opt) => opt.id !== id),
    }));
  },
  
  resetOptions: () => {
    set({ options: [], selectedOption: null });
  },
  
  spin: () => {
    const { options } = get();
    if (options.length === 0) return;
    
    set({ spinning: true });
    const randomIndex = Math.floor(Math.random() * options.length);
    
    setTimeout(() => {
      set({
        spinning: false,
        selectedOption: options[randomIndex],
      });
    }, 2000);
  },
  
  loadOptions: (textOptions) => {
    const newOptions = textOptions.map((text) => ({
      id: crypto.randomUUID(),
      text,
    }));
    set({ options: newOptions });
  },
}));