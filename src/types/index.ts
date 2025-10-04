export type Sport = 'Kickboxing' | 'Archery' | 'Horse Jumping' | 'Swimming' | 'Sailing';

export interface TrainingDurationNote {
  id: string;
  sport: Sport;
  start_date: string;
  end_date: string | null;
  is_continuing: boolean;
  created_at: string;
}

export interface Trainer {
  id: string;
  sport: Sport;
  name: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface NormalNote {
  id: string;
  sport: Sport;
  content: string;
  created_at: string;
}

export interface Championship {
  id: string;
  sport: Sport;
  type: 'Normal' | 'Egyptian' | 'International';
  name: string;
  place: string;
  award: string;
  date: string;
  penalties: string;
  image_url: string | null;
  created_at: string;
}

export interface SportImage {
  id: string;
  sport: Sport;
  image_url: string;
  created_at: string;
}

export interface Horse {
  id: string;
  name: string;
  age: string;
  gender: 'Male' | 'Female';
  acquired_date: string;
  image_url: string | null;
  created_at: string;
}
