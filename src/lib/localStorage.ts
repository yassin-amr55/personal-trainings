import { Championship, NormalNote, Trainer, TrainingDurationNote, SportImage, Horse } from '../types';

const STORAGE_KEYS = {
  championships: 'championships',
  normalNotes: 'normal_notes',
  trainers: 'trainers',
  trainingDurationNotes: 'training_duration_notes',
  sportImages: 'sport_images',
  horses: 'horses',
};

// Generic functions
function getItems<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

function addItem<T extends { id: string }>(key: string, item: T): void {
  const items = getItems<T>(key);
  items.push(item);
  setItems(key, items);
}

function updateItem<T extends { id: string }>(key: string, id: string, updates: Partial<T>): void {
  const items = getItems<T>(key);
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    setItems(key, items);
  }
}

function deleteItem<T extends { id: string }>(key: string, id: string): void {
  const items = getItems<T>(key);
  const filtered = items.filter(item => item.id !== id);
  setItems(key, filtered);
}

// Specific functions
export const localStorageAPI = {
  // Championships
  getChampionships: (): Championship[] => getItems<Championship>(STORAGE_KEYS.championships),
  addChampionship: (championship: Championship) => addItem(STORAGE_KEYS.championships, championship),
  updateChampionship: (id: string, updates: Partial<Championship>) => updateItem(STORAGE_KEYS.championships, id, updates),
  deleteChampionship: (id: string) => deleteItem<Championship>(STORAGE_KEYS.championships, id),

  // Normal Notes
  getNormalNotes: (): NormalNote[] => getItems<NormalNote>(STORAGE_KEYS.normalNotes),
  addNormalNote: (note: NormalNote) => addItem(STORAGE_KEYS.normalNotes, note),
  updateNormalNote: (id: string, updates: Partial<NormalNote>) => updateItem(STORAGE_KEYS.normalNotes, id, updates),
  deleteNormalNote: (id: string) => deleteItem<NormalNote>(STORAGE_KEYS.normalNotes, id),

  // Trainers
  getTrainers: (): Trainer[] => getItems<Trainer>(STORAGE_KEYS.trainers),
  addTrainer: (trainer: Trainer) => addItem(STORAGE_KEYS.trainers, trainer),
  updateTrainer: (id: string, updates: Partial<Trainer>) => updateItem(STORAGE_KEYS.trainers, id, updates),
  deleteTrainer: (id: string) => deleteItem<Trainer>(STORAGE_KEYS.trainers, id),

  // Training Duration Notes
  getTrainingDurationNotes: (): TrainingDurationNote[] => getItems<TrainingDurationNote>(STORAGE_KEYS.trainingDurationNotes),
  addTrainingDurationNote: (note: TrainingDurationNote) => addItem(STORAGE_KEYS.trainingDurationNotes, note),
  updateTrainingDurationNote: (id: string, updates: Partial<TrainingDurationNote>) => updateItem(STORAGE_KEYS.trainingDurationNotes, id, updates),
  deleteTrainingDurationNote: (id: string) => deleteItem<TrainingDurationNote>(STORAGE_KEYS.trainingDurationNotes, id),

  // Sport Images
  getSportImages: (): SportImage[] => getItems<SportImage>(STORAGE_KEYS.sportImages),
  addSportImage: (image: SportImage) => addItem(STORAGE_KEYS.sportImages, image),
  updateSportImage: (id: string, updates: Partial<SportImage>) => updateItem(STORAGE_KEYS.sportImages, id, updates),
  deleteSportImage: (id: string) => deleteItem<SportImage>(STORAGE_KEYS.sportImages, id),

  // Horses
  getHorses: (): Horse[] => getItems<Horse>(STORAGE_KEYS.horses),
  addHorse: (horse: Horse) => addItem(STORAGE_KEYS.horses, horse),
  updateHorse: (id: string, updates: Partial<Horse>) => updateItem(STORAGE_KEYS.horses, id, updates),
  deleteHorse: (id: string) => deleteItem<Horse>(STORAGE_KEYS.horses, id),
};
