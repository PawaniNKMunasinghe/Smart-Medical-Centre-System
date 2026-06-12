'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link'
import { Stethoscope, UserPlus, LogIn, Activity, Pill, Calendar, Users, Clock, CheckCircle } from 'lucide-react'
import api from '@/utils/api';

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/appointments/available-doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-6">
            <Stethoscope className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            MediTrack
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            University Student Health Management System
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Health Tracking</h3>
            <p className="text-gray-600 text-sm">Monitor your health and wellness</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Pill className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Medicine Management</h3>
            <p className="text-gray-600 text-sm">Track prescriptions and medications</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Appointments</h3>
            <p className="text-gray-600 text-sm">Book and manage doctor appointments</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Stethoscope className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Expert Doctors</h3>
            <p className="text-gray-600 text-sm">Access qualified healthcare professionals</p>
          </div>
        </div>

        {/* Available Doctors Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Available Doctors</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading doctors...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{doctor.userId?.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Available</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {doctor.availableFrom} - {doctor.availableTill}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {doctor.appointmentSlotDuration} min slots
                      </p>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                      Book Appointment
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">No available doctors at the moment</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}