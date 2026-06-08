'use client'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import api from '@/utils/api'
import { Search, Stethoscope, Clock, MapPin, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SearchDoctorsPage() {
  const { user, token } = useContext(AuthContext)
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [specialization, setSpecialization] = useState('all')
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const fetchDoctors = async () => {
      try {
        // Fetch available doctors
        const response = await api.get('/appointments/available-doctors')
        // Also fetch doctors by specialization if available
        setDoctors(response.data)
        setFilteredDoctors(response.data)
      } catch (error) {
        toast.error('Failed to load doctors')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [token, router])

  const handleSearch = (e) => {
    e.preventDefault()
    
    let filtered = doctors

    // Filter by specialization
    if (specialization !== 'all') {
      filtered = filtered.filter(d => d.specialization === specialization)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(d =>
        d.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredDoctors(filtered)
    setSearched(true)
  }

  const handleReset = () => {
    setSearchTerm('')
    setSpecialization('all')
    setFilteredDoctors(doctors)
    setSearched(false)
  }

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <Stethoscope className="h-8 w-8 text-blue-600" />
          Find a Doctor
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Name Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Specializations</option>
                <option value="Ayurvedic">Ayurvedic</option>
                <option value="English">English Medicine</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 items-end">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        {filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Dr. {doctor.userId?.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{doctor.specialization}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">Available</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4 pb-4 border-b">
                    <p>📧 {doctor.userId?.email}</p>
                    {doctor.userId?.phone && <p>📱 {doctor.userId.phone}</p>}
                  </div>

                  {/* Availability */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>
                        <strong>Hours:</strong> {doctor.availableFrom} - {doctor.availableTill}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span>
                        <strong>Slot:</strong> {doctor.appointmentSlotDuration} minutes
                      </span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {doctor.experience && (
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Experience:</strong> {doctor.experience} years
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push('/dashboard/student/book-appointment')}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                    >
                      Book Now
                    </button>
                    <button
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searched ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No doctors found</p>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
            <button
              onClick={handleReset}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">Use the search form above to find doctors</p>
          </div>
        )}
      </div>
    </div>
  )
}