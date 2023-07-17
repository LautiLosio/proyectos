const btn = document.querySelectorAll(".btn");
btn.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (e.target.classList.contains("clear")) {
      clearScreen();
    } else if (e.target.classList.contains("equal")) {
      calculate();
    } else {
      display(e.target.value);
    } 
  });
});


// This function clear all the values
function clearScreen() {
  const resultBox = document.getElementById("result");
  let value = parseFloat(resultBox.innerHTML);
  console.log(value);
  resultBox.innerHTML = "";
}

// This function display values
function display(value) {
  const resultBox = document.getElementById("result");
  resultBox.innerHTML += value;
}

const formatter = new Intl.NumberFormat('es-AR');

// This function evaluates the expression and returns result
function calculate() {
  const resultBox = document.getElementById("result");
  const previousBox = document.getElementById("previous");
  
  let equation = resultBox.innerHTML;
  if (equation == "") {
    equation = previousBox.innerHTML;
  }
  let result = eval(equation);

  previousBox.innerHTML = equation;
  resultBox.innerHTML = result;
}

document.addEventListener("keydown", (e) => {
  const key = e.key;
  console.log(key);
  const allowedKeys = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "-",
    "*",
    "/",
    ".",
    "Backspace",
    "Enter",
    "Escape",
  ];
  if (allowedKeys.includes(key)) {
    switch (e.key) {
      case "Backspace":
        clearScreen();
        break;
      case "Enter":
        calculate();
        break;
      case "Escape":
        clearScreen();
        break;
      default:
        display(e.key);
        break;
    }
  }
} );

// prevent the user from entering any other character except numbers and operators
document.addEventListener("keypress", (e) => {
  const key = e.key;
  const allowedKeys = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "-",
    "*",
    "/",
    ".",
  ];
  if (!allowedKeys.includes(key)) {
    e.preventDefault();
  }
} );

