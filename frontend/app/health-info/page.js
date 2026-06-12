'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Heart, Lightbulb, FileText } from 'lucide-react'
import api from '@/utils/api'
import toast from 'react-hot-toast'

export default function HealthInfoPage() {
  const [activeTab, setActiveTab] = useState('news')
  const [news, setNews] = useState([])
  const [healthTips, setHealthTips] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const newsCategories = ['Local', 'International', 'University', 'Health', 'Children']
  const healthCategories = ['General', 'Fitness', 'Nutrition', 'Mental Health', 'Sleep', 'Children']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [newsRes, tipsRes] = await Promise.all([
        api.get('/news'),
        api.get('/news/health-tips'),
      ])
      setNews(newsRes.data)
      setHealthTips(tipsRes.data)
    } catch (error) {
      toast.error('Failed to load data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(n => n.category === selectedCategory)

  const filteredTips = selectedCategory === 'all' 
    ? healthTips 
    : healthTips.filter(t => t.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Information Hub</h1>
          <p className="text-xl text-gray-600">Stay informed about your health and wellness</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'news'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="inline-block h-5 w-5 mr-2" />
            News & Updates
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'tips'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Lightbulb className="inline-block h-5 w-5 mr-2" />
            Health Tips
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
            }`}
          >
            All
          </button>
          {(activeTab === 'news' ? newsCategories : healthCategories).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'news' ? filteredNews : filteredTips).length > 0 ? (
              (activeTab === 'news' ? filteredNews : filteredTips).map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                      {activeTab === 'news' && (
                        <span className="text-xs text-gray-500">
                          {item.views} views
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Read More →
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No content available in this category</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}