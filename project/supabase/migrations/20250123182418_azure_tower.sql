/*
  # Add class schedules for subjects
  
  1. New Data
    - Add daily class schedules from 11am to 2pm
    - Three time slots per day for each subject
*/

-- Insert class schedules
INSERT INTO classes (subject_id, room_code, date, is_active, created_by)
SELECT 
  s.id as subject_id,
  'RM-' || FLOOR(RANDOM() * 100 + 100)::text as room_code,
  CURRENT_DATE + (d || ' days')::interval + (h || ' hours')::interval as date,
  true as is_active,
  s.teacher_id as created_by
FROM subjects s
CROSS JOIN generate_series(0, 4) d -- Next 5 days
CROSS JOIN generate_series(11, 13) h -- 11am to 2pm
ON CONFLICT DO NOTHING;