<template>
  <div>
      <div class="text-center pt-2 pb-10">
          <div class="flex justify-end gap-2 mb-6">
            <NotificationSignupModal />
            <ShareModal />
          </div>
          <h1 class="text-5xl font-beon">
              <span class="text-bordel-green">BORDEL</span> HACKERSPACE
          </h1>
          <h2 class="text-3xl mt-4 font-beon">FIRST EVER PURE DEFI MORTGAGE</h2>
      </div>

      <div class="flex flex-col gap-4">
          <div class="grid gap-4 grid-cols-2">
              <div class="flex flex-col gap-4 min-w-0">
                  <TermsBox />
                  <DescriptionBox />
                  <LoanDefaultGraphBox />
              </div>
              <div class="flex flex-col gap-4 min-w-0">
                  <ContributeBox />
                  <SupportersBox />
                  <RewardsBox />
              </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import NotificationSignupModal from '~/components/modals/NotificationSignupModal.vue'
</script>
