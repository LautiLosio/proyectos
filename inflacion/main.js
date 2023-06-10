MicroModal.init();

hasInteres = document.querySelectorAll('input[name="has-interes"]');
interesInput = document.querySelector("#interes");

hasInteres.forEach(function (input) {
  input.addEventListener("change", function () {
    console.log(input.value);
    if (input.value === "true") {
      interesInput.removeAttribute("disabled");
      interesInput.classList.remove("disabled");
    } else {
      interesInput.setAttribute("disabled", "disabled");
      interesInput.classList.add("disabled");
    }
  });
});

calcuarBtn = document.querySelector("#calcular-btn");
calcularBtn.addEventListener("click", function (e) {
  e.preventDefault();
  MicroModal.show("modal-1");
});
