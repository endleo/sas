<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

  let { data }: { data: PageServerData } = $props();
</script>

<main class="min-h-screen items-center justify-center flex">

<p class="text-7xl">hi, {#if data.user} {data.user.name}{:else} <a class="underline text-7xl" href="/login">log in</a>{/if}</p>

</main>
