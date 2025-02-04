import { supabase } from './supabase';
import type { Period, AttendanceStats } from './types';

export async function getTeacherAttendanceStats(period: Period = 'all') {
  const { data, error } = await supabase
    .rpc('get_teacher_attendance_stats', { 
      period_filter: period,
      limit_count: 5 
    });

  if (error) throw error;
  return data as AttendanceStats[];
}

export async function getStudentAttendanceStats(period: Period = 'all') {
  const { data, error } = await supabase
    .rpc('get_student_attendance_stats', { 
      period_filter: period 
    });

  if (error) throw error;
  return data as AttendanceStats[];
}

export async function getActiveClasses() {
  const { data, error } = await supabase
    .from('classes')
    .select(`
      id,
      room_code,
      date,
      is_active,
      subjects (
        id,
        name,
        code,
        teacher_id
      )
    `)
    .eq('is_active', true)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getMarkedAttendance(studentId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select('class_id')
    .eq('student_id', studentId);

  if (error) throw error;
  return new Set(data.map(a => a.class_id));
}

export async function markAttendance(classId: string, studentId: string, deviceId: string) {
  const { error } = await supabase
    .from('attendance')
    .insert([
      {
        class_id: classId,
        student_id: studentId,
        device_id: deviceId
      },
    ]);

  if (error) throw error;
}

export async function getSubjects(teacherId: string) {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('teacher_id', teacherId);

  if (error) throw error;
  return data;
}

export async function createSubject(teacherId: string, name: string, code: string) {
  const { error } = await supabase
    .from('subjects')
    .insert([
      {
        name,
        code,
        teacher_id: teacherId,
      },
    ]);

  if (error) throw error;
}

export async function createClass(teacherId: string, subjectId: string, roomCode: string) {
  const { error } = await supabase
    .from('classes')
    .insert([
      {
        subject_id: subjectId,
        room_code: roomCode,
        created_by: teacherId,
        is_active: true,
      },
    ]);

  if (error) throw error;
}