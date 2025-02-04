import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erpId, setErpId] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTeacherAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up new teacher
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        // Create profile for teacher
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user!.id,
              email,
              full_name: fullName,
              role: 'teacher',
            },
          ]);

        if (profileError) throw profileError;
      } else {
        // Login existing teacher
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get device information
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      };

      // Create a device fingerprint
      const fingerprint = await generateDeviceFingerprint();

      const { data: session, error: authError } = await supabase.auth.signInWithPassword({
        email: `${erpId}@student.college.edu`, // Using ERP as email
        password: fingerprint, // Using device fingerprint as password
      });

      if (authError) throw authError;

      // Store device information
      const { error: deviceError } = await supabase
        .from('student_devices')
        .insert([
          {
            student_id: session.user.id,
            device_fingerprint: fingerprint,
            device_info: deviceInfo,
            expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          },
        ]);

      if (deviceError) throw deviceError;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateDeviceFingerprint = async () => {
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      new Date().getTimezoneOffset(),
      screen.width,
      screen.height,
      screen.colorDepth,
    ];

    const fingerprint = components.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <BookOpen className="mx-auto h-12 w-12 text-indigo-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isStudent ? 'Student Login' : (isSignUp ? 'Create Teacher Account' : 'Teacher Login')}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Toggle between Student and Teacher */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setIsStudent(false)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                !isStudent
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => setIsStudent(true)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isStudent
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Student
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={isStudent ? handleStudentAuth : handleTeacherAuth} className="space-y-6">
            {isStudent ? (
              <div>
                <label htmlFor="erpId" className="block text-sm font-medium text-gray-700">
                  ERP ID
                </label>
                <input
                  id="erpId"
                  type="text"
                  required
                  value={erpId}
                  onChange={(e) => setErpId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ) : (
              <>
                {isSignUp && (
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (isStudent ? 'Login' : (isSignUp ? 'Sign Up' : 'Sign In'))}
            </button>

            {!isStudent && (
              <div className="text-sm text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}