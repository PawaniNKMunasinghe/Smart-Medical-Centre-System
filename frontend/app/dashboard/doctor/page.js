'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function DoctorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [students, setStudents] = useState([])
  const [medicines, setMedicines] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentDetails, setStudentDetails] = useState(null)
  const [showMedicineForm, setShowMedicineForm] = useState(false)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const [medicineForm, setMedicineForm] = useState({
    medicineId: '',
    medicineName: '',
    quantity: 1,
    dosage: ''
  })

  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    symptoms: '',
    diagnosis: '',
    prescribedMedicines: []
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'doctor') {
      router.push(`/dashboard/${parsedUser.role}`)
      return
    }
    
    setUser(parsedUser)
    fetchData(token)
  }, [])

  const fetchData = async (token) => {
    try {
      const [studentsRes, medicinesRes] = await Promise.all([
        axios.get(`${API_URL}/doctor/students`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/doctor/medicines`, { headers: { Authorization: `Bearer ${token}` } })
      ])
      setStudents(studentsRes.data)
      setMedicines(medicinesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentDetails = async (studentId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${API_URL}/doctor/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStudentDetails(response.data)
      setSelectedStudent(studentId)
    } catch (error) {
      console.error('Error fetching student details:', error)
    }
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      await axios.post(`${API_URL}/doctor/add-medicine`, {
        studentId: selectedStudent,
        ...medicineForm
      }, { headers: { Authorization: `Bearer ${token}` } })
      
      alert('Medicine added successfully!')
      setShowMedicineForm(false)
      setMedicineForm({ medicineId: '', medicineName: '', quantity: 1, dosage: '' })
      fetchStudentDetails(selectedStudent)
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add medicine')
    }
  }

  const handleCreateAppointment = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      await axios.post(`${API_URL}/doctor/appointment`, {
        studentId: selectedStudent,
        ...appointmentForm
      }, { headers: { Authorization: `Bearer ${token}` } })
      
      alert('Appointment record created successfully!')
      setShowAppointmentForm(false)
      setAppointmentForm({ date: '', time: '', symptoms: '', diagnosis: '', prescribedMedicines: [] })
      fetchStudentDetails(selectedStudent)
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create appointment')
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
            <p className="text-sm text-blue-100">Welcome, Dr. {user?.name}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Students List</h2>
            <div className="space-y-2">
              {students.map((student) => (
                <button
                  key={student._id}
                  onClick={() => fetchStudentDetails(student._id)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedStudent === student._id
                      ? 'bg-blue-100 border-blue-500 border'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <p className="font-medium">{student.firstName} {student.lastName}</p>
                  <p className="text-sm text-gray-500">ID: {student.idNumber}</p>
                </button>
              ))}
              {students.length === 0 && (
                <p className="text-gray-500 text-center py-4">No students found</p>
              )}
            </div>
          </div>

          {/* Student Details */}
          <div className="lg:col-span-2 space-y-6">
            {studentDetails ? (
              <>
                {/* Student Info Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {studentDetails.student.firstName} {studentDetails.student.lastName}
                      </h2>
                      <p className="text-gray-500">ID: {studentDetails.student.idNumber}</p>
                      <p className="text-gray-500">Email: {studentDetails.student.email}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => setShowMedicineForm(!showMedicineForm)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        + Add Medicine
                      </button>
                      <button
                        onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        + Add Appointment
                      </button>
                    </div>
                  </div>

                  {/* Add Medicine Form */}
                  {showMedicineForm && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-3">Add Medicine</h3>
                      <form onSubmit={handleAddMedicine} className="space-y-3">
                        <select
                          className="w-full p-2 border rounded"
                          value={medicineForm.medicineId}
                          onChange={(e) => {
                            const med = medicines.find(m => m._id === e.target.value)
                            setMedicineForm({
                              ...medicineForm,
                              medicineId: e.target.value,
                              medicineName: med?.name || ''
                            })
                          }}
                          required
                        >
                          <option value="">Select Medicine</option>
                          {medicines.map((med) => (
                            <option key={med._id} value={med._id}>
                              {med.name} (Stock: {med.stock})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Quantity"
                          className="w-full p-2 border rounded"
                          value={medicineForm.quantity}
                          onChange={(e) => setMedicineForm({ ...medicineForm, quantity: parseInt(e.target.value) })}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g., 2 times daily)"
                          className="w-full p-2 border rounded"
                          value={medicineForm.dosage}
                          onChange={(e) => setMedicineForm({ ...medicineForm, dosage: e.target.value })}
                          required
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                          Submit Medicine
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Add Appointment Form */}
                  {showAppointmentForm && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-3">Add Appointment Record</h3>
                      <form onSubmit={handleCreateAppointment} className="space-y-3">
                        <input
                          type="date"
                          className="w-full p-2 border rounded"
                          value={appointmentForm.date}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                          required
                        />
                        <input
                          type="time"
                          className="w-full p-2 border rounded"
                          value={appointmentForm.time}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                          required
                        />
                        <textarea
                          placeholder="Symptoms"
                          className="w-full p-2 border rounded"
                          rows="2"
                          value={appointmentForm.symptoms}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, symptoms: e.target.value })}
                          required
                        />
                        <textarea
                          placeholder="Diagnosis"
                          className="w-full p-2 border rounded"
                          rows="2"
                          value={appointmentForm.diagnosis}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, diagnosis: e.target.value })}
                          required
                        />
                        <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
                          Save Appointment Record
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Previous Medicines */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Previous Medicines</h3>
                  {studentDetails.medicines.length > 0 ? (
                    <div className="space-y-3">
                      {studentDetails.medicines.map((med) => (
                        <div key={med._id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                          <p className="font-medium">{med.medicineName}</p>
                          <p className="text-sm text-gray-600">Quantity: {med.quantity} | Dosage: {med.dosage}</p>
                          <p className="text-sm text-gray-500">Issued: {new Date(med.issuedDate).toLocaleDateString()}</p>
                          <p className="text-sm">
                            Status: 
                            <span className={`ml-1 font-medium ${
                              med.status === 'consumed' ? 'text-green-600' : 
                              med.status === 'issued' ? 'text-blue-600' : 'text-yellow-600'
                            }`}>
                              {med.status}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No previous medicines</p>
                  )}
                </div>

                {/* Previous Appointments */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Previous Appointments</h3>
                  {studentDetails.appointments.length > 0 ? (
                    <div className="space-y-3">
                      {studentDetails.appointments.map((apt) => (
                        <div key={apt._id} className="border-l-4 border-purple-500 pl-4 py-2 bg-gray-50 rounded">
                          <p className="font-medium">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                          <p className="text-sm text-gray-600">Symptoms: {apt.symptoms}</p>
                          <p className="text-sm text-gray-600">Diagnosis: {apt.diagnosis}</p>
                          <p className="text-sm text-gray-500">Status: {apt.status}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No previous appointments</p>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">Select a student to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}