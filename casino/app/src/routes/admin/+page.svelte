<script lang="ts">
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();
</script>

<style>
  .glass-card {
    background: rgba(23, 31, 51, 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  .code-container {
    background: #0f1420;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .keyword { color: #ff757f; font-weight: bold; }
  .variable { color: #c0caf5; }
  .comment { color: #565f89; font-style: italic; }
  .number { color: #ff9e64; }
  .string { color: #9ece6a; }
  .highlight-box {
    background: rgba(233, 195, 73, 0.15);
    border-left: 3px solid #e9c349;
    padding: 0.1rem 0.4rem;
    display: inline-block;
    border-radius: 2px;
  }
</style>

<main class="w-full min-h-screen bg-surface-container-low pt-24 pb-16 px-4 sm:px-8">
  <div class="max-w-5xl mx-auto">
    
    <div class="mb-10 border-b border-white/10 pb-6">
      <div class="flex items-center gap-3 mb-2">
        <span class="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold tracking-widest uppercase rounded">
          Internal Network Only
        </span>
        <span class="text-outline text-sm">System ID: #009-SEC</span>
      </div>
      <h1 class="text-4xl font-black font-headline text-on-surface tracking-tight">
        Casino Operations Bulletin Board
      </h1>
      <p class="text-on-surface-variant mt-1 font-medium">
        Secure engineering logs, developer requests, and live audit threads.
      </p>
    </div>

    <div class="space-y-6">
      
      <div class="glass-card rounded-xl p-6 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span class="icon-[ic--outline-person] text-primary text-xl"></span>
            </div>
            <div>
              <div class="font-bold text-on-surface text-sm">dev_support_alpha</div>
              <div class="text-xs text-outline">Posted 5 months ago • Infrastructure Team</div>
            </div>
          </div>
          <span class="text-xs font-mono bg-white/5 px-2 py-1 rounded text-outline">Ticket #4912</span>
        </div>

        <div class="text-on-surface space-y-3 pl-1">
          <h2 class="text-lg font-bold text-on-surface font-headline">
            ❓ Question: What hardcoded parameters are we using for the roulette LCG?
          </h2>
          <p class="text-on-surface-variant text-sm leading-relaxed">
            Hey everyone, I'm auditing the server-side roulette actions to verify standard spin validation loops. 
            Can someone show me where the code is that gives the roulette rolls? Cheers.
          </p>
        </div>
      </div>

      <div class="glass-card rounded-xl p-6 shadow-xl border-l-4 border-primary/40">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
              <span class="icon-[ic--outline-admin-panel-settings] text-secondary text-xl"></span>
            </div>
            <div>
              <div class="font-bold text-on-surface text-sm flex items-center gap-1.5">
                sys_admin_prime 
                <span class="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded font-sans font-normal">Mod</span>
              </div>
              <div class="text-xs text-outline">Replied 5 months ago • Global Administration</div>
            </div>
          </div>
        </div>

        <div class="text-on-surface space-y-4 pl-1 mb-4">
          <p class="text-on-surface-variant text-sm leading-relaxed">
            The other parameters (multiplier, increment) are pulled dynamically, but the modulus has been hardcoded directly 
            into the core action matrix for runtime stability. Here is the excerpt containing the updated math evaluation node:
          </p>
        </div>

        <div class="rounded-lg p-5 code-container font-mono text-xs sm:text-sm leading-relaxed text-on-surface overflow-x-auto shadow-inner">
          <div class="flex items-center justify-between border-b border-white/5 pb-3 mb-4 text-xs text-outline font-sans">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
              <span class="ml-2 text-on-surface-variant font-mono">src/routes/play/+page.server.ts</span>
            </div>
          </div>

          <pre class="m-0"><code class="block">
<span class="keyword">export const</span> <span class="variable">actions</span> = &#133;
  <span class="variable">spin</span>: <span class="keyword">async</span> (<span class="variable">event</span>) =&gt; &#133;
    <span class="keyword">const</span> <span class="variable">formData</span> = <span class="keyword">await</span> <span class="variable">event</span>.<span class="variable">request</span>.<span class="variable">formData</span>();
    <span class="keyword">const</span> <span class="variable">bets</span>: &#123; [<span class="variable">key</span>: <span class="string">string</span>]: <span class="string">number</span> &#125; = &#123;&#125;;

    <span class="variable">Object</span>.<span class="variable">keys</span>(<span class="variable">possibleBets</span>).<span class="variable">forEach</span>((<span class="variable">bet</span>) =&gt; &#123;
      <span class="variable">bets</span>[<span class="variable">bet</span>] = <span class="variable">Math</span>.<span class="variable">max</span>(+(<span class="variable">formData</span>.<span class="variable">get</span>(<span class="variable">bet</span>) || <span class="number">0</span>), <span class="number">0</span>);
    &#125;);

    <span class="keyword">const</span> <span class="variable">totalBetAmount</span> = <span class="variable">Object</span>.<span class="variable">values</span>(<span class="variable">bets</span>).<span class="variable">reduce</span>((<span class="variable">acc</span>, <span class="variable">amt</span>) =&gt; <span class="variable">acc</span> + <span class="variable">amt</span>, <span class="number">0</span>);

    <span class="comment">/* get user's balance */</span>
    <span class="keyword">const</span> <span class="variable">walletData</span> = <span class="keyword">await</span> <span class="variable">db</span>
      .<span class="variable">select</span>()
      .<span class="variable">from</span>(<span class="variable">wallet</span>)
      .<span class="variable">where</span>(<span class="variable">eq</span>(<span class="variable">wallet</span>.<span class="variable">userId</span>, <span class="variable">event</span>.<span class="variable">locals</span>.<span class="variable">user</span>.<span class="variable">id</span>));

    <span class="keyword">if</span> (<span class="variable">walletData</span>[<span class="number">0</span>].<span class="variable">money</span> &lt; <span class="variable">totalBetAmount</span>) &#123;
      <span class="keyword">return</span> <span class="variable">fail</span>(<span class="number">400</span>, &#123; <span class="variable">error</span>: <span class="string">"insufficient funds"</span> &#125;);
    &#125;

    <span class="keyword">let</span> <span class="variable">updatedBalance</span> = <span class="variable">walletData</span>[<span class="number">0</span>].<span class="variable">money</span> - <span class="variable">totalBetAmount</span>;

    <span class="comment">/* calculate next lcg result and corresponding roulette roll */</span>
    <span class="keyword">const</span> <span class="variable">xn</span> =
      (?? * ?? + ??) %
      <span class="highlight-box font-bold text-primary"><span class="number">{data.modulus}</span></span>;

    <span class="keyword">const</span> <span class="variable">result</span> = <span class="variable">xn</span> % <span class="number">37</span>;

    <span class="comment">/* update lcg data for user */</span>
    <span class="keyword">await</span> <span class="variable">db</span>
      .<span class="variable">update</span>(<span class="variable">lcg</span>)
      .<span class="variable">set</span>(&#123; <span class="variable">lastResult</span>: <span class="variable">xn</span> &#125;)
      .<span class="variable">where</span>(<span class="variable">eq</span>(<span class="variable">lcg</span>.<span class="variable">userId</span>, <span class="variable">event</span>.<span class="variable">locals</span>.<span class="variable">user</span>.<span class="variable">id</span>));

    <span class="variable">updatedBalance</span> += <span class="variable">calculatePayout</span>(<span class="variable">result</span>, <span class="variable">bets</span>);

    <span class="keyword">await</span> <span class="variable">db</span>
      .<span class="variable">update</span>(<span class="variable">wallet</span>)
      .<span class="variable">set</span>(&#123; <span class="variable">money</span>: <span class="variable">updatedBalance</span> &#125;)
      .<span class="variable">where</span>(<span class="variable">eq</span>(<span class="variable">wallet</span>.<span class="variable">userId</span>, <span class="variable">event</span>.<span class="variable">locals</span>.<span class="variable">user</span>.<span class="variable">id</span>));

    <span class="keyword">return</span> &#123; <span class="variable">success</span>: <span class="keyword">true</span>, <span class="variable">resultNumber</span>: <span class="variable">result</span> &#125;;
  &#125;
&#125;</code></pre>
        </div>
      </div>
      
    </div>
  </div>
</main>