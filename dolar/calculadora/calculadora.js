let dolarInput = document.getElementById("dolarInput");
let pesoInput = document.getElementById("pesoInput");
let dolarType = document.getElementById("dolarType");

let cotizaciones = [];
let selectedDolarValue;
let lastTouchedInput;

// Carga de cotizaciones y seleccion de dolar
getCotizaciones().then(() => {
  selectedDolarValue = cotizaciones.find(item => item.nombre == dolarType.value);
});

// Detector de cambio de tipo de dolar
dolarType.addEventListener("change", function() {
  selectedDolarValue = cotizaciones.find(item => item.nombre === dolarType.value);

  if (lastTouchedInput == dolarInput) {
    calcluateValue(dolarInput, pesoInput);
  } else {
    calcluateValue(pesoInput, dolarInput);
  }
});


// Calculo de dolar a peso
dolarInput.addEventListener("input", function() {
  calcluateValue(dolarInput, pesoInput);
  lastTouchedInput = dolarInput;
});

// Calculo de peso a dolar
pesoInput.addEventListener("input", function() {
  calcluateValue(pesoInput, dolarInput);
  lastTouchedInput = pesoInput;
});

// Formateo de numeros al salir del input
for (let input of [dolarInput, pesoInput]) {

  let otherInput = input == dolarInput ? pesoInput : dolarInput;

  input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      input.blur();
    }
  });

  input.addEventListener("blur", function() {
    input.value = formatNumber(input.value, otherInput);
  });

}

// ------- Funciones -------

// Calculo de dolar a peso y viceversa
function calcluateValue(touchedInput, otherInput) {
  if (touchedInput.value == "") {
    otherInput.value = "";
    return;
  }

  let value = parseFloat(touchedInput.value.replace(".", "").replace(",", "."));
  let result;

  if (touchedInput == pesoInput) {
    result = value / selectedDolarValue.compra;
  } else {
    result = value * selectedDolarValue.venta;
  }

  result = formatNumber(result, otherInput);

  otherInput.value = result;
}

// Formateo de numeros
function formatNumber(number, affectedInput) {
 console.log(number);

 return number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Carga de cotizaciones
async function getCotizaciones() {
  const [dolar, valoresPrincipales, others] = await Promise.all([
    fetch('https://www.dolarsi.com/api/api.php?type=dolar'),
    fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales'),
    fetch('https://www.dolarsi.com/api/api.php?type=cotizador')
  ]).then(responses => Promise.all(responses.map(r => r.json())));

  let data = [...dolar, ...valoresPrincipales, ...others];

  processData(data);
}

// Procesamiento de cotizaciones (filtro y calculo de promedio)
async function processData(data) {
  data.forEach(item => {
    let compra = parseFloat(item.casa.compra.replace(".", "").replace(",", "."));
    let venta = parseFloat(item.casa.venta.replace(".", "").replace(",", "."));
    let promedio = calculatePromedio(compra, venta);

    const filterList = [  
      "Dolar",
      "Argentina",
      "Dolar Oficial",
      "Dolar Blue",
      "Dolar Soja",
      "Banco Nación Billete",
      "Banco Nación Público",
      "Libra Esterlina",
      "Peso Uruguayo",
      "Peso Chileno",
      "Guaraní"
    ];

    if (filterList.includes(item.casa.nombre)) {
      return;
    }

    cotizaciones.push({
      nombre: item.casa.nombre,
      compra: compra,
      venta: venta,
      promedio: promedio,
    });
  });
}
  
// Calculo de promedio
function calculatePromedio(compra, venta) {
  let promedio = (compra + venta) / 2;
  promedio = promedio.toFixed(2);
  promedio = promedio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return promedio;
}


