// select input name="has-interes" 
// select interes-input
// if has-interes value is true" show interes-input
// else hide interes-input
hasInteres = document.querySelectorAll('input[name="has-interes"]');
interesInput = document.querySelector('.interes-input');

hasInteres.forEach(function (input) {
  input.addEventListener('change', function() {
    console.log(input.value);
    if (input.value === 'true') {
        interesInput.classList.remove('hidden');
    }
    else {
        interesInput.classList.add('hidden');
    }
  });
});
  
