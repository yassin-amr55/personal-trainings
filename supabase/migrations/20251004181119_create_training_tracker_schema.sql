/*
  # Training Tracker Database Schema

  1. New Tables
    - `training_duration_notes`
      - `id` (uuid, primary key)
      - `sport` (text) - The sport name (Kickboxing, Archery, etc.)
      - `start_date` (date) - When training started
      - `end_date` (date, nullable) - When training ended, null if continuing
      - `is_continuing` (boolean) - Whether still training
      - `created_at` (timestamptz)
    
    - `trainers`
      - `id` (uuid, primary key)
      - `sport` (text) - The sport name
      - `name` (text) - Trainer's name
      - `start_date` (date) - When started with this trainer
      - `end_date` (date, nullable) - When ended with this trainer
      - `created_at` (timestamptz)
    
    - `normal_notes`
      - `id` (uuid, primary key)
      - `sport` (text) - The sport name
      - `content` (text) - Note content
      - `created_at` (timestamptz)
    
    - `championships`
      - `id` (uuid, primary key)
      - `sport` (text) - The sport name
      - `type` (text) - Type: Normal, Egyptian, International
      - `name` (text) - Championship name
      - `place` (text) - Place achieved (1st, 2nd, etc.)
      - `award` (text) - Award received
      - `image_url` (text, nullable) - Award image
      - `created_at` (timestamptz)
    
    - `sport_images`
      - `id` (uuid, primary key)
      - `sport` (text) - The sport name
      - `image_url` (text) - Image URL
      - `created_at` (timestamptz)
    
    - `horses`
      - `id` (uuid, primary key)
      - `name` (text) - Horse name
      - `age` (text) - Horse age
      - `gender` (text) - Male or Female
      - `acquired_date` (date) - When acquired
      - `image_url` (text, nullable) - Horse photo
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a personal tracker)
*/

-- Training Duration Notes
CREATE TABLE IF NOT EXISTS training_duration_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sport text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  is_continuing boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE training_duration_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage training duration notes"
  ON training_duration_notes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trainers
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sport text NOT NULL,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage trainers"
  ON trainers FOR ALL
  USING (true)
  WITH CHECK (true);

-- Normal Notes
CREATE TABLE IF NOT EXISTS normal_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sport text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE normal_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage normal notes"
  ON normal_notes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Championships
CREATE TABLE IF NOT EXISTS championships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sport text NOT NULL,
  type text NOT NULL,
  name text NOT NULL,
  place text NOT NULL,
  award text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE championships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage championships"
  ON championships FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sport Images
CREATE TABLE IF NOT EXISTS sport_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sport text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sport_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage sport images"
  ON sport_images FOR ALL
  USING (true)
  WITH CHECK (true);

-- Horses
CREATE TABLE IF NOT EXISTS horses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age text NOT NULL,
  gender text NOT NULL,
  acquired_date date NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE horses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage horses"
  ON horses FOR ALL
  USING (true)
  WITH CHECK (true);