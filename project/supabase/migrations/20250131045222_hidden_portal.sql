/*
  # Add stored procedures for attendance statistics

  1. New Functions
    - get_teacher_attendance_stats: Returns attendance statistics for a teacher's students
    - get_student_attendance_stats: Returns attendance statistics for a student's subjects

  2. Changes
    - Added period filtering support
    - Added attendance percentage calculations
*/

-- Function to get teacher's student attendance stats
CREATE OR REPLACE FUNCTION get_teacher_attendance_stats(
  teacher_id uuid,
  period_filter text DEFAULT 'all',
  limit_count int DEFAULT 5
)
RETURNS TABLE (
  name text,
  attendance bigint,
  attendance_percentage numeric
) AS $$
DECLARE
  period_start timestamp;
BEGIN
  -- Set period start date
  period_start := CASE period_filter
    WHEN 'week' THEN CURRENT_DATE - INTERVAL '1 week'
    WHEN 'month' THEN CURRENT_DATE - INTERVAL '1 month'
    ELSE '1970-01-01'::timestamp
  END;

  RETURN QUERY
  WITH total_classes AS (
    SELECT COUNT(DISTINCT c.id) as total
    FROM classes c
    WHERE c.created_by = teacher_id
    AND c.date <= CURRENT_TIMESTAMP
  )
  SELECT 
    p.full_name,
    COUNT(*) as attendance,
    ROUND((COUNT(*) * 100.0 / NULLIF(tc.total, 0)), 2) as attendance_percentage
  FROM attendance a
  JOIN profiles p ON a.student_id = p.id
  JOIN classes c ON a.class_id = c.id
  CROSS JOIN total_classes tc
  WHERE c.created_by = teacher_id
  AND a.marked_at >= period_start
  GROUP BY p.id, p.full_name, tc.total
  ORDER BY attendance DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get student's subject attendance stats
CREATE OR REPLACE FUNCTION get_student_attendance_stats(
  student_id uuid,
  period_filter text DEFAULT 'all'
)
RETURNS TABLE (
  name text,
  attendance bigint,
  attendance_percentage numeric
) AS $$
DECLARE
  period_start timestamp;
BEGIN
  -- Set period start date
  period_start := CASE period_filter
    WHEN 'week' THEN CURRENT_DATE - INTERVAL '1 week'
    WHEN 'month' THEN CURRENT_DATE - INTERVAL '1 month'
    ELSE '1970-01-01'::timestamp
  END;

  RETURN QUERY
  WITH total_classes AS (
    SELECT 
      s.id as subject_id,
      COUNT(DISTINCT c.id) as total
    FROM subjects s
    JOIN classes c ON c.subject_id = s.id
    WHERE c.date <= CURRENT_TIMESTAMP
    GROUP BY s.id
  )
  SELECT 
    s.name,
    COUNT(*) as attendance,
    ROUND((COUNT(*) * 100.0 / NULLIF(tc.total, 0)), 2) as attendance_percentage
  FROM attendance a
  JOIN classes c ON a.class_id = c.id
  JOIN subjects s ON c.subject_id = s.id
  JOIN total_classes tc ON tc.subject_id = s.id
  WHERE a.student_id = student_id
  AND a.marked_at >= period_start
  GROUP BY s.id, s.name, tc.total
  ORDER BY attendance DESC;
END;
$$ LANGUAGE plpgsql;