import React, { useRef, useState } from 'react';
import { useRouletteStore } from '../store/rouletteStore';
import { useSavedListsStore } from '../store/savedListsStore';
import { useAuthStore } from '../store/authStore';
import { Trash2, Upload, Save } from 'lucide-react';
import { SavedLists } from './SavedLists';
import { RouletteWheel } from './RouletteWheel';

export const Roulette = () => {
  const { options, spinning, selectedOption, addOption, removeOption, resetOptions, spin, loadOptions } = useRouletteStore();
  const { addList } = useSavedListsStore();
  const user = useAuthStore((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newOption, setNewOption] = useState('');
  const [listName, setListName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const options = text.split('\n').filter(Boolean);
      loadOptions(options);
    };
    reader.readAsText(file);
  };

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOption.trim()) {
      addOption(newOption.trim());
      setNewOption('');
    }
  };

  const handleSaveList = (e: React.FormEvent) => {
    e.preventDefault();
    if (listName.trim() && options.length > 0) {
      addList(listName.trim(), options);
      setListName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Interactive Roulette</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Input and List */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <form onSubmit={handleAddOption} className="flex gap-2">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                    placeholder="Add new option"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Add
                  </button>
                </form>
                
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".txt"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Upload size={20} /> Upload .txt
                  </button>
                  <button
                    onClick={resetOptions}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <Trash2 size={20} /> Reset
                  </button>
                </div>

                {user?.username === 'admin' && options.length > 0 && (
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Save size={20} /> Save List
                  </button>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4">LIST</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        selectedOption?.id === option.id
                          ? 'bg-purple-100 border-2 border-purple-500'
                          : 'bg-white'
                      }`}
                    >
                      <span>{option.text}</span>
                      <button
                        onClick={() => removeOption(option.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Roulette Wheel */}
            <div className="lg:col-span-2 flex items-center justify-center">
              <RouletteWheel
                options={options}
                spinning={spinning}
                selectedOption={selectedOption}
                onSpin={spin}
              />
            </div>
          </div>
        </div>

        {user?.username === 'admin' && <SavedLists />}

        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Save List</h3>
              <form onSubmit={handleSaveList} className="space-y-4">
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="Enter list name"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSaveDialog(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};