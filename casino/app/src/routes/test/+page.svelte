<script lang="js">
  import { onMount } from 'svelte';
  import './style.css';
  import * as Roulette from './roulette.js';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';

  let container;
  let form = $state();
  let isSpinning = $state(false);

  onMount(() => {
    container = document.getElementById("container");
    Roulette.setContainerRef(container);
    Roulette.initializeGame();

    // Set up the spin button to submit the form
    setTimeout(() => {
      Roulette.setupSpinButtonSubmit(() => {
        handleSubmit();
      });
    }, 100);
  });

  function handleSpin(update) {
    // Trigger the spin animation after form submission response is received
    if (form?.success) {
      Roulette.spinWheelWithResult(form.resultNumber, async () => {
        isSpinning = false;
        // TODO: Is this good idea? Invalidates entire page, but we need to update the balance and bets after the spin
//        await invalidateAll();
        update();

      });
    } else {
      isSpinning = false;
    }
  }

  function handleSubmit() {
    // Get the actual bets array and add to form
    const betsArray = Roulette.getBetsArray();
    const formElement = document.querySelector("form");
    
    // Create or update hidden input with bets JSON
    let betsInput = formElement.querySelector(`input[name="bets"]`);
    if (!betsInput) {
      betsInput = document.createElement("input");
      betsInput.type = "hidden";
      betsInput.name = "bets";
      formElement.appendChild(betsInput);
    }
    betsInput.value = JSON.stringify(betsArray);

    // Submit the form
    formElement.requestSubmit();
  }

  function handleFormSubmit() {
    isSpinning = true;
  }
</script>

<main class="md:pl-48 md:pr-48 pt-20 pb-20 min-h-screen">
  <form
    method="POST"
    action="?/spin"
    use:enhance={() => {
      handleFormSubmit();
      return async ({ result, update }) => {
        console.log(result);
        if (result.type === "success") {
          form = result.data;
          handleSpin(update);
        }
      };
    }}
  >
  </form>
  <div id="container" class="w-full h-full"></div>
</main>

