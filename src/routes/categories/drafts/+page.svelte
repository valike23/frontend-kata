<!-- TournamentView.svelte -->
<script lang="ts">
    import Brackets from '$lib/components/brackets.svelte';
    import { HttpHelper } from '$lib/helpers/http.helper';
    import type { Ibout, Icategory } from '$lib/interfaces/competition.interface';
  import { onMount } from 'svelte';
  
  let categoryId: number;
  let bouts: Ibout[] = [];
  let category: Icategory | null = null;
  let loading = true;
  let error: string | null = null;
  
  onMount(async () => {
    try {
      // Fetch category and bouts
      categoryId = Number( location.search.split('=')[1]) ;
      const [catRes, boutsRes] = await Promise.all([
        HttpHelper.Get('api/competition/category/'+ categoryId),
        HttpHelper.Get<Ibout[]>('api/competition/bouts/' + categoryId)
      ]);
      
      if (!catRes.data || !boutsRes.data) {
        throw new Error('Failed to fetch data');
      }
      
      category =  catRes.data;
      bouts = boutsRes.data;
      
      // Sort bouts by round
      bouts.sort((a, b) => a.round - b.round);
    } catch (err) {
        console.log(err)
      error = 'something went wrong';
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="loading">Loading bracket...</div>
{:else if error}
  <div class="error">{error}</div>
{:else if category && bouts.length > 0}
  <Brackets {bouts} {category} />
{:else}
  <div class="empty">No bouts have been drafted yet for this category</div>
{/if}

<style>
  .loading, .error, .empty {
    padding: 20px;
    text-align: center;
    font-size: 18px;
  }
  
  .error {
    color: red;
  }
</style>