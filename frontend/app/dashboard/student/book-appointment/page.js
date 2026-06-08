'use client'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import api from '@/utils/api'
import { Calendar, Clock, User, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BookAppointmentPage() {
  const { user, token } = useContext(AuthContext)
  const router = useRouter()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    symptoms: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const fetchDoctors = async () => {
      try {
        const response = await api.get('/appointments/available-doctors')
        setDoctors(response.data)
      } catch (error) {
        toast.error('Failed to load doctors')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [token, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please fill all required fields')
      return
    }

    setSubmitting(true)

    try {
      await api.post('/students/appointments', formData)
      toast.success('Appointment booked successfully!')
      router.push('/dashboard/student')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment')
    } finally {
      setSubmitting(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading doctors...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book an Appointment</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor *
                </label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.userId?.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptoms/Concerns
                </label>
                <textarea
                  rows="4"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="Describe your symptoms or concerns (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? 'Booking...' : 'Book Appointment'}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Back
              </button>
            </form>
          </div>

          {/* Available Doctors Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Doctors</h2>
            
            {doctors.length > 0 ? (
              doctors.map((doc) => (
                <div key={doc._id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Stethoscope className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Dr. {doc.userId?.name}</h3>
                      <p className="text-sm text-gray-600">{doc.specialization} Medicine</p>
                      
                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {doc.availableFrom} - {doc.availableTill}
                        </p>
                        <p>
                          <strong>Slot Duration:</strong> {doc.appointmentSlotDuration} minutes
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setFormData({ ...formData, doctorId: doc._id })
                          document.querySelector('select').value = doc._id
                        }}
                        className="mt-3 w-full bg-blue-100 text-blue-600 px-3 py-2 rounded font-medium text-sm hover:bg-blue-200 transition"
                      >
                        Select This Doctor
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">No available doctors at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}