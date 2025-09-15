<template>
    <Line :data="data" :options="options" />
</template>
  
<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { GRACE_MONTHS, LOAN_DURATION_IN_MONTHS, TOTAL_AMOUNT_TO_REPAY } from '~/constants/proposalConstants'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale)

// Build f(t) (limit line)
const labels = Array.from({ length: LOAN_DURATION_IN_MONTHS + 1 }, (_, i) => `${i}m`)

const limitData = labels.map((_, month) => {
  if (month <= GRACE_MONTHS) {
    return TOTAL_AMOUNT_TO_REPAY // flat during grace
  } else {
    const remainingMonths = LOAN_DURATION_IN_MONTHS - GRACE_MONTHS
    const progress = (month - GRACE_MONTHS) / remainingMonths
    return TOTAL_AMOUNT_TO_REPAY * (1 - progress)
  }
})

const data = {
  labels,
  datasets: [
    {
      label: 'Max Debt At Time',
      data: limitData,
      borderColor: 'rgb(0, 255, 224)',
      borderDash: [5, 5],
      borderWidth: 2,
      fill: false,
      tension: 0,      // straight line
      pointRadius: 0,  // <-- disables points
      hoverRadius: 5,  // radius when hovering
    }
  ]
}

const options = {
  responsive: true,
  plugins: {
    tooltip: {
      mode: 'nearest',     // tooltip triggers on nearest point
      intersect: false     // allow tooltip even if cursor is not exactly on the line
    }
  },
  interaction: {
    mode: 'nearest',      // same as tooltip
    intersect: false,     // important to trigger on nearby
    axis: 'x'             // only consider horizontal distance
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Debt (USDC)'
      },
      beginAtZero: true
    },
    x: {
      title: {
        display: true,
        text: 'Months'
      }
    }
  }
}
</script>
