<!-- src/lib/components/Bracket.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  let win: any;
  interface Ibout {
    id: number;
    entry1Id: number | null;
    entry2Id: number | null;
    winnerId: number | null;
    categoryId: number;
    round: number;
    competitionId: number;
    entry1: { id: number; name: string } | null;
    entry2: { id: number; name: string } | null;
  }

  export let bouts: Ibout[];

  // 1) Group by round, sorted by ID
  function groupByRound(bs: Ibout[]) {
    return bs.reduce<Record<number, Ibout[]>>((acc, b) => {
      acc[b.round] = acc[b.round] || [];
      acc[b.round].push(b);
      return acc;
    }, {});
  }

  // 2) Build a Treant node recursively
  function nodeForBout(
    bout: Ibout,
    rounds: Record<number, Ibout[]>,
    maxRound: number
  ) {
    const children: any[] = [];

    // only rounds > 1 have children
    if (bout.round > 1) {
      const prevRound = rounds[bout.round - 1];
      // find this bout’s index within its round
      const idx = rounds[bout.round].findIndex((x) => x.id === bout.id);
      // each parent has two children: at positions 2*idx, 2*idx + 1
      const left  = prevRound[2 * idx];
      const right = prevRound[2 * idx + 1];
      if (left)  children.push(nodeForBout(left,  rounds, maxRound));
      if (right) children.push(nodeForBout(right, rounds, maxRound));
    }

    // label: if round 1, show "Alice vs Bob"; otherwise just "TBD"
    let label = 'TBD';
    if (bout.round === 1) {
      const n1 = bout.entry1?.name ?? '—';
      const n2 = bout.entry2?.name ?? '—';
      label = `${n1} vs ${n2}`;
    }

    return {
      HTMLclass: 'bout-node',
      text: { name: label },
      children,
    };
  }

  // 3) Build the full Treant config
  function buildConfig(bs: Ibout[]) {
    const rounds = groupByRound(bs);
    const maxRound = Math.max(...bs.map((b) => b.round));
    const finalBout = rounds[maxRound][0];
    if (!finalBout) return null;

    return [
      {
        chart: {
          container: '#bracket',
          rootOrientation: 'WEST',      // left-to-right
          nodeAlign:    'BOTTOM',
          connectors:   { type: 'step' },
          levelSeparation: 30,
          siblingSeparation: 20,
          subTeeSeparation: 25,
          padding: [20, 20, 20, 20],
        },
      },
      nodeForBout(finalBout, rounds, maxRound),
    ];
  }

  let config: any;

  onMount(() => {
    win = window;
    config = buildConfig(bouts);
    // @ts-ignore global Treant
    new win.Treant(config);
  });
</script>

<style>
  /* style each bout box */
  .bout-node {
    padding: 8px 12px;
    border: 1px solid #444;
    border-radius: 4px;
    font-size: 0.9rem;
    background: #fafafa;
  }
</style>

<div id="bracket"></div>
