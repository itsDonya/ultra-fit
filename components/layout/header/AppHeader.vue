<template>
  <header class="w-full px-4 lg:px-6 py-4 flex items-center justify-between">
    <div class="flex items-center justify-start gap-1">
      <app-header-burger></app-header-burger>
      <app-header-logo></app-header-logo>
    </div>

    <div class="flex items-center justify-end gap-2">
      <!-- login button -->
      <app-header-login></app-header-login>

      <!-- notifications -->
      <app-header-notifs></app-header-notifs>
    </div>
  </header>
</template>
