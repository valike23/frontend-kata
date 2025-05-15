<!-- Bracket.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
    import type { Ibout, Icategory } from '$lib/interfaces/competition.interface';
  
  export let bouts: Ibout[];
  export let category: Icategory;
  
  let svg: SVGSVGElement;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  let width = 800;
  let height = 600;
  
  onMount(() => {
    drawBracket();
  });
  
  $: if (bouts && category) {
    drawBracket();
  }
  
  function drawBracket() {
    if (!svg) return;
    
    // Clear previous drawing
    d3.select(svg).selectAll("*").remove();
    
    // Group bouts by round
    const rounds = d3.group(bouts, d => d.round);
    const roundCount = rounds.size;
    
    if (roundCount === 0) return;
    
    // Calculate dimensions
    const bracketWidth = width - margin.left - margin.right;
    const bracketHeight = height - margin.top - margin.bottom;
    
    // Round spacing
    const roundSpacing = bracketWidth / (roundCount + 1);
    
    // Create SVG group for the bracket
    const g = d3.select(svg)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Draw each round
    rounds.forEach((roundBouts, roundNumber) => {
      const roundX = roundNumber * roundSpacing;
      const matchCount = roundBouts.length;
      const matchSpacing = bracketHeight / (matchCount + 1);
      
      roundBouts.forEach((bout: Ibout, i: number) => {
        const matchY = (i + 0.5) * matchSpacing;
        
        // Draw match connector
        if (roundNumber > 0) {
          // Find parent bout (where this entry came from)
          const parentBout = bouts.find(b => 
            b.round === roundNumber - 1 && 
            (b.winnerId === bout.entry1Id || b.winnerId === bout.entry2Id)
          );
          
          if (parentBout) {
            const parentRoundBouts = rounds.get(roundNumber - 1) || [];
            const parentIndex = parentRoundBouts.indexOf(parentBout);
            const parentY = (parentIndex + 0.5) * (bracketHeight / (parentRoundBouts.length + 1));
            
            g.append("path")
              .attr("d", `M${roundX - roundSpacing},${parentY} L${roundX},${matchY}`)
              .attr("stroke", "#999")
              .attr("stroke-width", 1)
              .attr("fill", "none");
          }
        }
        
        // Draw match box
        g.append("rect")
          .attr("x", roundX - 80)
          .attr("y", matchY - 30)
          .attr("width", 160)
          .attr("height", 60)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("fill", "#f5f5f5")
          .attr("stroke", "#ddd");
        
        // Entry 1 name
        g.append("text")
          .attr("x", roundX - 70)
          .attr("y", matchY - 10)
          .attr("font-size", "12px")
          .text(bout.entry1?.name || `Entry ${bout.entry1Id}`);
        
        // Entry 2 name
        g.append("text")
          .attr("x", roundX - 70)
          .attr("y", matchY + 10)
          .attr("font-size", "12px")
          .text(bout.entry2Id === bout.entry1Id ? "BYE" : bout.entry2?.name || `Entry ${bout.entry2Id}`);
        
        // Winner indicator
        if (bout.winnerId) {
          const isEntry1Winner = bout.winnerId === bout.entry1Id;
          g.append("polygon")
            .attr("points", isEntry1Winner ? 
              `${roundX + 60},${matchY - 15} ${roundX + 70},${matchY - 5} ${roundX + 60},${matchY + 5}` :
              `${roundX + 60},${matchY + 15} ${roundX + 70},${matchY + 5} ${roundX + 60},${matchY - 5}`)
            .attr("fill", "green");
        }
      });
    });
    
    // Add round labels
    rounds.forEach((_, roundNumber: number) => {
      g.append("text")
        .attr("x", roundNumber * roundSpacing)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text(roundNumber === rounds.size - 1 ? "Final" : 
              roundNumber === rounds.size - 2 ? "Semi-Final" :
              `Round ${roundNumber + 1}`);
    });
  }
</script>

<div class="bracket-container">
  <h2>{category.categoryName} Bracket</h2>
  <svg bind:this={svg} class="bracket" />
</div>

<style>
  .bracket-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .bracket {
    background-color: white;
    font-family: sans-serif;
  }
  
  text {
    user-select: none;
  }
</style>