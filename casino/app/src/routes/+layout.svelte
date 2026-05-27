<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!--nav class="bg-gray-800 text-white p-4">
  <div class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-xl font-bold">Casino</a>
    <div>
      {#if data.user}
        <a
          href="/shop"
          class="px-3 py-2 rounded-md hover:bg-gray-700 transition">Shop</a
        >
        <a
          href="/profile"
          class="px-3 py-2 rounded-md hover:bg-gray-700 transition">Profile</a
        >
        <span class="px-3 py-2">Hello, asdf !</span>
      {:else}
        <a
          href="/login"
          class="px-3 py-2 rounded-md hover:bg-gray-700 transition">Login</a
        >
      {/if}
    </div>
  </div>
</nav-->

<div
  class="bg-background font-body text-on-surface selection:bg-primary selection:text-on-primary"
>
  <header
    class="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(6,14,32,0.08)]"
  >
    <nav class="flex justify-between items-center w-full px-8 py-4 max-w-full">
      <a
        class="text-2xl font-bold tracking-tighter text-amber-400 font-headline"
        href="/"
      >
        Midnight Lounge
      </a>

      {#if data.user}
        <div class="hidden md:flex gap-8">
          <a
            class="text-slate-300 hover:text-white transition-colors font-manrope tracking-tight"
            href="/play">Play</a
          >
          <a
            class="text-slate-300 hover:text-white transition-colors font-manrope tracking-tight"
            href="/shop">Shop</a
          >
        {#if data.admin}
          <a
            class="text-slate-300 hover:text-white transition-colors font-manrope tracking-tight"
            href="/admin">Admin</a
          >
        {/if}
        </div>
      {/if}

      {#if data.user}
      <div class="flex gap-8 items-center">
        <div
          class="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/10"
        >
        <span class="font-bold text-primary">$</span>
          <span class="font-bold text-primary">{data.balance}</span>
        </div>
        <a
          class="text-slate-300 hover:text-white transition-colors font-manrope tracking-tight"
          href="/profile">Profile</a
        >
        </div>
      {:else}
        <div class="flex gap-4">
          <a
            class="text-slate-300 hover:text-white transition-all duration-300 px-4 py-2 text-sm font-headline"
            href="/login">Sign In</a
          >
          <a
            class="bg-amber-400 text-on-primary font-bold px-6 py-2 rounded-xl scale-95 active:opacity-80 transition-all font-headline"
            href="/signup">Join Now</a
          >
        </div>
      {/if}
    </nav>
  </header>

  {@render children()}
</div>
