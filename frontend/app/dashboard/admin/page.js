'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [lowStock, setLowStock] = useState([])
  const [news, setNews] = useState([])
  const [monthlyReport, setMonthlyReport] = useState(null)
  const [showAddNews, setShowAddNews] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)

  const [newsForm, setNewsForm] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      router.push(`/dashboard/${parsedUser.role}`)
      return
    }
    
    setUser(parsedUser)
    fetchData(token)
  }, [])

  const fetchData = async (token) => {
    try {
      const [statsRes, lowStockRes, newsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/low-stock`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/news`, { headers: { Authorization: `Bearer ${token}` } })
      ])
      setStats(statsRes.data)
      setLowStock(lowStockRes.data)
      setNews(newsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMonthlyReport = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${API_URL}/admin/monthly-report?month=${selectedMonth}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMonthlyReport(response.data)
    } catch (error) {
      console.error('Error fetching report:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMonthlyReport()
    }
  }, [selectedMonth])

  const handleAddNews = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      await axios.post(`${API_URL}/admin/news`, newsForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('News added successfully!')
      setShowAddNews(false)
      setNewsForm({ title: '', content: '' })
      fetchData(token)
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add news')
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
      <header className="bg-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-purple-100">Welcome, {user?.name}</p>
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
            <h3 className="text-gray-500 text-sm">Total Students</h3>
            <p className="text-3xl font-bold text-gray-800">{stats?.totalStudents || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Total Medicines</h3>
            <p className="text-3xl font-bold text-gray-800">{stats?.totalMedicines || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Low Stock Items</h3>
            <p className="text-3xl font-bold text-red-600">{stats?.lowStockMedicines || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Students Took Medicine</h3>
            <p className="text-3xl font-bold text-green-600">{stats?.studentsTookMedicine || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Low Stock Alert */}
            {lowStock.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-semibold text-red-800">⚠️ Critical Low Stock Alert</h3>
                <ul className="mt-2 space-y-1">
                  {lowStock.map(med => (
                    <li key={med._id} className="text-sm text-red-700">
                      {med.name} - Only {med.stock} {med.unit}(s) remaining
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Monthly Report */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Report</h2>
              <div className="mb-4">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
              {monthlyReport ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-blue-600">Students Treated</p>
                      <p className="text-2xl font-bold text-blue-800">{monthlyReport.totalStudentsTreated}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-green-600">Medicines Used</p>
                      <p className="text-2xl font-bold text-green-800">{monthlyReport.totalMedicinesUsed}</p>
                    </div>
                  </div>
                  {monthlyReport.topIssuedMedicines?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Top Issued Medicines</h3>
                      <div className="space-y-2">
                        {monthlyReport.topIssuedMedicines.map((med, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span>{med.medicineName}</span>
                            <span className="font-bold">{med.quantityUsed} units</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No data for selected month</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* News Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Announcements</h2>
                <button
                  onClick={() => setShowAddNews(!showAddNews)}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  + Add News
                </button>
              </div>

              {showAddNews && (
                <form onSubmit={handleAddNews} className="mb-6 p-4 bg-gray-50 rounded">
                  <input
                    type="text"
                    placeholder="News Title"
                    className="w-full p-2 border rounded mb-3"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="News Content"
                    className="w-full p-2 border rounded mb-3"
                    rows="3"
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddNews(false)}
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {news.length > 0 ? (
                  news.map((item) => (
                    <div key={item._id} className="border-l-4 border-purple-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(item.createdAt).toLocaleDateString()} by {item.author}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No announcements yet</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.location.href = '/dashboard/pharmacist'}
                  className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
                >
                  Manage Pharmacy
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard/doctor'}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                >
                  View Doctors
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}