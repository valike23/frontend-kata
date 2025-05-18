<script lang="ts">
   interface Ibout {
    id: number;
    entry1: { id: number; name: string, club: any } | null;
    entry2: { id: number; name: string, club: any } | null;
    winnerId?: number | null;
    round: number;
    date?: string;
    score1?: number;
    score2?: number;
  }

  export let bouts: Ibout[];

  // group bouts by round
  const boutsByRound: Record<number, Ibout[]> = {};
  for (const b of bouts) {
    (boutsByRound[b.round] ||= []).push(b);
  }

  // sorted list of rounds
  const rounds = Object.keys(boutsByRound)
    .map(n => +n)
    .sort((a, b) => a - b);

  function roundKey(r: number) {
    const count = boutsByRound[r].length;
    switch (count) {
      case 16: return 'sixteenth';
      case 8:  return 'quarterfinals';
      case 4:  return 'semifinals';
      case 2:  return 'final';
      case 1:  return 'winner';
      default: return `round-${r}`;
    }
  }
  function roundTitle(r: number) {
    const count = boutsByRound[r].length;
    switch (count) {
      case 16: return 'Round of 16';
      case 8:  return 'Quarterfinals';
      case 4:  return 'Semifinals';
      case 2:  return 'Bronze medal game';
      case 1:  return 'Gold medal game';
      default: return `Round ${r}`;
    }
  }
</script>

<div class="container">
  <h1>Competition Bracket</h1>
  <div class="tournament-bracket tournament-bracket--rounded">
    {#each rounds as r}
      <div class="tournament-bracket__round tournament-bracket__round--{roundKey(r)}">
        <h3 class="tournament-bracket__round-title">{roundTitle(r)}</h3>
        <ul class="tournament-bracket__list">
          {#each boutsByRound[r] as bout}
            <li class="tournament-bracket__item">
              <div class="tournament-bracket__match" tabindex="0">
                <table class="tournament-bracket__table">
                  {#if bout.date}
                    <caption class="tournament-bracket__caption">
                      <time datetime="{bout.date}">{bout.date}</time>
                    </caption>
                  {/if}
                  <thead class="sr-only">
                    <tr><th>Player</th><th>Score</th></tr>
                  </thead>
                  <tbody class="tournament-bracket__content">
                    <tr class="tournament-bracket__team {bout.winnerId === bout.entry1?.id ? 'tournament-bracket__team--winner' : ''}">
                      <td class="tournament-bracket__country">
                        <img style="width:20px" src="http://localhost:3000{bout.entry1?.club?.flag}" alt="my flag" />
                        {bout.entry1?.name ?? '—'}
                      </td>
                      <td class="tournament-bracket__score">
                        <span class="tournament-bracket__number">{bout.score1 ?? ''}</span>
                      </td>
                      <td class="tournament-bracket__score">
                        <span class="tournament-bracket__number">{bout.score1 ?? ''}</span>
                      </td>
                    </tr>
                    <tr class="tournament-bracket__team {bout.winnerId === bout.entry2?.id ? 'tournament-bracket__team--winner' : ''}">
                      <td class="tournament-bracket__country">
                        <img style="width:20px" src="http://localhost:3000{bout.entry2?.club?.flag}" alt="my flag" />
                       
                        {bout.entry2?.name ?? '—'}</td>
                      <td class="tournament-bracket__score">
                        <span class="tournament-bracket__number">{bout.score2 ?? ''}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</div>

<style>
@import url('https://fonts.googleapis.com/css?family=Work+Sans:300,400,600,700&subset=latin-ext');

*,
*::before,
*::after {
  box-sizing: border-box;
}
.container {
  font-size: 15px;
}
@media (min-width: 38em) { html { font-size: 14px; } }
@media (min-width: 52em) { html { font-size: 15px; } }
@media (min-width: 72em) { html { font-size: 16px; } }

.container {
  background-color: #f1f1f1;
  color: black;
  font-family: 'Work Sans', 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
}
.container {
  width: 90%;
  min-width: 18em;
  margin: 20px auto;
}
h1, h2 {
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}

.tournament-bracket {
  display: flex;
  flex-direction: column;
}
@media (min-width: 38em) {
  .tournament-bracket {
    flex-direction: row;
  }
}

.tournament-bracket__round {
  display: block;
  margin-left: -3px;
  flex: 1;
}
.tournament-bracket__round-title {
  color: #9e9e9e;
  font-size: 0.95rem;
  font-weight: 400;
  text-align: center;
  font-style: italic;
  margin-bottom: 0.5em;
}

.tournament-bracket__list {
  display: flex;
  flex-direction: column;
  flex-flow: row wrap;
  justify-content: center;
  height: 100%;
  min-height: 100%;
  border-bottom: 1px dashed #e5e5e5;
  padding-bottom: 2em;
  margin-bottom: 2em;
}
@media (min-width: 38em) {
  .tournament-bracket__list {
    border-bottom: 0;
    border-right: 1px dashed #e5e5e5;
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

.tournament-bracket__item {
  display: flex;
  flex: 0 1 auto;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  padding: 2% 0;
  width: 48%;
}
.tournament-bracket__item:nth-child(odd) {
  margin-right: 2%;
}
.tournament-bracket__item:nth-child(even) {
  margin-left: 2%;
}
@media (min-width: 38em) {
  .tournament-bracket__item {
    padding: 0.5em 1em;
    width: 100%;
  }
  .tournament-bracket__item::after {
    position: absolute;
    right: 0;
    content: '';
    display: block;
    width: 1em;
    height: 45%;
    border-right: 2px solid #9e9e9e;
  }
  .tournament-bracket__item:nth-child(odd)::after {
    top: 50%;
    border-top: 2px solid #9e9e9e;
    transform: translateY(-1px);
  }
  .tournament-bracket__item:nth-child(even)::after {
    bottom: 50%;
    border-bottom: 2px solid #9e9e9e;
    transform: translateY(1px);
  }
}

.tournament-bracket__match {
  display: flex;
  width: 100%;
  background-color: #ffffff;
  padding: 1em;
  border: 1px solid transparent;
  border-radius: 0.1em;
  box-shadow: 0 2px 0 0 #e5e5e5;
  outline: none;
}

.tournament-bracket__match:focus {
  border-color: #2196F3;
}

.tournament-bracket__match::before,
.tournament-bracket__match::after {
  transition: all 0.2s linear;
}
@media (min-width: 38em) {
  .tournament-bracket__match::before,
  .tournament-bracket__match::after {
    position: absolute;
    left: 0;
    z-index: 1;
    content: '';
    display: block;
    width: 1em;
    height: 10%;
    border-left: 2px solid #9e9e9e;
  }
  .tournament-bracket__match::before {
    bottom: 50%;
    border-bottom: 2px solid #9e9e9e;
    transform: translate(0,1px);
  }
  .tournament-bracket__match::after {
    top: 50%;
    border-top: 2px solid #9e9e9e;
    transform: translate(0,-1px);
  }
}

.tournament-bracket__round:last-child .tournament-bracket__match::before,
.tournament-bracket__round:last-child .tournament-bracket__match::after {
  border-left: 0;
}

.tournament-bracket__content {
  display: flex;
}

.tournament-bracket__team {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  width: 50%;
}

.tournament-bracket__team--winner .tournament-bracket__number {
  background-color: #FFF176;
  border-color: spin(shade(#FFF176,2%),-10);
}

.tournament-bracket__country,
.tournament-bracket__score {
  display: flex;
  align-items: center;
  padding: 0.2em;
}

.tournament-bracket__number {
  display: inline-block;
  padding: 0.2em 0.4em;
  background-color: #F5F5F5;
  border-bottom: 0.075em solid transparent;
}

</style>
