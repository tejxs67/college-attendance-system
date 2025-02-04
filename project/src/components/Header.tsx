import React from 'react';
import { BookOpen, UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';

interface HeaderProps {
  profile: Profile;
}

export default function Header({ profile }: HeaderProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900 truncate">
              College Attendance
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserCircle className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-700 truncate max-w-[150px]">
              {profile.full_name}
            </span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="ml-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}