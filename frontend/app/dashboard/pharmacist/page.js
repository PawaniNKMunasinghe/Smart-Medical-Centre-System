'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function PharmacistDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [medicines, setMedicines] = useState([])
  const [pendingIssues, setPendingIssues] = useState([])
  const [showAddMedicine, setShowAddMedicine] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newMedicine, setNewMedicine] = useState({
    name: '',
    category: '',
    stock: 0,
    unit: 'tablet',
    expiryDate: '',
    price: '',
    description: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'pharmacist') {
      router.push(`/dashboard/${parsedUser.role}`)
      return
    }
    
    setUser(parsedUser)
    fetchData(token)
  }, [])

  const fetchData = async (token) => {
    try {
      const [medicinesRes, pendingRes] = await Promise.all([
        axios.get(`${API_URL}/pharmacist/medicines`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/doctor/medicines`, { headers: { Authorization: `Bearer ${token}` } })
      ])
      setMedicines(medicinesRes.data)
      // For pending issues - medicines that need to be issued
      setPendingIssues(medicinesRes.data.filter(m => m.stock < 20))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStock = async (medicineId, newStock) => {
    const token = localStorage.getItem('token')
    try {
      await axios.put(`${API_URL}/pharmacist/medicine/${medicineId}/stock`, 
        { stock: newStock },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Stock updated successfully!')
      fetchData(token)
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update stock')
    }
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      await axios.post(`${API_URL}/pharmacist/medicine`, newMedicine, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Medicine added successfully!')
      setShowAddMedicine(false)
      setNewMedicine({ name: '', category: '', stock: 0, unit: 'tablet', expiryDate: '', price: '', description: '' })
      fetchData(token)
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add medicine')
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

  const lowStockMedicines = medicines.filter(m => m.stock < 50)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
            <p className="text-sm text-green-100">Welcome, {user?.name}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Total Medicines</h3>
            <p className="text-3xl font-bold text-gray-800">{medicines.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Low Stock Items</h3>
            <p className="text-3xl font-bold text-red-600">{lowStockMedicines.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Pending Issues</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingIssues.length}</p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockMedicines.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8 rounded">
            <h3 className="font-semibold text-yellow-800">⚠️ Low Stock Alert</h3>
            <p className="text-sm text-yellow-700">Following medicines are running low:</p>
            <ul className="mt-2 space-y-1">
              {lowStockMedicines.map(med => (
                <li key={med._id} className="text-sm">
                  {med.name} - Only {med.stock} {med.unit}(s) left
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Medicine Inventory</h2>
          <button
            onClick={() => setShowAddMedicine(!showAddMedicine)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Add New Medicine
          </button>
        </div>

        {/* Add Medicine Form */}
        {showAddMedicine && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Medicine</h3>
            <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Medicine Name"
                className="p-2 border rounded"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Category"
                className="p-2 border rounded"
                value={newMedicine.category}
                onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Initial Stock"
                className="p-2 border rounded"
                value={newMedicine.stock}
                onChange={(e) => setNewMedicine({ ...newMedicine, stock: parseInt(e.target.value) })}
                required
              />
              <select
                className="p-2 border rounded"
                value={newMedicine.unit}
                onChange={(e) => setNewMedicine({ ...newMedicine, unit: e.target.value })}
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
              </select>
              <input
                type="date"
                placeholder="Expiry Date"
                className="p-2 border rounded"
                value={newMedicine.expiryDate}
                onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price (LKR)"
                className="p-2 border rounded"
                value={newMedicine.price}
                onChange={(e) => setNewMedicine({ ...newMedicine, price: parseFloat(e.target.value) })}
              />
              <textarea
                placeholder="Description"
                className="p-2 border rounded md:col-span-2"
                rows="2"
                value={newMedicine.description}
                onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
              />
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Add Medicine
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMedicine(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Medicines Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Medicine Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Unit</th>
                <th className="p-3 text-left">Expiry Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med._id} className="border-t">
                  <td className="p-3 font-medium">{med.name}</td>
                  <td className="p-3">{med.category}</td>
                  <td className="p-3">
                    <span className={med.stock < 50 ? 'text-red-600 font-bold' : ''}>
                      {med.stock}
                    </span>
                  </td>
                  <td className="p-3">{med.unit}</td>
                  <td className="p-3">{med.expiryDate ? new Date(med.expiryDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        const newStock = prompt('Enter new stock quantity:', med.stock)
                        if (newStock !== null) handleUpdateStock(med._id, parseInt(newStock))
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {medicines.length === 0 && (
            <p className="text-center py-8 text-gray-500">No medicines in inventory</p>
          )}
        </div>
      </div>
    </div>
  )
}