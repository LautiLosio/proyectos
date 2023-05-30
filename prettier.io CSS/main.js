const container = document.querySelector(".container");

container.addEventListener("click", (e) => {
  container.classList.toggle("in");
  container.classList.toggle("out");
});
