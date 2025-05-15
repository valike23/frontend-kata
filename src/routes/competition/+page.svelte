<script lang="ts">
  import { goto } from "$app/navigation";
  import TopBar from "$lib/components/TopBar.svelte";
  import { HttpHelper } from "$lib/helpers/http.helper";
    import type { Icompetition } from "$lib/interfaces/competition.interface";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
const openAddCompetition =() =>{
    goto('competition/add');
}
let competitions: any[] = [];

const activateCompetition=async (competition: any, index: number)=>{
   if (confirm("Are you sure you want to activate this competition? All other competitions will be deactivated.")) {
    const resp = await HttpHelper.PUT<{}, Icompetition[]>(`api/competition/activate?id=${competition.id}`,{});
    console.log("the resp is here", resp.data);
    competitions = resp.data as Icompetition[];
    competitions = competitions;
     
   }
}




const deleteCompetition=(competition: any)=>{

  if (confirm("Are you sure you want to delete this competition?")) {
    HttpHelper.DELETE(`api/competition`, competition.id)
      .then((resp: any) => {
        if (resp.status === 200) {
          competitions = competitions.filter((c) => c.id !== competition.id);
        } else {
          alert("Failed to delete competition.");
        }
      })
      .catch((error) => {
        console.error("Error deleting competition:", error);
      });
  }
}

onMount(async ()=>{
   const resp = await HttpHelper.Get('api/competition');
   console.log("the resp is here", resp);
   competitions = resp.data as any[];
})

</script>

<svelte:head>
  <title>Manage Competition</title>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar active="competition"/>
  <h1>Manage Competition</h1>
  <div class="container">
    <div class="row cell-12 mb-5 pr-5">
      <button on:click={openAddCompetition} class="button primary float-right"
        >Add Competition</button
      >
    </div>
    <div class="row">
      <div class="cell-12">
        <table class="table  cell-hover">
          <thead>
            <tr style="color: white">
              <th style="color:white">#</th>
              <th style="color:white">competition Name</th>
              <th class="" style="color:white">created Date</th>
              <th style="color:white">Image</th>
              <th style="color:white">Active</th>
              <th style="color:white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each competitions as competition, i}
              <tr>
                <td>{i + 1}</td>
                <td>{competition.competitionName}</td>
                <td>{dayjs(competition.createdAt).format('DD/MM/YYYY HH:MM a') }</td>
                <td
                  ><img
                    class="img"
                    src={competition.image? 'http://localhost:3000' + competition.image : "images/kata.jpg"}
                    alt=""
                  /></td
                >
                <td
                  >{#if competition.active}
                    <!-- svelte-ignore element_invalid_self_closing_tag -->
                    <span class="mif-done mif-2x fg-green" />
                  {:else}
                    <!-- svelte-ignore element_invalid_self_closing_tag -->
                    <span class="mif-cross-light mif-2x fg-red " />
                  {/if}</td
                >
                
                <td
                  >
                  
                  <!-- svelte-ignore a11y_consider_explicit_label -->
                  <button
                    on:click={() => {
                      activateCompetition(competition, i);
                    }}
                    class="button primary square "
                    title="make this competition active"
                  >
                    <!-- svelte-ignore element_invalid_self_closing_tag -->
                    <span class="mif-checkmark" />
                  </button>

                  
                  
                  <!-- svelte-ignore a11y_consider_explicit_label -->
                  <button
                    on:click={() => {
                      deleteCompetition(competition);
                    }}
                    class="button alert square "
                  >
                    <!-- svelte-ignore element_invalid_self_closing_tag -->
                    <span class="mif-bin" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<style>
    .img {
      height: 40px;
      width: 40px;
    }
  </style>