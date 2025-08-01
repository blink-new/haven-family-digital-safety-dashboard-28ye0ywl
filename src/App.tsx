import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-6xl mb-4">🛡️</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">HAVEN</h1>
        <p className="text-gray-600 mb-4">Family Digital Safety Dashboard</p>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">85</div>
          <div className="text-sm text-gray-600">Your Family's Safety Score</div>
        </div>
      </div>
    </div>
  )
}

export default App