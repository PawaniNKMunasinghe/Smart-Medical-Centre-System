'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [medicines, setMedicines] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'student') {
      router.push(`/dashboard/${parsedUser.role}`)
      return
    }
    
    setUser(parsedUser)
    fetchData(token)
  }, [])

  const fetchData = async (token) => {
    try {
      const [medicinesRes, appointmentsRes] = await Promise.all([
        axios.get(`${API_URL}/student/medicines`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/student/appointments`, { headers: { Authorization: `Bearer ${token}` } })
      ])
      setMedicines(medicinesRes.data)
      setAppointments(appointmentsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const consumedMedicines = medicines.filter(m => m.status === 'consumed')
  const issuedMedicines = medicines.filter(m => m.status === 'issued')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <p className="text-sm text-blue-100">Welcome, {user?.name}</p>
            <p className="text-xs text-blue-200">ID: {user?.idNumber}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Total Medicines</h3>
            <p className="text-3xl font-bold text-gray-800">{medicines.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Issued Medicines</h3>
            <p className="text-3xl font-bold text-blue-600">{issuedMedicines.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Consumed Medicines</h3>
            <p className="text-3xl font-bold text-green-600">{consumedMedicines.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Doctor Visits</h3>
            <p className="text-3xl font-bold text-purple-600">{appointments.length}</p>
          </div>
        </div>

        {/* Medicines Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">My Medicines</h2>
          </div>
          <div className="p-6">
            {medicines.length > 0 ? (
              <div className="space-y-4">
                {medicines.map((med) => (
                  <div key={med._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{med.medicineName}</h3>
                        <p className="text-gray-600">Quantity: {med.quantity}</p>
                        <p className="text-gray-600">Dosage: {med.dosage}</p>
                        <p className="text-gray-500 text-sm">Prescribed by: {med.prescribedBy}</p>
                        <p className="text-gray-500 text-sm">Issued Date: {new Date(med.issuedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          med.status === 'consumed' ? 'bg-green-100 text-green-800' :
                          med.status === 'issued' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {med.status === 'consumed' ? '✓ Consumed' : med.status === 'issued' ? '📦 Issued' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No medicines assigned yet</p>
            )}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Doctor Appointments</h2>
          </div>
          <div className="p-6">
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">Dr. {apt.doctorName}</h3>
                        <p className="text-gray-600">Date: {new Date(apt.date).toLocaleDateString()}</p>
                        <p className="text-gray-600">Time: {apt.time}</p>
                        <p className="text-gray-600">Symptoms: {apt.symptoms}</p>
                        <p className="text-gray-600">Diagnosis: {apt.diagnosis}</p>
                        {apt.prescribedMedicines?.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">Prescribed Medicines:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {apt.prescribedMedicines.map((med, idx) => (
                                <li key={idx}>{med.medicineName} - {med.dosage}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No appointments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}