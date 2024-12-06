export interface RouletteOption {
  id: string;
  text: string;
  isSelected?: boolean;
}

export interface RouletteState {
  options: RouletteOption[];
  spinning: boolean;
  selectedOption: RouletteOption | null;
}

export interface SavedList {
  id: string;
  name: string;
  options: RouletteOption[];
}