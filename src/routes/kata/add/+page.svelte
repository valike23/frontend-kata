<script lang="ts">
  import { goto } from "$app/navigation";


  import TopBar from "$lib/components/TopBar.svelte";
  import { EnotificationType, handleNotification } from "$lib/functions/browserFunctions";
  import { HttpHelper } from "$lib/helpers/http.helper";
  import type { Ikata } from "$lib/interfaces/competition.interface";
  let files: any;
  let loading = false;
  let isBulk = false;
  const switchTo = (text: string) => {
    if (text == "single") isBulk = false;
    if (text == "bulk") isBulk = true;
  };
  let kata = '';
  function submit() {
    loading = true;
    HttpHelper.POST<Ikata, Ikata>('api/competition/kata/single', {name: kata}).then((resp)=>{
        const {data} = resp;
        if(data){
            loading = false;
            kata = '';
        }
    }).catch((error)=>{
        console.log(error);
        loading = false;
    })
  }

  const bulkSubmit = async () => {
    try {
      const form = new FormData();
      if (files) form.append("excel", files[0]);

      HttpHelper.POST_FILE< Ikata[]>('api/upload/kata', form).then((resp) => {
        const { data } = resp;
        if (data) {
          handleNotification(
            window,
            "katas list was created successfully",
            EnotificationType.SUCCESS,
            () => {
              goto("/kata");
            },
          );
        } else {
          handleNotification(
            window,
            "oops!!! katas list was not created successfully",
            EnotificationType.ERROR
          );
        }
      });
    } catch (error: any) {
      console.log(error.toJSON());
      handleNotification(
        window,
        "oops!!! katas list was not created successfully",
        EnotificationType.ERROR
      );
    }
    
    
  };


</script>
<svelte:head>
  <title>Add kata</title>
</svelte:head>
<div class="container-fluid h-100">
  <!-- svelte-ignore missing-declaration -->
  <TopBar active="kata"/>
  <h1>Add kata</h1>
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
         
          <div class="cell-12">
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
              <label for="name">Kata Name</label>
              <input
                bind:value={kata}
                required
                class="metro-input mt-2"
                id="name"
                type="text"
                placeholder="Enter kata name"
              />
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