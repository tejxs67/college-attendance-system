import { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Subject = Database['public']['Tables']['subjects']['Row'];
export type Class = Database['public']['Tables']['classes']['Row'] & {
  subjects?: {
    name: string;
    code: string;
  };
};
export type Attendance = Database['public']['Tables']['attendance']['Row'];

export type Period = 'all' | 'week' | 'month';

export type AttendanceStats = {
  name: string;
  attendance: number;
  attendance_percentage: number;
};