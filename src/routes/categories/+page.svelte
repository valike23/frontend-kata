<script lang="ts">
  import TopBar from "$lib/components/TopBar.svelte";
  import { HttpHelper } from "$lib/helpers/http.helper";
  import type { Icategory } from "$lib/interfaces/competition.interface";
  import { onMount } from "svelte";
  import dayjs from "dayjs";
    import { EnotificationType, handleNotification } from "$lib/functions/browserFunctions";
    import { HttpStatusCode } from "axios";
    import { goto } from "$app/navigation";

  const submit = async () => {
    console.log("submitting");
    loading = true;
    try {
     const {data} = await HttpHelper.POST<any, any>("api/competition/category", category);
     console.log(data);
     categories.push(data); 
     categories = categories;

    } catch (error: any) {
      console.log(error);
    }
    finally{
      loading = false;
    }
  };
  let categories: Icategory[] = [];
  let loading = false;
  let category: Icategory = {
    categoryName: "",
  };

  const switchName = (category: Icategory, i: number) => {
    categories[i].edit = true;
  };

  const gotoBrackets=async (competition: any, index: number)=>{
   goto('/categories/drafts?id=' + competition.id)
}

  const draft =async (category: Icategory) =>{
   const res = confirm('do you want to draft this competition');
   if(!res) return ;
   handleNotification(window, 'drafting category...', EnotificationType.INFO);
    const resp = await HttpHelper.POST('api/competition/category/draft', category);
    console.log(resp);
    if(resp.statusCode != HttpStatusCode.Ok) handleNotification(window, (resp.data as any).message, EnotificationType.ERROR)
  }
  const deleteCategory = async (category: Icategory) => {
    const { id } = category as any;

    // Find index of the category
    const index = categories.findIndex((cat) => cat.id === id);
    
    // Remove category from the array if found
    if (index !== -1) {
        categories.splice(index, 1);
    }

    categories = categories;

    // Make DELETE request
    const resp = await HttpHelper.DELETE<Icategory[]>(`api/competition/category`, id);
};

  const updateCategoryName = (category: Icategory, i: number) => {
    categories[i].edit = false;
  };
  onMount(()=>{
    HttpHelper.Get< Icategory[]>("api/competition/category").then((resp)=>{
      if(!resp.data) return;
      categories = resp.data;
      
    }).catch((error)=>{
      console.log(error);
    })
  })
</script>

<svelte:head>
  <title>Manage Categories</title>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar active="categories" />
  <h1>Categories</h1>
  <div class="container">
    <div class="row cell-12 mb-5">
      <h4>Add Category</h4>
      <p><small>fill the below form to add a category</small></p>
      <form on:submit|preventDefault={submit} class="row">
        <div class="cell-6">
          <div class="form-group">
            <label for="category">Category Name</label>
            <input
              bind:value={category.categoryName}
              required
              type="text"
              placeholder="category name"
              class="metro-input"
            />
          </div>
        </div>
        <div class="cell-6">
          <div class="form-group">
            <label for="category">Category Gender</label>
            <select
              bind:value={category.gender}
              required
              name=""
              class="metro-input"
            >
              <option selected disabled>Pick a gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        <div class="cell-12 mt-3">
          {#if loading}
            <button disabled type="submit" class="button primary float-right"
              >submiting...</button
            >
          {:else}
            <button type="submit" class="button primary float-right"
              >submit</button
            >
          {/if}
        </div>
      </form>
    </div>

    <div class="row">
      <h4>Manage Categories</h4>
      <div class="cell-12">
        <table class="table cell-hover">
          <thead>
            <tr style="color: white">
              <th style="color:white">#</th>
              <th style="color:white">category Name</th>
              <th class="" style="color:white">created Date</th>
              <th style="color:white">gender</th>
              <th style="color:white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each categories as category, i}
              <tr>
                <td>{i + 1}</td>
                {#if !category.edit}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <td
                    on:click={() => {
                      switchName(category, i);
                    }}>{category.categoryName}</td
                  >
                {:else}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <td
                    ><input
                      on:blur={() => {
                        updateCategoryName(category, i);
                      }}
                      bind:value={categories[i].categoryName}
                    /></td
                  >
                {/if}
                <td>{dayjs(category.createdAt).format('DD/MM/YYYY')}</td>
                <td>{category.gender}</td>

                <td>
                  <!-- svelte-ignore a11y_consider_explicit_label -->
                  <button class="button primary square" title="edit category">
                    <!-- svelte-ignore element_invalid_self_closing_tag -->
                    <span class="mif-pencil" />
                  </button>

                   <button
                    on:click={() => {
                      gotoBrackets(category, i);
                    }}
                    class="button primary square "
                    title="draw bouts"
                  >
                    <!-- svelte-ignore element_invalid_self_closing_tag -->
                    <span class="mif-assignment" />
                  </button>

                  <!-- svelte-ignore a11y_consider_explicit_label -->
                  <button on:click={()=>{draft(category)}} class="button primary square" title="draft category">
                    <!-- svelte-ignore element_invalid_self_closing_tag -->
                    <span class="mif-menu" />
                  </button>
                 
                
                  <button
                    class="button alert square"
                    title="destroy this category"
                  >
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore element_invalid_self_closing_tag -->
                    <span
                      on:keypress={() => {
                        deleteCategory(category);
                      }}
                      on:click={() => {
                        deleteCategory(category);
                      }}
                      class="mif-bin"
                    />
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
