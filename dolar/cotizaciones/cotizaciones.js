let lista = document.getElementById("lista");
let placehoders = document.querySelectorAll("#placeholder");

let cotizaciones = [];

async function getCotizaciones() {
  const [dolar, valoresPrincipales, others] = await Promise.all([
    fetch('https://www.dolarsi.com/api/api.php?type=dolar'),
    fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales'),
    fetch('https://www.dolarsi.com/api/api.php?type=cotizador')
  ]).then(responses => Promise.all(responses.map(r => r.json())));

  let data = [...dolar, ...valoresPrincipales, ...others];


  processData(data);
}

function processData(data) {
  let emojis = {
    "Oficial": "💵",
    "Blue": "💸",
    "Dolar Contado con Liqui": "🇺🇲",
    "Mayorista Bancos": "💰️",
    "BCRA de Referencia": "🏦",
    "Dolar Bolsa": "📈",
    "Bitcoin": "🪙",
    "Dolar turista": "🏖️",
    "Euro": "🇪🇺",
    "Real": "🇧🇷"
  }

  data.forEach(item => {
    let compra = parseFloat(item.casa.compra.replace(".", "").replace(",", "."));
    let venta = parseFloat(item.casa.venta.replace(".", "").replace(",", "."));
    let promedio = calculatePromedio(compra, venta, item.casa.compra, item.casa.venta);
    let variation = parseFloat(item.casa.variacion?.replace(".", "").replace(",", "."));

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

    let li = createCotizacionElement(item.casa.nombre, emojis);
    let textContainer = createTextContainerElement();
    let compraText = createCompraVentaElement("compra", compra);
    let ventaText = createCompraVentaElement("venta", venta);
    let valueContainer = createValueContainerElement();
    let value = createValueElement(promedio);
    let icon = createIconElement(variation);

    appendElements(li, textContainer, compraText, ventaText, valueContainer, value, icon);
    addClickEventListener(li, compraText, ventaText);
    appendToLista(li);

    cotizaciones.push({
      nombre: item.casa.nombre,
      compra: compra,
      venta: venta,
      promedio: promedio,
    });
  });
}

function calculatePromedio(compra, venta, compraValue, ventaValue) {
  if (compraValue == 0) {
    return venta;
  } else if (ventaValue == 0) {
    return compra;
  }

  if (compraValue == "No Cotiza") {
    if (venta > 0) {
      return venta;
    } else {
      return 'No cotiza';
    }
  }

  if (ventaValue == "No Cotiza") {
    if (compra > 0) {
      return compra;
    } else {
      return 'No cotiza';
    }
  }

  return (compra + venta) / 2;
}

function createCotizacionElement(nombre, emojis) {
  let li = document.createElement("li");
  li.classList.add("cotizacion");
  li.id = nombre;

  let name = document.createElement("h2");
  name.innerHTML = `${emojis[nombre]} ${nombre}`;

  if (nombre == "Dolar Contado con Liqui") {
    name.innerHTML = `${emojis[nombre]} Dolar CCL`;
  }

  li.appendChild(name);

  return li;
}

function createTextContainerElement() {
  let textContainer = document.createElement("div");
  textContainer.classList.add("text-container");

  return textContainer;
}

function createCompraVentaElement(id, value) {
  let element = document.createElement("h2");
  element.innerHTML = `${id.charAt(0).toUpperCase() + id.slice(1)}: ${value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`;
  element.classList.add("compra-venta");
  element.id = id;

  return element;
}

function createValueContainerElement() {
  let valueContainer = document.createElement("div");
  valueContainer.classList.add("value-container");

  return valueContainer;
}

function createValueElement(value) {
  let element = document.createElement("h3");
  element.innerHTML = value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  return element;
}

function createIconElement(variation) {
  let element = document.createElement("h3");

  if (variation > 0) {
    element.innerHTML = "&blacktriangle;";
    element.classList.add("up");
  } else if (variation < 0) {
    element.innerHTML = "&blacktriangledown;";
    element.classList.add("down");
  } else {
    element.innerHTML = "=";
    element.classList.add("neutral");
  }

  return element;
}

function appendElements(li, textContainer, compraText, ventaText, valueContainer, value, icon) {
  textContainer.appendChild(compraText);
  valueContainer.appendChild(value);
  valueContainer.appendChild(icon);
  textContainer.appendChild(valueContainer);
  textContainer.appendChild(ventaText);
  li.appendChild(textContainer);
}

function addClickEventListener(li, compraText, ventaText) {
  li.addEventListener("click", () => {
    compraText.classList.toggle("show");
    ventaText.classList.toggle("show");
  });
}

function appendToLista(li) {
  lista.appendChild(li);
}

getCotizaciones().then(() => {
  placehoders.forEach(placeholder => {
    placeholder.remove();
  });
});
