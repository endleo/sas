<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<style>
  .material-symbols-outlined {
    font-variation-settings:
      "FILL" 0,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
  }
  .glass-panel {
    background: rgba(23, 31, 51, 0.6);
    backdrop-filter: blur(20px);
  }
  .gold-gradient {
    background: linear-gradient(45deg, #e9c349, #1f1700);
  }
</style>


<main
  class="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20 pb-12"
>
  <div class="w-full max-w-[480px]">
    <!-- Auth Container -->
    <div
      class="glass-panel p-8 md:p-12 rounded-xl shadow-2xl border border-white/5 relative overflow-hidden"
    >
      <!-- Accent Glow -->
      <div
        class="absolute -top-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-[80px]"
      ></div>
      <div
        class="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]"
      ></div>
      <!-- Header -->
      <div class="mb-10 relative">
        <h1
          class="font-headline text-4xl font-extrabold tracking-tighter text-on-surface mb-2"
        >
          Welcome Back
        </h1>
        <p class="text-on-surface-variant text-sm font-medium">
          Please enter your credentials to access the lounge.
        </p>
      </div>
      <!-- Form -->
      <form method="post" action="?/signInEmail" use:enhance class="space-y-6">
        <div>
          <label
            class="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2 px-1"
            for="email">Email Address</label
          >
          <div class="relative group">
            <span
              class="icon-[ic--outline-email] material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
            ></span>
            <input
              class="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/30 transition-all"
              id="email"
              placeholder="name@domain.com"
              type="email"
              name="email"
            />
          </div>
        </div>
        <div>
          <div class="flex justify-between items-center mb-2 px-1">
            <label
              class="block text-xs font-label text-on-surface-variant uppercase tracking-widest"
              for="password">Password</label
            >
            <a
              class="text-[10px] font-label text-secondary uppercase tracking-widest hover:text-secondary-fixed transition-colors"
              href="">Forgot Password?</a
            >
          </div>
          <div class="relative group">
            <span
              class="icon-[ic--outline-lock] absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
            ></span>
            <input
              class="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/30 transition-all"
              id="password"
              placeholder="••••••••"
              type="password"
              name="password"
            />
            <span
              class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer hover:text-on-surface transition-colors"
              data-icon="visibility"
            ></span>
          </div>
        </div>
        <div class="pt-4">
          <button
            class="gold-gradient w-full py-4 rounded-lg text-on-primary font-bold font-headline uppercase tracking-widest text-sm shadow-[0_12px_24px_-8px_rgba(233,195,73,0.3)] hover:shadow-[0_16px_32px_-8px_rgba(233,195,73,0.4)] active:scale-[0.98] transition-all"
            type="submit"
          >
            Enter the Lounge
          </button>
        </div>
      </form>
      <p class="text-red-500 text-center">{form?.message ?? ''}</p>
      <!-- Footer Link -->
      <p class="mt-10 text-center text-sm text-on-surface-variant">
        New to the club?
        <a
          class="text-secondary font-bold hover:text-secondary-fixed transition-colors underline-offset-4 decoration-secondary/30 hover:underline"
          href="/signup">Become a Member</a
        >
      </p>
    </div>
  </div>
</main>
