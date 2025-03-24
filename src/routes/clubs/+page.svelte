<script lang="ts">
  import { goto } from "$app/navigation";
  import dayjs from "dayjs";
  import TopBar from "$lib/components/TopBar.svelte";
  import { HttpHelper } from "$lib/helpers/http.helper";
  import type { Iclub } from "$lib/interfaces/competition.interface";
  import { onMount } from "svelte";
let clubs: Iclub[] = [];
const switchName =(club: Iclub, i:number)=>{
    clubs[i].edit = true;
 }

  const openAddclub =()=>{
    goto('clubs/add');
  }
  const deleteClub =(club: Iclub)=>{
    console.log(club);
  }
  const updateClubName =(club: Iclub, i:number)=>{
    clubs[i].edit = false;
  }

  onMount(()=>{
    HttpHelper.Get('api/competition/clubs').then((resp)=>{
      console.log("the resp is here", resp);
      clubs = resp.data as Iclub[];
    })
  })

</script>
<svelte:head>
  <title>Manage club</title>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar active="clubs"/>
  <h1>Manage club</h1>
  <div class="container">
    <div class="row cell-12 mb-5 pr-5">
      <button on:click={openAddclub} class="button primary float-right"
        >Add club</button
      >
    </div>
    <div class="row">
      <div class="cell-12">
        <table class="table  cell-hover">
          <thead>
            <tr style="color: white">
              <th style="color:white">#</th>
              <th style="color:white">club Name</th>
              <th class="" style="color:white">created Date</th>
              <th style="color:white">Image</th>
              <th style="color:white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {#each clubs as club, i}
              <tr>
                <td>{i + 1}</td>
                 {#if !club.edit}
                               <!-- svelte-ignore a11y-click-events-have-key-events -->
                               <td  on:click={()=>{switchName(club,i)}}>{club.clubName}</td>
                               {:else}
                               <!-- svelte-ignore a11y-click-events-have-key-events -->
                               <td><input on:blur={()=>{updateClubName(club,i)}} bind:value={clubs[i].clubName}/></td>
                               {/if}
                <td>{dayjs(club.createdAt).format('DD/MM/YYYY')}</td>
                <td
                  ><img
                    class="img"
                    src={club.flag ?'http://localhost:3000' + club.flag : "images/kata.jpg"}
                    alt=""
                  /></td
                >

                <td>
                  <!-- svelte-ignore a11y_consider_explicit_label -->
                  <button title="delete club" on:click={()=>{deleteClub(club)}} class="button alert square ">
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