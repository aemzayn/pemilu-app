import React, { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { randomArrayColors } from '../../utils/lib'

const BarChart = ({ title, labels, data }) => {
  const backgroundColor = useMemo(() => randomArrayColors(data.length), [
    data.length,
  ])
  return (
    <Bar
      data={{
        labels,
        datasets: [{ data, label: title, backgroundColor }],
      }}
    />
  )
}

export default BarChart
