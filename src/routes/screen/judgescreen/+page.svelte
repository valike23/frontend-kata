<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from '$app/environment';
  import { socket } from '$lib/socket';
  import { HttpHelper } from "$lib/helpers/http.helper";
  import type { Ijudge } from "$lib/interfaces/competition.interface";
  let isLogged = false;
  let judge: Ijudge = { judgeName: "", password: "" };
  let scores = 7.0;
  let screen = "";
  let pool: any = {};
  let athlete = {
    id: 1,
    name: "John Doe",
    club: { name: "Hawk", flag: "images/HAWKtm.png" }
  };
  let Metro: any;
  let win: any;

  const disqualify = async () => {
    if (confirm("Do you want to disqualify this athlete?")) {
      await uploadScore(0);
    }
  };

  const submitScore = async () => {
    const input = document.getElementById("scores") as HTMLInputElement;
    scores = input ? Number(input.value) : scores;
    if (scores === 0) {
      await disqualify();
      return;
    }
    if (confirm(`Upload a score of ${scores}?`)) {
      await uploadScore(scores);
    }
  };

  const uploadScore = async (value: number) => {
    if(!socket) return;
    try {
      const judgeResult = {
        entryId: athlete.id,
        RESULT: value,
        judgeId: judge.id,
        poolId: pool.id
      };
      const form = new FormData();
      form.append("judge", JSON.stringify(judgeResult));
      const { data } = await HttpHelper.POST<any, any>(`api/judges/pool`, form);
      if (data) {
        await win.Swal.fire({ icon: "success", title: "Success", text: "Scores uploaded" });
        socket.emit("judge scores", judgeResult);
        scores = 7.0;
        screen = "";
      }
    } catch (e) {
      console.error(e);
      win.Swal.fire({ icon: "error", title: "Oops!", text: "Something went wrong. Please contact support." });
    }
  };

  const reset = () => {
    scores = 7.0;
    const el = document.getElementById("scores");
    const plugin = Metro.getPlugin(el, "spinner");
    plugin.val(scores);
  };

  const login = async () => {
    try {
      const response = await HttpHelper.POST<Ijudge, Ijudge>(`api/application/judge/login`, judge);
      console.log(response);

      if (response.statusCode == 200) {
        await win.Swal.fire({ icon: "success", title: "Logged in", text: "Login successful" });
        sessionStorage.setItem("kataUser", JSON.stringify(response.data));
        isLogged = true;
        judge = response.data;
      } else {
        const res: any = response;
        win.Swal.fire({ icon: "error", title: "Error", text: res?.data?.err?.message });
        return;
      }
    } catch {
      win.Swal.fire({ icon: "error", title: "Oops!", text: "Something went wrong. Please contact support." });
    }
  };

  const disqualified = ()=>{}

  onMount(() => {
    win = window;
    Metro = win.Metro;
    if(!socket) return;
    const stored = sessionStorage.getItem("kataUser");
    if (stored) {
      isLogged = true;
      judge = JSON.parse(stored);
    }
    if (browser) {
      socket.on("connect", () => console.log("Socket connected:", socket?.id));
      socket.on("start judge", (data: any) => {
        athlete = data.athlete;
        pool = data.pool;
        screen = "judge";
        scores = 7.0;
        setTimeout(() => {
          const el = document.getElementById("scores");
          win.$(el).on("plusClick", () => {
            const spinner = Metro.getPlugin(el, "spinner");
            if (spinner.val() < 5) spinner.val(5);
          });
          win.$(el).on("minusClick", () => {
            const spinner = Metro.getPlugin(el, "spinner");
            if (spinner.val() < 5) spinner.val(0);
          });
        }, 3000);
      });
    }
  });
</script>

<svelte:head>
  <title>KATA:: {isLogged ? judge.judgeName : 'Kata Judge Screen'}</title>
</svelte:head>

<!-- Rest of your markup unchanged -->

<div class="container-fluid">
  {#if isLogged}
    {#if screen == "judge"}
      <div class="container" style="background-color: black;">
        <div class="p-3 row">
          <div class="cell-5">
            <div
              class="justify-content-center text-center p-4 font-weight-bolder"
              style="background-color: yellow; color: red;"
            >
              <h1 style="font-size: 36px; font-weight: 800;">
                {judge.judgeName}
              </h1>
            </div>
          </div>
          <div
            class="justify-content-end text-center pt-4 text-white font-weight-bolder cell-5"
          >
            <span class="font-size-18"> RESULT</span>&nbsp;&nbsp;
          </div>
          <div class="cell-2">
            <button class="btn btn-warning btn-block btn btn-secondary"
              >Logout</button
            >
          </div>
        </div>
        <br />
        <div class="text-center justify-content-center row">
          <div class="cell-4">
            <h1 class="text-uppercase" style="color: red;">{pool.poolName}</h1>
          </div>
        </div>
        <br />
        <div class="p-4 row">
          <div class="cell-4">
            <div class="pl-4" style="border-left: 1px solid red;">
              <h1>{athlete.name}</h1>
            </div>
          </div>
          <div class="cell-4">
            <img
              class="img-fluid"
              src={athlete.club.flag}
              alt="state-flag"
              width="500"
            />
          </div>
          <div class="cell-4">
            <div class="pr-4 text-right" style="border-right: 1px solid red;">
              <h1 />
            </div>
          </div>
        </div>
        <br />
        <div class="mx-5 row">
          <div class="p-4 col">
            <div class="row">
              <div
                class="p-2 cell-12 cell-sm-12"
                style="border-right: 1px solid red;"
              >
                <label
                  class="font-weight-bold h1"
                  for="tech"
                  style="color: white;"
                  >Scores
                </label>&nbsp;&nbsp;

                <input
                  style="background-color: white;"
                  class="font-weight-bold text-right"
                  type="text"
                  data-role="spinner"
                  data-min-value="0"
                  data-max-value="10"
                  id="scores"
                  bind:value={scores}
                  data-step=".1"
                  data-fixed="1"
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div class="text-center justify-content-center row">
          <div class="cell-4">
            <button
              type="button"
              on:click={submitScore}
              class="btn btn-warning btn-block btn-lg btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Submit Score</button
            >&nbsp;&nbsp;
          </div>
          <div class="cell-4 text-center">
            <button
              type="button"
              on:click={reset}
              class="btn btn-warning btn-block btn-lg btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Reset</button
            >&nbsp;&nbsp;
          </div>
          <div class="float-right cell-4">
            <button
              type="button"
              on:click={disqualified}
              class="btn btn-danger btn-block btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Dis-qualify</button
            >
          </div>
        </div>
        <br />
      </div>
    {:else}
      <div class="container" style="background-color: black;">
        <div class="p-3 row">
          <div class="col-5">
            <div
              class="justify-content-center text-center p-4 font-weight-bolder"
              style="background-color: yellow; color: red;"
            >
              <h1 style="font-size: 36px; font-weight: 800;">
                {judge.judgeName}
              </h1>
            </div>
          </div>
          <div
            class="justify-content-end text-center pt-4 text-white font-weight-bolder col-5"
          >
            <span class="font-size-18">SCORES</span>&nbsp;&nbsp;
          </div>
          <div class="col-2">
            <button class="btn btn-warning btn-block btn btn-secondary"
              >Logout</button
            >
          </div>
        </div>
        <br />
        <div class="text-center justify-content-center row">
          <div class="col-4">
            <h1 class="text-uppercase" style="color: red;" />
          </div>
        </div>
        <br />
        <div class="p-4 row">
          <div class="col-4">
            <div class="pl-4" style="border-left: 1px solid red;"><h1 /></div>
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
              <h1 />
            </div>
          </div>
        </div>
        <br />
        <div class="mx-5 row">
          <div class="p-4 col">
            <div class="row">
              <div class="p-2 col-12" style="border-right: 1px solid red;">
                <label
                  class="font-weight-bold h1"
                  for="tech"
                  style="color: white;">SCORES 0</label
                >&nbsp;&nbsp;<input
                  min="0.0"
                  max="10.0"
                  disabled
                  step="0.1"
                  id="technique"
                  name="technique"
                  placeholder="0.0"
                  class="form-control font-weight-bold"
                  type="number"
                  value="0"
                  style="border: 1px solid red; background-color: transparent; font-size: 28px; color: white;"
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div class="text-center justify-content-center row">
          <div class="col-4">
            <button
              type="button"
              class="btn btn-warning btn-block btn-lg btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Submit Score</button
            >&nbsp;&nbsp;
          </div>
          <div class="col-4">
            <button
              type="button"
              class="btn btn-warning btn-block btn-lg btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Reset</button
            >&nbsp;&nbsp;
          </div>
          <div class="float-right col-4">
            <button
              type="button"
              class="btn btn-danger btn-block btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Disqualify</button
            >
          </div>
        </div>
        <br />
      </div>
    {/if}
  {:else}
    <div class="container">
      <div class="row">
        <div class="cell-12 centered">
          <form on:submit|preventDefault={login} class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Login Judge</h5>
            </div>
            <div class="modal-body">
              <div>Please login to continue</div>
              <div class="cell-12 cell-sm-6">
                <div class="form-group">
                  <label for="name">Nick Name</label>
                  <input
                    bind:value={judge.judgeName}
                    required
                    data-role="input"
                    class="form-control"
                    type="text"
                  />
                </div>
              </div>
              <div class="cell-12 cell-sm-6">
                <div class="form-group">
                  <label for="name">password </label>
                  <input
                    bind:value={judge.password}
                    required
                    data-role="input"
                    class="form-control"
                    type="password"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <input type="submit" class="button primary" />
            </div>
          </form>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .centered {
    margin-left: auto;
    margin-top: auto;
    margin-right: auto;
    padding-right: auto;
  }
  .bold-text {
    margin-top: auto;
    font-size: 1.3 rem;
    font-weight: 600;
  }
  .form-control {
    border: 1px solid gray;
  }
  .input {
    width: 90%;
    height: 70px;
    font-size: 20px;
    font-weight: 700;
    border-radius: 12px;
    border: 2px solid blue;
    text-align: center;
  }
  p {
    font-size: 1.2rem;
    font-weight: 500;
  }
  @media only screen and (max-width: 600px) {
    .input-container {
      width: 80vw;
      margin: auto;
    }
  }
  /* Small devices (portrait tablets and large phones, 600px and up) */
  @media only screen and (min-width: 600px) {
    .input-container {
      width: 70vw;
      margin: auto;
    }
  }
  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (min-width: 768px) {
    .input-container {
      width: 60vw;
      margin: auto;
    }
  }
  /* Large devices (laptops/desktops, 992px and up) */
  @media only screen and (min-width: 992px) {
    .input-container {
      width: 50vw;
      margin: auto;
    }
  }
  /* Extra large devices (large laptops and desktops, 1200px and up) */
  @media only screen and (min-width: 1200px) {
    .input-container {
      width: 50vw;
      margin: auto;
    }
  }
</style>
