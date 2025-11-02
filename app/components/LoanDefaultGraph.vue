<template>
    <div>
        <div class="mb-4">
            <p class="mb-2 text-sm sm:text-base">
                This graph illustrates the loan repayment dynamics and default risk over time.
            </p>
            <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm">
                <li>
                    <span class="font-semibold">Liquidation Threshold</span> (dashed blue line): The maximum debt allowed at any point in time. If the debt exceeds this line, the loan may be liquidated.
                </li>
                <li>
                    <span class="font-semibold">Minimal Repayment Path</span> (solid green line): Shows the cumulative amount repaid over time if the borrower makes minimal required repayments to avoid default. This line starts at 0 and increases as payments are made.
                </li>
            </ul>
            <p class="mt-2 text-xs italic text-gray-2">
                During the grace period (first {{ POSTPONEMENT_IN_MONTHS }} months), no repayments are required. After this period, repayments must be made to keep the debt below the liquidation threshold.
            </p>
        </div>
        <Line :data="data" :options="options" />
    </div>
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
import { POSTPONEMENT_IN_MONTHS, LOAN_DURATION_IN_MONTHS, TOTAL_AMOUNT_TO_REPAY, CREDIT_NAME } from '~/constants/proposalConstants'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale)

// Build f(t) (limit line)
const labels = Array.from({ length: LOAN_DURATION_IN_MONTHS + 1 }, (_, i) => `${i}m`)

const limitData = labels.map((_, month) => {
  if (month <= POSTPONEMENT_IN_MONTHS) {
    return TOTAL_AMOUNT_TO_REPAY // flat during grace
  } else {
    const remainingMonths = LOAN_DURATION_IN_MONTHS - POSTPONEMENT_IN_MONTHS
    const progress = (month - POSTPONEMENT_IN_MONTHS) / remainingMonths
    return TOTAL_AMOUNT_TO_REPAY * (1 - progress)
  }
})

// Build minimal repayment line (cumulative repayments - starts at 0)
const repaymentData = labels.map((_, month) => {
  if (month <= POSTPONEMENT_IN_MONTHS) {
    return 0 // no repayments during grace period
  } else {
    const remainingMonths = LOAN_DURATION_IN_MONTHS - POSTPONEMENT_IN_MONTHS
    const monthsIntoRepayment = month - POSTPONEMENT_IN_MONTHS
    const monthlyPayment = TOTAL_AMOUNT_TO_REPAY / remainingMonths
    return monthlyPayment * monthsIntoRepayment // cumulative amount repaid
  }
})

const data = {
  labels,
  datasets: [
    {
      label: 'Liquidation Threshold',
      data: limitData,
      borderColor: '#0e9cff',
      borderDash: [5, 5],
      borderWidth: 2,
      fill: false,
      tension: 0,      // straight line
      pointRadius: 0,  // <-- disables points
      hoverRadius: 5,  // radius when hovering
    },
    {
      label: 'Minimal Repayment Path',
      data: repaymentData,
      borderColor: '#10b981',
      borderDash: [],
      borderWidth: 2,
      fill: false,
      tension: 0,      // straight line segments
      pointRadius: 0,  // <-- disables points
      hoverRadius: 5,  // radius when hovering
    }
  ]
}

const options = {
  responsive: true,
  plugins: {
    tooltip: {
      mode: 'nearest' as const,     // tooltip triggers on nearest point
      intersect: false     // allow tooltip even if cursor is not exactly on the line
    }
  },
  interaction: {
    mode: 'nearest' as const,      // same as tooltip
    intersect: false,     // important to trigger on nearby
    axis: 'x' as const             // only consider horizontal distance
  },
  scales: {
    y: {
      title: {
        display: true,
        text: `Amount (${CREDIT_NAME})`
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
