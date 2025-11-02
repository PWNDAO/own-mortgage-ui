<template>
  <div>
      <div class="text-center pt-4 sm:pt-2 pb-6 md:pb-10">
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-beon">
              <span class="text-bordel-green">BORDEL</span> HACKERSPACE
          </h1>
          <h2 class="text-xl sm:text-2xl md:text-3xl mt-2 md:mt-4 font-beon">FIRST EVER PURE DEFI MORTGAGE</h2>
      </div>

      <div class="flex flex-col gap-4">
          <!-- Mobile: single column with ordered boxes (using contents so boxes are direct children) -->
          <!-- Desktop: two columns maintaining original layout -->
          <div class="contents lg:flex lg:flex-row lg:gap-4">
              <!-- Left column: TermsBox, DescriptionBox, LoanDefaultGraphBox -->
              <div class="contents lg:flex lg:flex-col lg:gap-4 lg:flex-1">
                  <TermsBox />
                  <DescriptionBox />
                  <LoanDefaultGraphBox />
              </div>
              <!-- Right column: ContributeBox, RewardsBox, SupportersBox -->
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
