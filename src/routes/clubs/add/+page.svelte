<script lang="ts">
  import { goto } from "$app/navigation";


  import TopBar from "$lib/components/TopBar.svelte";
  import { EnotificationType, handleNotification } from "$lib/functions/browserFunctions";
  import { HttpHelper } from "$lib/helpers/http.helper";
  import type { Iclub, IFileUpload } from "$lib/interfaces/competition.interface";
  let files: any;
    let fileName = "";
    let url ='';
    let win;
    let name = "";
    const readFile =(files: any)=>{
      console.log(files);
      if(files){
          if(url){
              //to stop memory leaks
              URL.revokeObjectURL(url);
          }
          console.log(files[0]);
          fileName = files[0].name;
         url = URL.createObjectURL(files[0]);
          const upload = document.getElementById("small") as HTMLImageElement;
          console.log(url);
          upload.src = url;
  
      }
  }

  const submit = async ()=>{
    try {
          const form = new  FormData();
          if(files) form.append('image', files[0]);
        //   form.append('body', JSON.stringify({
        //       competitionName : name
        //   }));
        const resp = await HttpHelper.POST<any,IFileUpload>('api/upload', form);
        if(resp){
            const {data} = resp;
            console.log("the data here is", data);
            if(!data) throw({message: 'something went wrong'});
            const resp2 = await HttpHelper.POST<Iclub, Iclub>('api/competition/clubs', {clubName:name, flag: data?.path})
            console.log(resp2);
            if(resp2){
                const {data} = resp2;
                console.log(data);
                handleNotification(window, 'Club was created successfully', EnotificationType.SUCCESS,()=>{goto('/clubs')}, goto);
                
            }
            
            return ;
        }
        return;
         
          
      } catch (error: any) {
          console.log(error.toJSON());
          
          handleNotification(window, 'oops!!! competition was not created successfully', EnotificationType.ERROR);
      }
  }
  const triggerUpload  =()=>{
      const file = document.getElementById('file') as HTMLElement;
      file.click();
    }
    $: {
      readFile(files)
    }

</script>


<svelte:head>
    <title>Add club</title>
</svelte:head>
<div class="container-fluid h-100">
    <!-- svelte-ignore missing-declaration -->
    <TopBar active="clubs"/>
    <h1>Add club</h1>
    <div class="container">
        <div>
            
        </div>
        <form class="mt-3" on:submit|preventDefault={submit}>
            <div class="form-group">
                <label for="name">club Name</label>
                <input bind:value={name} required class="metro-input mt-2" id="name" type="text" placeholder="Enter club name"/>
            </div>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div on:click={triggerUpload} id="upload" class="upload mt-4 text-center ">
                <img id="small" src="" alt="">
                <input  bind:files type="file" accept="image/*" name="fileupload" id="file">
                <p class="mb-3">{fileName || 'click here to upload image'}</p>
            </div>
           <div class="mt-5">
            <button type="submit" class="button float-right  success">submit</button>
           </div>
        </form>
    </div>
</div>

<style>
    .upload{
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