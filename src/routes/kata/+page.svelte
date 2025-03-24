<script lang="ts">

  import TopBar from "$lib/components/TopBar.svelte";
  import { HttpHelper } from "$lib/helpers/http.helper";
  import type { Ikata } from "$lib/interfaces/competition.interface";
  import { onMount } from "svelte";

  let katas: Ikata[] = [];

  const deleteKata = async (kata: any) => {
    console.log(kata);
  };

  onMount(()=>{
    HttpHelper.Get<Ikata[]>('api/competition/kata').then((resp)=>{
      const {data} = resp;
      if(data){
        katas = data;
      }
    });
  })

</script>
<svelte:head>
    <title>Manage Katas</title>
</svelte:head>

<div class="h-100 container-fluid">
 <!-- svelte-ignore missing-declaration -->
 <TopBar active="kata"/>
    <h1>Manage Katas</h1>
    <div class="container">
      <div class="row">
        <div class="cell-12">
            <a class="button primary float-right" href="/kata/add">Add Kata</a>
        </div>
      </div>
        <div class="row">
            <div class="cell-12">
                <table class="table  cell-hover">
                    <thead>
                        <tr style="color: white">
                            <th style="color:white">#</th>
                            <th style="color:white">Kata Name</th>

                            <th class="" style="color:white">created Date</th>
                            <th style="color:white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each katas as kata, i}
                            <tr>
                                <td>{i + 1}</td>
                                <td>{kata.name}</td>
                            

                         <td>{kata.createdAt}</td>
                                <td
                                    >
                                    <button on:click={()=>{deleteKata(kata)}} class="button alert square ">
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