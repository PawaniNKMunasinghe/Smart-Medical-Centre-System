'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Navbar from './Navbar';
import { Heart, Pill, Calendar, Users, Activity, AlertCircle, Plus, Clock, CheckCircle } from 'lucide-react';

interface StudentProfile {
  _id?: string;
  studentId: string;
  university: string;
  department: string;
  medicalHistory: string;
  allergies: string;
  bloodType: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<StudentProfile>({
    studentId: '',
    university: '',
    department: '',
    medicalHistory: '',
    allergies: '',
    bloodType: '',
    emergencyContact: '',
    emergencyPhone: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile || {
          studentId: '',
          university: '',
          department: '',
          medicalHistory: '',
          allergies: '',
          bloodType: '',
          emergencyContact: '',
          emergencyPhone: '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/profile/student', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Student Health Dashboard</h1>
              <p className="text-blue-100 mt-1">Wayamba University of Sri Lanka</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
                <p className="text-blue-100 text-sm">{user?.email}</p>
              </div>
              <Button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {message && (
            <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <AlertCircle className="w-5 h-5" />
              {message}
            </div>
          )}

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Link href="/health-tracking">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Health Tracking</h3>
                </div>
                <p className="text-sm text-gray-600">Monitor your health metrics</p>
              </div>
            </Link>

            <Link href="/medicine-management">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Medications</h3>
                </div>
                <p className="text-sm text-gray-600">Manage your prescriptions</p>
              </div>
            </Link>

            <Link href="/appointments">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Appointments</h3>
                </div>
                <p className="text-sm text-gray-600">Book doctor appointments</p>
              </div>
            </Link>

            <Link href="/doctors">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Our Doctors</h3>
                </div>
                <p className="text-sm text-gray-600">Find expert doctors</p>
              </div>
            </Link>
          </div>

          {/* Current Medications Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Pill className="w-6 h-6 text-green-600" />
                    Current Medications
                  </h2>
                  <Link href="/medicine-management" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add New
                  </Link>
                </div>
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Pill className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-600">No medications added</p>
                  <p className="text-sm text-gray-500">Start tracking your medications by clicking &quot;Add New Medication&quot; button above.</p>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Upcoming
                </h2>
              </div>
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <Clock className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-600 text-sm">No upcoming appointments scheduled</p>
                <Link 
                  href="/appointments"
                  className="inline-block mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-semibold"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* Appointment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-100" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-100" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">0</p>
                </div>
                <Clock className="w-12 h-12 text-orange-100" />
              </div>
            </div>
          </div>

          {/* Doctors Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-red-600" />
                Available Doctors
              </h2>
              <Link href="/doctors" className="text-blue-600 hover:text-blue-700 font-semibold">
                View All →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doctor 1 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">👨‍⚕️</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Dr. K.M.S.V. Jayasinghe</h3>
                    <p className="text-red-600 font-semibold text-sm">General Physician</p>
                    <p className="text-gray-600 text-sm mt-1">10+ Years Experience</p>
                    <p className="text-gray-600 text-sm">Base Hospital Kuliyapitiya</p>
                    <div className="flex gap-2 mt-3">
                      <Link href="/appointments" className="flex-1">
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold">
                          Book Now
                        </button>
                      </Link>
                      <Link href="/doctors/1" className="flex-1">
                        <button className="w-full border border-red-600 text-red-600 hover:bg-red-50 py-2 rounded text-sm font-semibold">
                          Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor 2 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">👨‍⚕️</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Dr. R.A.V.K. Rathnayake</h3>
                    <p className="text-red-600 font-semibold text-sm">General Physician</p>
                    <p className="text-gray-600 text-sm mt-1">10+ Years Experience</p>
                    <p className="text-gray-600 text-sm">Base Hospital Kuliyapitiya</p>
                    <div className="flex gap-2 mt-3">
                      <Link href="/appointments" className="flex-1">
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold">
                          Book Now
                        </button>
                      </Link>
                      <Link href="/doctors/2" className="flex-1">
                        <button className="w-full border border-red-600 text-red-600 hover:bg-red-50 py-2 rounded text-sm font-semibold">
                          Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Information Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                Your Health Information
              </h2>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Edit Details
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.studentId}
                    onChange={(e) => setProfile({ ...profile, studentId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.studentId || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.university}
                    onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.university || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.department || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.bloodType}
                    onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.bloodType || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.allergies}
                    onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.allergies || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.emergencyPhone}
                    onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.emergencyPhone || 'Not set'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                {isEditing ? (
                  <textarea
                    value={profile.medicalHistory}
                    onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.medicalHistory || 'Not set'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.emergencyContact}
                    onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.emergencyContact || 'Not set'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          {/* Leadership Team Link */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">MediTrack Leadership Team</h3>
                <p className="text-gray-600">Learn about the experienced professionals leading your health management platform</p>
              </div>
              <Link 
                href="/team"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ml-4"
              >
                View Team
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
