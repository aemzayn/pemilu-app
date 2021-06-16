import React from 'react'
import { Pie } from 'react-chartjs-2'
import { candidateColors } from '../../utils/lib'

const PieChart = ({ labels, data, title }) => {
  return (
    <Pie
      data={{
        labels,
        datasets: [{ data, backgroundColor: candidateColors, label: title }],
      }}
    />
  )
}

export default PieChart
