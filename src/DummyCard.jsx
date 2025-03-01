import React from 'react'

const DummyCard = () => {
  return (
    <div className="w-96 bg-gray-500 rounded-lg p-4 shadow-md">
      <p className="text-white text-lg font-semibold text-center italic">
        Won By : {localStorage.getItem('email')}
      </p>
    </div>
  )
}

export default DummyCard
