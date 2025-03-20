
<script lang="ts" >
    import axios from "axios";
  import TopBar from "$lib/components/TopBar.svelte";
  import { EnotificationType, handleNotification } from "$lib/functions/browserFunctions";
  import { goto } from "$app/navigation";
  import { HttpHelper } from "$lib/helpers/http.helper";
  import type { Icompetition, IFileUpload } from "$lib/interfaces/competition.interface";
    let files: any;
    let fileName = "";
    let url ='';
    let win;
    let active = "competition";
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
          const upload: any = document.getElementById("small");
          console.log(url);
          upload.src = url;
  
      }
  }
  const submit =async ()=>{
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
            const resp2 = await HttpHelper.POST<Icompetition, Icompetition>('api/competition', {competitionName:name, image: data?.path})
            console.log(resp2);
            if(resp2){
                const {data} = resp2;
                console.log(data);
                handleNotification(window, 'competition was created successfully', EnotificationType.SUCCESS,()=>{goto('/competition')}, goto);
                
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
      const file: any = document.getElementById('file');
      file.click();
    }
    $: {
      readFile(files)
    }
  
    
  
  </script>
<svelte:head>
    <title>Add Competition</title>
</svelte:head>
<div class="container-fluid h-100">
    <!-- svelte-ignore missing-declaration -->
    <TopBar {active}/>
    <h1>Add Competition</h1>
    <div class="container">
        <div>
            
        </div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <form class="mt-3" on:submit|preventDefault={submit}>
            <div class="form-group">
                <label for="name">Competition Name</label>
                <input bind:value={name} required class="metro-input mt-2" id="name" type="text" placeholder="Enter competition name"/>
            </div>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div on:click={triggerUpload} id="upload" class="upload mt-4 text-center ">
                <img id="small" src="" alt="">
                <input  bind:files type="file" accept="image/*" name="fileupload" id="file">
                <p class="mb-3">{fileName || 'click here to upload image'}</p>
            </div>
           <div class="mt-5">
            <button type="reset" class="button float-left primary mr-3">Clear Form</button>
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