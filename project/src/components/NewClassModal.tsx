import React, { useState } from 'react';
import type { Profile, Subject } from '../lib/types';
import { createClass } from '../lib/api';

interface NewClassModalProps {
  profile: Profile;
  subjects: Subject[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewClassModal({ profile, subjects, onClose, onSuccess }: NewClassModalProps) {
  const [subjectId, setSubjectId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createClass(profile.id, subjectId, roomCode);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to create class');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Start New Class</h3>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
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
              value={roomCode}
              onChange={e => setRoomCode(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}