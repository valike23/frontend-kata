<script lang="ts">
    import TopBar from "$lib/components/TopBar.svelte";
    import { HttpHelper } from "$lib/helpers/http.helper";
    import { onMount } from "svelte";

    let pools: any[] = [];


    onMount(async ()=>{
        const res = await HttpHelper.Get<any[]>('api/application/bouts');
        if(res.data)console.log(res);
        pools = res.data ?? [];
    })

    const activatePool =(pool: any)=>{

    }

    const viewPool =(pool: any)=>{

    }

    const pausePool = (pool: any)=>{}
    const deletePool =(pool: any)=>{

    }
</script>

<svelte:head>
  <title>Manage Pools</title>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar active="pools" />

   <h1>Manage Pools</h1>

  <div class="row">
    <div class="cell-12">
      <table class="table  cell-hover">
        <thead>
          <tr style="color: white">
            <th style="color:white">#</th>
            <th style="color:white">Pool Name</th>
            <th style="color:white">created Date</th>
            <th style="color:white">updated Date</th>
            <th style="color:white">Status</th>
            <th style="color:white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each pools as pool, i}
            <tr>
              <td>{i + 1}</td>
              <td>{pool.poolName}</td>
              <td>{pool.createdAt}</td>
              <td>{pool.updatedAt}</td>
              <td
                >{#if pool.status == 1}
                  <span class="mif-done mif-2x fg-green" />
                {:else if pool.status == 2}
                  <span class="mif-done-all mif-2x fg-red " />
                {:else if pool.status == 3}
                  <span class="mif-stop mif-2x fg-red " />
                {:else if pool.status == 4}
                  <span class="mif-pause mif-2x fg-blue " />
                {:else}
                  <span class="mif-new-tab mif-2x fg-blue " />
                {/if}</td
              >
              <td>
                <button
                  on:click={() => {
                    viewPool(pool);
                  }}
                  class="button primary square "
                  title="make this competition active"
                >
                  <span class="mif-eye" />
                </button>

                {#if pool.status == 1}
                  <button
                    on:click={() => {
                      pausePool(pool);
                    }}
                    class="button primary square "
                    title="pause this competition"
                  >
                    <span class="mif-pause" />
                  </button>
                {/if}
                {#if pool.status == 4 || pool.status == 0}
                  <button
                    on:click={() => {
                      activatePool(pool);
                    }}
                    class="button success square "
                  >
                    <span class="mif-checkmark" />
                  </button>
                {/if}
                <button
                  title="delete pool"
                  on:click={() => {
                    deletePool(pool);
                  }}
                  class="button alert square "
                >
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