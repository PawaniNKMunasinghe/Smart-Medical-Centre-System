'use client'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import api from '@/utils/api'
import { Pill, FileText, Calendar, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PrescriptionsPage() {
  const { user, token } = useContext(AuthContext)
  const router = useRouter()
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const fetchPrescriptions = async () => {
      try {
        const response = await api.get('/students/prescriptions')
        setPrescriptions(response.data)
      } catch (error) {
        toast.error('Failed to load prescriptions')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrescriptions()
  }, [token, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading prescriptions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Pill className="h-8 w-8 text-green-600" />
            My Prescriptions
          </h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Back
          </button>
        </div>

        {prescriptions.length > 0 ? (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                {/* Header */}
                <div
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => setExpandedId(expandedId === prescription._id ? null : prescription._id)}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dr. {prescription.doctorId?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{prescription.diagnosis}</p>
                    <div className="flex gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(prescription.issuedDate).toLocaleDateString()}
                      </span>
                      <span className={`px-3 py-1 rounded-full font-medium ${
                        prescription.isActive 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400 text-2xl">
                    {expandedId === prescription._id ? '−' : '+'}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === prescription._id && (
                  <div className="border-t px-6 py-4 bg-gray-50">
                    {/* Medicines */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Pill className="h-5 w-5 text-green-600" />
                        Medicines
                      </h4>
                      <div className="space-y-3">
                        {prescription.medicines.map((medicine, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border border-gray-200">
                            <h5 className="font-semibold text-gray-900">
                              {medicine.medicineId?.name}
                            </h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 text-sm text-gray-600">
                              <div>
                                <p className="text-xs text-gray-500">Dosage</p>
                                <p>{medicine.dosage}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Frequency</p>
                                <p>{medicine.frequency}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Duration</p>
                                <p>{medicine.duration}</p>
                              </div>
                              {medicine.medicineId?.sideEffects?.length > 0 && (
                                <button
                                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                  onClick={() => alert(`Side Effects: ${medicine.medicineId.sideEffects.join(', ')}`)}
                                >
                                  View Side Effects
                                </button>
                              )}
                            </div>
                            {medicine.notes && (
                              <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {medicine.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {prescription.notes && (
                      <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Doctor's Notes</h4>
                        <p className="text-blue-800">{prescription.notes}</p>
                      </div>
                    )}

                    {/* Expiry Date */}
                    {prescription.expiryDate && (
                      <div className="text-sm text-gray-600">
                        <strong>Expires:</strong> {new Date(prescription.expiryDate).toLocaleDateString()}
                      </div>
                    )}

                    {/* Track Medicine Button */}
                    {prescription.isActive && (
                      <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium">
                        Track Medicine Consumption
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No prescriptions yet</p>
            <p className="text-gray-500 mb-6">Book an appointment to get a prescription from a doctor</p>
            <button
              onClick={() => router.push('/dashboard/student/book-appointment')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Book Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  )
}