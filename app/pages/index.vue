<template>
  <div>
      <div class="text-center pt-2 pb-10">
          <div class="flex justify-end mb-4">
            <ModalsShareModal />
          </div>
          <h1 class="text-5xl font-beon">
              <span class="text-bordel-green">BORDEL</span> HACKERSPACE
          </h1>
          <h2 class="text-3xl mt-4 font-beon">FIRST EVER PURE DEFI MORTGAGE</h2>
      </div>

      <div class="flex flex-col gap-4">
          <div class="grid gap-4 grid-cols-2">
              <div class="flex flex-col gap-4 min-w-0">
                  <BoxesTermsBox />
                  <BoxesDescriptionBox />
                  <div class="border p-4">
                    <h3 class="text-xl font-heading mb-4">Loan Default</h3>
                    <hr class="mb-4"/>
                    <LoanDefaultGraph />
                  </div>
              </div>
              <div class="flex flex-col gap-4 min-w-0">
                  <BoxesYourContributionBox />
                  <BoxesContributeBox />
                  <BoxesSupportersBox />
                  <BoxesRewardsBox />
              </div>
          </div>
      </div>
  </div>
</template>
