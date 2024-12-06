import React from 'react';
import { useSavedListsStore } from '../store/savedListsStore';
import { useRouletteStore } from '../store/rouletteStore';
import { Trash2, Download } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const SavedLists = () => {
  const { lists, removeList, loadList } = useSavedListsStore();
  const { loadOptions } = useRouletteStore();
  const user = useAuthStore((state) => state.user);

  if (!user || user.username !== 'admin') {
    return null;
  }

  const handleLoadList = (id: string) => {
    const options = loadList(id);
    loadOptions(options.map(opt => opt.text));
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-xl font-semibold mb-4">Saved Lists</h3>
      {lists.length === 0 ? (
        <p className="text-gray-500">No saved lists yet</p>
      ) : (
        <div className="space-y-2">
          {lists.map((list) => (
            <div
              key={list.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <span className="font-medium">{list.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLoadList(list.id)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Load list"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={() => removeList(list.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete list"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};