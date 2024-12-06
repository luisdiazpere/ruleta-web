import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedList, RouletteOption } from '../types/roulette';

interface SavedListsState {
  lists: SavedList[];
  addList: (name: string, options: RouletteOption[]) => void;
  removeList: (id: string) => void;
  loadList: (id: string) => RouletteOption[];
}

export const useSavedListsStore = create<SavedListsState>()(
  persist(
    (set, get) => ({
      lists: [],
      addList: (name, options) => {
        const newList: SavedList = {
          id: crypto.randomUUID(),
          name,
          options: [...options],
        };
        set((state) => ({
          lists: [...state.lists, newList],
        }));
      },
      removeList: (id) => {
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        }));
      },
      loadList: (id) => {
        const list = get().lists.find((l) => l.id === id);
        return list ? [...list.options] : [];
      },
    }),
    {
      name: 'saved-lists-storage',
    }
  )
);