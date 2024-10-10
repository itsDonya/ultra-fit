<template>
  <div
    class="relative max-h-screen h-screen bg-gradient-to-bl from-primary via-secondary to-light flex flex-col items-start justify-start gap-0 overflow-hidden">
    <app-header></app-header>

    <div class="w-full h-full flex items-start justify-start gap-0">
      <app-sidebar></app-sidebar>

      <main
        class="w-full h-full max-h-full p-6 bg-white rounded-tr-3xl overflow-auto">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
