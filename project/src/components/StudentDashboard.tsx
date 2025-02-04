import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2 } from 'lucide-react';
import type { Profile, Period, AttendanceStats } from '../lib/types';
import { getActiveClasses, getMarkedAttendance, markAttendance, getStudentAttendanceStats } from '../lib/api';

interface StudentDashboardProps {
  profile: Profile;
}

export default function StudentDashboard({ profile }: StudentDashboardProps) {
  const [activeClasses, setActiveClasses] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats[]>([]);
  const [markedAttendance, setMarkedAttendance] = useState<Set<string>>(new Set());
  const [period, setPeriod] = useState<Period>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      const [classes, marked, stats] = await Promise.all([
        getActiveClasses(),
        getMarkedAttendance(profile.id),
        getStudentAttendanceStats(period)
      ]);
      
      setActiveClasses(classes);
      setMarkedAttendance(marked);
      setAttendanceStats(stats);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    }
  };

  const handleMarkAttendance = async (classId: string) => {
    try {
      await markAttendance(classId, profile.id);
      await loadData();
    } catch (err) {
      setError('Failed to mark attendance');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Active Classes
            </h2>
          </div>
          <div className="space-y-3">
            {activeClasses.map(class_ => (
              <div
                key={class_.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {class_.subjects.name}
                    <span className="text-sm text-gray-500 ml-2">
                      ({class_.subjects.code})
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Room: {class_.room_code}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(class_.date), 'PPp')}
                  </p>
                </div>
                {markedAttendance.has(class_.id) ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <button
                    onClick={() => handleMarkAttendance(class_.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Mark Present
                  </button>
                )}
              </div>
            ))}
            {activeClasses.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No active classes at the moment
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Attendance by Subject
            </h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance_percentage" fill="#4F46E5" name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}