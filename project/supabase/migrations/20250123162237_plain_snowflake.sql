/*
  # College Attendance System Schema

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to Supabase auth.users
      - Includes role (teacher/student)
    
    - `subjects`
      - Stores subject information
      - Includes subject name and code
    
    - `classes`
      - Stores class session information
      - Includes subject_id, date, and room code
    
    - `attendance`
      - Stores attendance records
      - Links students to classes
      
  2. Security
    - RLS enabled on all tables
    - Policies for both teachers and students
    tejasph1
    p3GFuU8dJo8sbBZR
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('teacher', 'student');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  teacher_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id),
  room_code text NOT NULL,
  date timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id),
  student_id uuid REFERENCES profiles(id),
  marked_at timestamptz DEFAULT now(),
  UNIQUE(class_id, student_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Subjects policies
CREATE POLICY "Anyone can view subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers can create subjects"
  ON subjects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

-- Classes policies
CREATE POLICY "Anyone can view active classes"
  ON classes FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Teachers can create classes"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

-- Attendance policies
CREATE POLICY "Students can view their attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

CREATE POLICY "Students can mark their attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM classes
      WHERE id = class_id
      AND is_active = true
    )
  );