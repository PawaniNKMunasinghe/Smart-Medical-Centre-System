'use client'

import { Heart, Users, Zap, Shield, Globe, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About MediTrack</h1>
          <p className="text-xl text-gray-600">University Student Health Management Platform</p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg mb-4">
              At MediTrack, our mission is to revolutionize student healthcare management by providing a comprehensive, 
              user-friendly platform that connects students with qualified healthcare professionals.
            </p>
            <p className="text-gray-600 text-lg mb-4">
              We believe that every student deserves access to quality healthcare services, and we're committed to making 
              health management seamless, transparent, and efficient.
            </p>
            <p className="text-gray-600 text-lg">
              Our platform bridges the gap between students, doctors, pharmacists, and administrators to ensure holistic 
              health and wellness support.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-12">
            <Heart className="h-24 w-24 text-blue-600 mx-auto" />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose MediTrack?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Role Support</h3>
              <p className="text-gray-600">
                Tailored interfaces for students, doctors, pharmacists, and administrators with role-specific features.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <Zap className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy to Use</h3>
              <p className="text-gray-600">
                Intuitive design that makes booking appointments, managing prescriptions, and tracking medicine simple.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Your health information is protected with industry-standard security and privacy measures.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <Globe className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accessible Anytime</h3>
              <p className="text-gray-600">
                Access your health records, book appointments, and manage medications from anywhere, anytime.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <Award className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Care</h3>
              <p className="text-gray-600">
                Connect with qualified doctors offering both Ayurvedic and English medicine specializations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <Heart className="h-12 w-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Health Tracking</h3>
              <p className="text-gray-600">
                Monitor your medicine consumption, view health information, and stay informed about wellness.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">1000+</p>
              <p className="text-blue-100">Students Served</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">50+</p>
              <p className="text-blue-100">Healthcare Professionals</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">5000+</p>
              <p className="text-blue-100">Appointments Handled</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">10000+</p>
              <p className="text-blue-100">Prescriptions Issued</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Dr. Raj Kumar', role: 'Chief Medical Officer', specialty: 'Healthcare Technology' },
              { name: 'Prof. Silva', role: 'Chief Technology Officer', specialty: 'Software Development' },
              { name: 'Dr. Maha', role: 'Head of Clinical Affairs', specialty: 'Medical Practice' },
              { name: 'Mr. John', role: 'Operations Manager', specialty: 'System Administration' },
            ].map((member, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
                <p className="text-gray-600 text-sm mt-2">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of students managing their health with MediTrack</p>
          <a href="/register">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Create Your Account Today
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}