<template>
  <article
    class="relative w-full h-screen max-h-screen bg-[url('/img/auth-bg.jpg')] bg-[-240px_40px] sm:bg-center bg-cover flex flex-col items-center !justify-end sm:!justify-center">
    <!-- overlay -->
    <span
      class="absolute top-0 left-0 w-full h-full bg-slate-950/80 z-0"></span>

    <!-- form -->
    <div
      class="w-full sm:w-[480px] p-5 sm:p-8 bg-white/10 backdrop-blur-md flex items-center justify-center rounded-t-3xl sm:rounded-3xl shadow-2xl z-10">
      <slot></slot>
    </div>
  </article>
</template>
