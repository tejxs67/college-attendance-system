/*
  # Add test teachers and subjects

  1. Test Data
    - Add 6 test teacher profiles
    - Add 6 subjects with corresponding teachers
  
  2. Notes
    - Teachers are created with basic profile information
    - Each teacher is assigned one subject
    - Passwords will need to be set up separately in Supabase Auth
*/

-- Insert test teachers
INSERT INTO auth.users (id, email)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'os.teacher@college.edu'),
  ('22222222-2222-2222-2222-222222222222', 'java.teacher@college.edu'),
  ('33333333-3333-3333-3333-333333333333', 'compiler.teacher@college.edu'),
  ('44444444-4444-4444-4444-444444444444', 'testing.tools.teacher@college.edu'),
  ('55555555-5555-5555-5555-555555555555', 'testing.teacher@college.edu'),
  ('66666666-6666-6666-6666-666666666666', 'analytics.teacher@college.edu')
ON CONFLICT (id) DO NOTHING;

-- Insert teacher profiles
INSERT INTO profiles (id, email, full_name, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'os.teacher@college.edu', 'Dr. Sarah Chen', 'teacher'),
  ('22222222-2222-2222-2222-222222222222', 'java.teacher@college.edu', 'Prof. James Wilson', 'teacher'),
  ('33333333-3333-3333-3333-333333333333', 'compiler.teacher@college.edu', 'Dr. Michael Brown', 'teacher'),
  ('44444444-4444-4444-4444-444444444444', 'testing.tools.teacher@college.edu', 'Prof. Emily Taylor', 'teacher'),
  ('55555555-5555-5555-5555-555555555555', 'testing.teacher@college.edu', 'Dr. Robert Martinez', 'teacher'),
  ('66666666-6666-6666-6666-666666666666', 'analytics.teacher@college.edu', 'Prof. Lisa Anderson', 'teacher')
ON CONFLICT (id) DO NOTHING;

-- Insert subjects with their respective teachers
INSERT INTO subjects (name, code, teacher_id)
VALUES 
  ('Operating Systems', 'OS101', '11111111-1111-1111-1111-111111111111'),
  ('Advanced Java', 'JAVA401', '22222222-2222-2222-2222-222222222222'),
  ('Compiler Construction', 'CC301', '33333333-3333-3333-3333-333333333333'),
  ('Software Testing Tools', 'STT201', '44444444-4444-4444-4444-444444444444'),
  ('Software Testing', 'ST101', '55555555-5555-5555-5555-555555555555'),
  ('Data Analytics', 'DA201', '66666666-6666-6666-6666-666666666666')
ON CONFLICT (code) DO NOTHING;