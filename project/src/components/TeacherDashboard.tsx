import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, BookOpen, Users } from 'lucide-react';
import type { Profile, Period, AttendanceStats, Subject } from '../lib/types';
import { getTeacherAttendanceStats, getSubjects, createSubject, createClass } from '../lib/api';

interface TeacherDashboardProps {
  profile: Profile;
}

export default function TeacherDashboard({ profile }: TeacherDashboardProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats[]>([]);
  const [period, setPeriod] = useState<Period>('all');
  const [showNewSubjectModal, setShowNewSubjectModal] = useState(false);
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [newClass, setNewClass] = useState({ subject_id: '', room_code: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      const [subjectsData, stats] = await Promise.all([
        getSubjects(profile.id),
        getTeacherAttendanceStats(period)
      ]);
      
      setSubjects(subjectsData);
      setAttendanceStats(stats);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    }
  };

  const handleCreateSubject = async () => {
    try {
      await createSubject(profile.id, newSubject.name, newSubject.code);
      setShowNewSubjectModal(false);
      setNewSubject({ name: '', code: '' });
      await loadData();
    } catch (err) {
      setError('Failed to create subject');
      console.error(err);
    }
  };

  const handleCreateClass = async () => {
    try {
      await createClass(profile.id, newClass.subject_id, newClass.room_code);
      setShowNewClassModal(false);
      setNewClass({ subject_id: '', room_code: '' });
      await loadData();
    } catch (err) {
      setError('Failed to create class');
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Subjects</h2>
            <button
              onClick={() => setShowNewSubjectModal(true)}
              className="p-2 text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            {subjects.map(subject => (
              <div
                key={subject.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium text-gray-900">{subject.name}</p>
                  <p className="text-sm text-gray-500">Code: {subject.code}</p>
                </div>
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Top 5 Student Attendance
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

      {/* New Subject Modal */}
      {showNewSubjectModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add New Subject</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject Code
                </label>
                <input
                  type="text"
                  value={newSubject.code}
                  onChange={e => setNewSubject({ ...newSubject, code: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewSubjectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSubject}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Create Subject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Class Modal */}
      {showNewClassModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Start New Class</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  value={newClass.subject_id}
                  onChange={e => setNewClass({ ...newClass, subject_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Code
                </label>
                <input
                  type="text"
                  value={newClass.room_code}
                  onChange={e => setNewClass({ ...newClass, room_code: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewClassModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClass}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Start Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}