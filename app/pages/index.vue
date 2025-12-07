<template>
  <div>
      <div class="text-center pt-3 sm:pt-2 pb-4 md:pb-6">
          <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-beon">
              <span class="text-bordel-green">BORDEL</span> HACKERSPACE
          </h1>
          <h2 class="text-lg sm:text-xl md:text-2xl mt-1 md:mt-2 font-screener">FIRST EVER PURE DEFI MORTGAGE</h2>
      </div>

      <!-- Full-width Progress Hero Section - Order 0 for mobile -->
      <div class="bg-card border rounded-xl p-4 sm:p-6 mb-4 shadow-lg order-0">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                  <h3 class="text-xl sm:text-2xl font-heading mb-1">Funding Progress</h3>
                  <p class="text-gray-2 text-sm sm:text-base">Help fund this DeFi mortgage</p>
              </div>
              <div class="flex items-center gap-2 px-3 py-2 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <span class="text-yellow-400 text-sm font-semibold">⏱ Deadline:</span>
                  <DeadlineCountdown class="text-yellow-400 font-bold text-base sm:text-lg" />
              </div>
          </div>
          <ProgressBar />
      </div>

      <div class="flex flex-col gap-4">
          <!-- Mobile: single column with ordered boxes (using contents so boxes are direct children) -->
          <!-- Desktop: two columns - TermsBox & DescriptionBox left, ContributeBox right (primary CTA) -->
          <div class="contents lg:flex lg:flex-row lg:gap-4">
              <!-- Left column: TermsBox, DescriptionBox (SUPPORTING INFO) -->
              <div class="contents lg:flex lg:flex-col lg:gap-4 lg:flex-1">
                  <TermsBox />
                  <DescriptionBox />
              </div>
              <!-- Right column: ContributeBox, RewardsBox, SupportersBox (PRIMARY ACTION & INCENTIVES) -->
              <div class="contents lg:flex lg:flex-col lg:gap-4 lg:flex-1">
                  <ContributeBox />
                  <RewardsBox />
                  <SupportersBox />
              </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
</script>
