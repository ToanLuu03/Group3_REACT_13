import React from 'react'
import FilterSection from './Filter/FilterSection'
import GPAChart from './Chart/GPAChart '
import GPATable from './Table/GPATable'

const GPA = () => {
  return (
    <div className="min-h-screen p-6">
    <div className="bg-white rounded p-4">
      <FilterSection />
    </div>
    <div className="bg-white rounded p-4 mt-6">
      <GPAChart />
    </div>
    <div className="bg-white rounded p-4 mt-6">
      <GPATable />
    </div>
  </div>
  )
}

export default GPA