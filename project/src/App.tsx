import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { UserCircle, BookOpen } from 'lucide-react';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import type { Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'teacher' | 'student';
  created_at: string;
  updated_at: string;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setUserProfile(data as Profile);
    }
  };

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                {userProfile?.full_name}
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

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {userProfile?.role === 'teacher' ? (
          <TeacherDashboard profile={userProfile} />
        ) : (
          <StudentDashboard profile={userProfile} />
        )}
      </main>
    </div>
  );
}

export default App;