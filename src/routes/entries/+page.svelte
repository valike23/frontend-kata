<script lang="ts">
  import TopBar from "$lib/components/TopBar.svelte";
  import { HttpHelper } from "$lib/helpers/http.helper";
  import type { Ientry } from "$lib/interfaces/competition.interface";
  import { onMount } from "svelte";


  let entries: Ientry[] = [];
  let deleteEntry = async (entry: Ientry) => {
    console.log(entry);
  };
  let switchName = (entry: Ientry, index: number) => {
    entries[index].edit = true;
  };
    let updateEntry = (entry: Ientry, index: number) => {
        entries[index].edit = false;
    };

    onMount(()=>{
        HttpHelper.Get<Ientry[]>('api/competition/entry').then((resp)=>{
            const {data} = resp;
            if(data){
                entries = data;
            }
        });
    })
</script>
<svelte:head>
    <title>Manage Entries</title>
</svelte:head>

<div class="h-100 container-fluid">
 <!-- svelte-ignore missing-declaration -->
 <TopBar active="entries"/>
    <h1>Manage Entries</h1>
    <div class="container">
      <div class="row">
        <div class="cell-12">
            <a class="button primary float-right" href="/entries/add">Add Competitor</a>
        </div>
      </div>
        <div class="row">
            <div class="cell-12">
                <table class="table  cell-hover">
                    <thead>
                        <tr style="color: white">
                            <th style="color:white">#</th>
                            <th style="color:white">Athlete Name</th>
                            <th class="" style="color:white">Category</th>

                            <th class="" style="color:white">Club Name</th>
                            <th style="color:white">Flag</th>

                            <th class="" style="color:white">created Date</th>
                            <th style="color:white">Actions</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {#each entries as entry, i}
                            <tr>
                                <td>{i + 1}</td>
                               {#if !entry.edit}
                               <!-- svelte-ignore a11y-click-events-have-key-events -->
                               <td  on:click={()=>{switchName(entry,i)}}>{entry.name}</td>
                               {:else}
                               <!-- svelte-ignore a11y-click-events-have-key-events -->
                               <td><input on:blur={()=>{updateEntry(entry,i)}} bind:value={entries[i].name}/></td>
                               {/if}
                              
                             <td>{entry.category?.categoryName}</td>
                             <td>{entry.club?.clubName}</td>
                             <td
                             ><img
                                 class="img"
                                 src={entry.club?.flag? 'http://localhost:3000' + entry.club.flag : "images/kata.jpg"}
                                 alt=""
                             /></td
                         >

                         <td>{entry.createdAt}</td>
                                <td
                                    >
                                    <button title="delete entry" on:click={()=>{deleteEntry(entry)}} class="button alert square ">
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