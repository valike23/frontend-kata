<script lang="ts">
    import { goto } from "$app/navigation";


  import TopBar from "$lib/components/TopBar.svelte";
    import { EnotificationType, handleNotification } from "$lib/functions/browserFunctions";
  import { HttpHelper } from "$lib/helpers/http.helper";
  import type { Icategory, Iclub, Ientry, partialEntry } from "$lib/interfaces/competition.interface";
  import { onMount } from "svelte";
  let isBulk = false;
  let myCategory: any;
  let categories: Icategory[] = [];
  let files: any;
  let loading = false;
  let competitor: Ientry = {};
  let clubs: Iclub[] = [];

  const switchTo = (text: string) => {
    if (text == "single") isBulk = false;
    if (text == "bulk") isBulk = true;
  };

  onMount(()=>{
    
        HttpHelper.Get<Icategory[]>('api/competition/category').then((resp)=>{
            const {data} = resp;
            if(data){
                categories = data;
            }   
        });
        HttpHelper.Get<Iclub[]>('api/competition/clubs').then((resp)=>{
            const {data} = resp;
            if(data){
                clubs = data;
            }   
        });
  })



  function bulkSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement; }) {
    try {
      const form = new FormData();
      if (files) form.append("excel", files[0]);
console.log("list of category", myCategory);
      HttpHelper.POST_FILE<partialEntry[]>('api/upload/entry', form).then((resp) => {
        const { data } = resp;
        if (data) {
          handleNotification(
            window,
            "entries list was created successfully",
            EnotificationType.SUCCESS,
            () => {
              const entries : Partial<Ientry>[]=[];
              data.forEach((d)=>{
                let entry: Partial<Ientry> = {};
                entry.clubId = clubs.find((c)=>{ return c.clubName === d.club})?.id;
                entry.categoryId = myCategory;
                entry.name = d.name;
                entries.push(entry);
              })

               HttpHelper.POST<any, Ientry[]>('api/competition/entry/bulk', JSON.stringify(entries)).then((resp)=>{
        const {data} = resp;
        if(data){
          console.log("did it work")
            loading = false;
            competitor = {};
            goto("/entries");
        }
    }).catch((error)=>{
        loading = false;
    })
             // 

            },
          );
        } else {
          handleNotification(
            window,
            "oops!!! entries list was not created successfully",
            EnotificationType.ERROR
          );
        }
      });
    } catch (error: any) {
      handleNotification(
        window,
        "oops!!! entries list was not created successfully",
        EnotificationType.ERROR
      );
    }
  }
  function submit() {
    loading = true;
    HttpHelper.POST<Ientry, Ientry>('api/competition/entry/single', competitor).then((resp)=>{
        const {data} = resp;
        if(data){
            loading = false;
            competitor = {};
        }
    }).catch((error)=>{
        loading = false;
    })
  }
</script>
<svelte:head>
  <title>Add Competitors</title>
</svelte:head>
<div class="container-fluid h-100">
  <!-- svelte-ignore missing-declaration -->
  <TopBar active="entries"/>
  <h1>Add Competitor</h1>
  <div class="container">
    <div class="row">
      <div class="cell-6">
        <button
          on:click={() => {
            switchTo("single");
          }}
          class="button primary float-right">single</button
        >
      </div>
      <div class="cell-6">
        <button
          on:click={() => {
            switchTo("bulk");
          }}
          class="button primary float-left">Bulk</button
        >
      </div>
    </div>

    <h3>
      {#if isBulk}
        Bulk Upload
      {:else}
        Single Upload
      {/if}
    </h3>
    {#if isBulk}
      <form class="mt-3" on:submit|preventDefault={bulkSubmit}>
        <div class="row">
          <div class="cell-6">
            <div class="form-group">
              <label for="name">Pick Category</label>
              <select bind:value={myCategory} required class="metro-input" id="category">
                <option disabled selected>Pick a category</option>
                {#each categories as category}
                  <option value={category.id}>{category.categoryName}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="cell-6">
            <div class="form-group">
              <label for="name">Upload Excel</label>
              <input
                required
                type="file"
                bind:files
                class="metro-input"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </div>
          </div>
        </div>

        <div class="mt-5">
          <button type="submit" class="button float-right  success"
            >submit</button
          >
        </div>
      </form>
    {:else}
      <form class="mt-3" on:submit|preventDefault={submit}>
        <div class="row">
          <div class="cell-12">
            <div class="form-group">
              <label for="name">Competitor Name</label>
              <input
                bind:value={competitor.name}
                required
                class="metro-input mt-2"
                id="name"
                type="text"
                placeholder="Enter competitor full name"
              />
            </div>
          </div>
          <div class="cell-6">
            <div class="form-group">
              <label for="name">Category</label>
              <select
                bind:value={competitor.categoryId}
                class="metro-input"
                required
                name=""
                id=""
              >
                <option disabled selected>Pick a Category</option>
                {#each categories as category}
                  <option value={category.id}>{category.categoryName}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="cell-6">
            <div class="form-group">
              <label for="name">Club</label>
              <select
                bind:value={competitor.clubId}
                class="metro-input"
                required
                name=""
                id=""
              >
                <option disabled selected>Pick a Club</option>
                {#each clubs as club}
                  <option value={club.id}>{club.clubName}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <div class="mt-5">
          {#if loading}
          <button disabled type="submit" class="button float-right  success"
          >submiting...</button
        >
          {:else}
          <button type="submit" class="button float-right  success"
          >submit</button
        >
          {/if}
        </div>
      </form>
    {/if}
  </div>
</div>

<style>
  .upload {
    border: 2px dashed white;
    min-height: 50px;
  }
  #file {
    height: 0px;
    width: 0px;
  }
  #small {
    max-height: 60px;
  }
</style>