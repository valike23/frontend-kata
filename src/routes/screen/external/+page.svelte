<script lang="ts">
  import FinalShow from "$lib/components/screens/FinalShow.svelte";
  import Timer from "$lib/components/screens/Timer.svelte";
  let socket, win;
  let pool: any = {};
  let club: any = {};
  let judges: any[] = [];
  let finalPool = {};
  let finalScreen: any = {};
  let finalResult: any = {};
  let result: any = {};
  let groupPool ={};
  let athletes: any[] = [];
  let isStop = false;
  let athlete: any = {};
  athlete.result = 0;
  athlete.club = {};
  let kata = "";
  let endClock = false;
  let timer = false;
  athlete.category = {};
  let show = "";
  let minutes = 0;
  let seconds = 0;

  const handleTimerStart = () => {
    console.log("start kata");
  };
  const handleTimerEnd = () => {
    console.log("end kata");
  };

</script>


{#if show == "pool"}
  <div>
    <h3>Current Pool {pool.pool_name}</h3>
  </div>
  <div class="row p-4">
    <div class="col-12">
      <div class="card">
        <div class="table-responsive">
          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                  >id</th
                >
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                  >name</th
                >

                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                  >result</th
                >
              </tr>
            </thead>
            <tbody>
              {#each athletes as a, i}
                <tr>
                  <td class="align-middle text-center text-black text-sm">
                    <p>{i + 1}</p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <p>{a.first_name + " " + a.last_name}</p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <p>{Number(a.result).toFixed(2) || 0}</p>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
{:else if show == "athlete"}
  <div
    class="container-fluid text-center justify-content-center row"
    style="background-color: black;"
  >
    <div class="text-center justify-content-center row">
      <div class="col-12">
        <br />
        <h1 class="text-uppercase" style="color: red; font-weight: 800;">
          {athlete.result.toFixed(2) || 0.0}
        </h1>
        <p
          class="float-right text-center align-self-end h2 font-weight-bolder p-4 mr-0"
          style="background-color: transparent; color: yellow; font-size: 50px;"
        >
          1
        </p>
      </div>
    </div>
    <div class="p-3 row">
      <div class="col-5">
        <div
          class="justify-content-center text-center p-4 font-weight-bolder"
          style="background-color: yellow; color: red; height: 230px;"
        >
          <h1 style="font-size: 130px; font-weight: 800;">
            {athlete.result.toFixed(2) || 0.0}
          </h1>
        </div>
      </div>
      <div
        class="justify-content-end text-center pt-4 text-white font-weight-bolder col-5"
      >
        <span class="font-size-18">0.7 TECHNICAL</span>&nbsp;&nbsp;<span
          class="font-size-18">0.3 ATHLETIC</span
        >
      </div>
      <div class="col-2" />
    </div>
    <br />
    <div class="text-center justify-content-center row">
      <div class="text-center col-12">
        <h1 class="text-uppercase" style="color: red; font-size: 40px;">
          {athlete.category.category_name}
        </h1>
      </div>
    </div>
    <br />
    <div class="p-4 row">
      <div class="col-4">
        <div class="pl-4" style="border-left: 1px solid red;">
          <h1 style="color: white; font-size:x-large">
            {athlete.first_name + " " + athlete.last_name}
          </h1>
        </div>
      </div>
      <div class="col-4">
        <div class="text-center">
          <img
            class="img-fluid"
            src={athlete.club.flag}
            alt="state-flag"
            width="300"
          />
        </div>
      </div>
      <div class="col-4">
        <div class="pr-4 text-right" style="border-right: 1px solid red;">
          <h1 style="color: white;">{kata}</h1>
        </div>
      </div>
    </div>
    <br />
  </div>
{:else if show == "kata"}
  <div class="container mb-4 mt-4 pb-4 kata">
    <div
      class="row mt-5 text-center justify-content-center row"
      style="background-color: gray; height:12vh"
    >
      <div class="cell-12">
        <h1>{pool.poolName}</h1>
      </div>
    </div>

    <div class="row" style="height: 50vh;">
      <div class="cell-2 red" />
      <div class="cell-7">
        <h1>{athlete.name}</h1>
        <h1>
          <img
            src={club.flag || "images/HAWKtm.png"}
            class="flag mr-3"
            alt="flag"
          />
          {club.clubName || ""}
        </h1>
      </div>
      <div class="cell-3">
        <img class="float-right qrcode" src="images/qr.jpeg" alt="" />
      </div>
    </div>
    <div class="row">
      <div class="cell-12">
        <h1 class="text-right" style="color:whitesmoke">
          {athlete.pool_entries.kata}
        </h1>
      </div>
    </div>
    <div class="row">
      <div class="cell">
        {#if timer}
          <div class="row">
            <div class="cell">
              <Timer
              size="bigger"
                {minutes}
                {seconds}
                {isStop}
                makeBold={false}
                onTimerEnd={handleTimerEnd}
                on:timerstart={handleTimerStart}
                auto={true}
              />
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else if show == "result"}
  <div class="container pt-5">
    <div class="row mt-5 text-center justify-content-center">
      <div class="col-12" style="background-color: gray;">
        <h1 style="font-size: 40px;" class="pt-4 pb-4">{pool.poolName}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-3 red text-center">
        <h1 style="font-size: 90px;font-weight:700" class="pt-4 pb-4">{Number(result.total).toFixed(2)}</h1>
      </div>
      
      <div class="col-6">
        <h1 style="font-size: 50px;" class="pt-4 pb-4">{athlete.name || "test athlete name"}</h1>
        <h1 style="font-size:60px" class="pl-3 pr-3 pt-3 pb-3">
          <img
            src={club.flag || "images/HAWKtm.png"}
            class="flag mr-3 pt-4 pb-4 pr-2 pl-2"
            alt="flag"
          />
          {club.clubName || "test club name"}
        </h1>
      </div>
      <div class="col-3">
        <img style="height:300px; width: 300px" class="float-right qrcode" src="images/qr.jpeg" alt="" />
      </div>
    </div>

    <div class="mt-2">
      <span class="s-h3 soft-border">Scores</span>
      {#each judges as judge}
        <span id={"ap" + judge.id} style="font-size: 60px;" class="s-h3 soft-border pt-3 pb-3 s-border"
          >{judge.RESULT || ""}</span
        >
      {/each}
      <span style="font-size: 70px" class="s-h3 soft-border  pt-3 pb-3">
        {Number(result.total).toFixed(2)}
      </span>
    </div>
    <div class="row">
      <div class="col-12">
        <h1 class="text-right" style="color: whitesmoke;">
          {athlete.pool_entries.kata}
        </h1>
      </div>
    </div>
  </div>
{:else if show == "final"}
  <div class="container mb-4 pb-4">
    <div style="background-color: gray;" class="row mt-5">
      <div class="cell-12">
        <h1>{finalResult.poolName}</h1>
      </div>
    </div>
    <div class="row border mt-2">
      <div class="cell-9" />
      <div class="cell-3 text-center">
        <div class="row">
          <div class="cell-12 border">
            <h1>TOTAL</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="cell-7 text-center">
        <h1>{finalResult.entries[0].name}</h1>
      </div>
      <div class="cell-5" />
    </div>
    <div class="row">
      <div class:bg-red={finalResult.entries[0].belt =='red'} 
      class:bg-blue={finalResult.entries[0].belt =='blue'} class="cell-9 fg-white text-center">
        <h1>{finalResult.entries[0].club.clubName}</h1>
      </div>
      <div class="cell-3 text-center">
        <div class="row">
          <div class="cell-12 border">
            <h1>{ Number(finalResult.entries[0].pool_entries.total ).toFixed(2)  }</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="cell-7 text-center">
        <h1>{finalResult.entries[1].name}</h1>
      </div>
      <div class="cell-5" />
    </div>
    <div class="row">
      <div class:bg-red={finalResult.entries[1].belt =='red'}
       class:bg-blue={finalResult.entries[1].belt =='blue'} class="cell-9  fg-white text-center">
        <h1>{finalResult.entries[1].club.clubName}</h1>
      </div>
      <div class="cell-3 text-center">
        <div class="row">
          <div class="cell-12 border">
            <h1>{ Number(finalResult.entries[1].pool_entries.total ).toFixed(2)  }</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
  {:else if show == "show-final"}
  <FinalShow pool={finalScreen}></FinalShow>
{:else}
  <div class="container" style="background-color: black;">
    <div class="text-center justify-content-center row">
      <div class="col-8">
        <br />
        <!-- svelte-ignore a11y-missing-content -->
        <h1 class="text-uppercase" style="color: red; font-weight: 800;" />
      </div>
    </div>
    <div class="p-3 row">
      <div class="col-5">
        <div
          class="justify-content-center text-center p-4 font-weight-bolder"
          style="background-color: yellow; color: red; height: 230px;"
        >
          <h1 style="font-size: 130px; font-weight: 800;">0.00</h1>
          <p
            class="float-right text-center align-self-end h1 font-weight-bolder p-4 mr-0"
            style="background-color: red; color: yellow; font-size: 50px;"
          >
            1
          </p>
        </div>
      </div>
      <div
        class="justify-content-end text-center pt-4 text-white font-weight-bolder col-5"
      >
        <span class="font-size-18">0.7 TECHNICAL</span>&nbsp;&nbsp;<span
          class="font-size-18">0.3 ATHLETIC</span
        >
      </div>
      <div class="col-2" />
    </div>
    <br />
    <div class="text-center justify-content-center row">
      <div class="text-center col-8">
        <!-- svelte-ignore a11y-missing-content -->
        <h1 class="text-uppercase" style="color: red; font-size: 40px;" />
      </div>
    </div>
    <br />
    <div class="p-4 row">
      <div class="col-4">
        <div class="pl-4" style="border-left: 1px solid red;">
          <!-- svelte-ignore a11y-missing-content -->
          <h1 style="color: white;" />
        </div>
      </div>
      <div class="col-4">
        <img
          class="img-fluid"
          src="images/HAWKtm.png"
          alt="state-flag"
          width="500"
        />
      </div>
      <div class="col-4">
        <div class="pr-4 text-right" style="border-right: 1px solid red;">
          <!-- svelte-ignore a11y-missing-content -->
          <h1 style="color: white;" />
        </div>
      </div>
    </div>
    <br />
  </div>
{/if}

<style>
 
.kata h1 {
  font-size: 3.45vw;
  font-weight: 600;
}
  .flag {
    width: 90px;
  }
  .box {
    margin-top: 10%;
  }
  .category {
    font-size: 2 rem;
    color: white;
    font-weight: 600;
  }
  .red {
    background-color: red;
  }
  .qrcode {
    width: 100px;
  }
  .s-border {
    border-left: 2px solid white;
    border-right: 2px solid white;
  }
  .soft-border {
    padding-left: 12px;
    padding-right: 12px;
  }
  .s-h3 {
    font-size: 25px;
    font-weight: 500;
  }
</style>
