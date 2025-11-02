<template>
  <nav class="flex justify-between">
    <div class="text-primary">
      <img width="72" height="28" :src="`/images/own-logo.svg`" alt="OWN Logo" />
    </div>
    <div class="flex justify-end gap-2">
      <NotificationSignupModal />
      <ConnectWalletBtn />
    </div>
  </nav>
</template>
