<script lang="js">
  import { onMount } from 'svelte';
  import './style.css';
  import * as Roulette from './roulette.js';
  import { enhance } from '$app/forms';

  let container;
  let form;
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

  function handleSpin() {
    // Trigger the spin animation after form submission response is received
    setTimeout(() => {
      if (form?.result === "success") {
        Roulette.spinWheelWithResult(form.value, () => {
          isSpinning = false;
        });
      } else {
        isSpinning = false;
      }
    }, 100);
  }

  function handleSubmit() {
    // Get bets from betting board and populate hidden form fields
    const simpleBets = Roulette.getSimpleBets();
    const formElement = document.querySelector("form");
    
    // Set hidden input values
    Object.keys(simpleBets).forEach(betType => {
      let input = formElement.querySelector(`input[name="${betType}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = betType;
        formElement.appendChild(input);
      }
      input.value = simpleBets[betType];
    });

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
    use:enhance={() => {
      handleFormSubmit();
      return async ({ result }) => {
        if (result.type === "success") {
          form = result.data;
          handleSpin();
        }
      };
    }}
  >
  </form>
  <div id="container" class="w-full h-full"></div>
</main>

