let lista = document.getElementById("lista");
let placehoders = document.querySelectorAll("#placeholder");

async function getCotizaciones() {
  const dolar = await fetch('https://www.dolarsi.com/api/api.php?type=dolar');
  const valoresPrincipales = await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales');
  const others = await fetch('https://www.dolarsi.com/api/api.php?type=cotizador');


  let data =  await Promise.all([dolar, valoresPrincipales, others])
    .then(responses => Promise.all(responses.map(r => r.json()))) // parse each response as JSON
    .then(data => {
      return data[0].concat(data[1]).concat(data[2]);
    }
  ); 
      
  // html prototype
  // <li class="cotizacion" id="dolarBlue">
  //   <div class="icon">&blacktriangle;</div>
  //   <h2>Dolar Blue</h2>
  //   <h3>180.00</h3>
  // </li>

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
  
  // text comes formatted as "1.900,00" and needs to be converted to "1900.00"    
  // if item.casa.compra == "No Cotiza" then use item.casa.venta only if venta > 0
  // if item.casa.venta == "No Cotiza" then use item.casa.compra only if compra > 0
  // if both == "No Cotiza" then use 0
  // if both > 0 then use (compra + venta) / 2

  data.forEach(item => {
    
    let compra = parseFloat(item.casa.compra.replace(".", "").replace(",", "."));
    let venta = parseFloat(item.casa.venta.replace(".", "").replace(",", "."));
    let promedio = (compra + venta) / 2;
    let variation = parseFloat(item.casa.variacion?.replace(".", "").replace(",", "."));

    if (item.casa.compra == 0) {
      promedio = venta;
    } else if (item.casa.venta == 0) {
      promedio = compra;
    }

    if (item.casa.compra == "No Cotiza") {
      if (venta > 0) {
        promedio = venta;
      } else {
        promedio = 'No cotiza';
      }
    }

    if (item.casa.venta == "No Cotiza") {
      if (compra > 0) {
        promedio = compra;
      } else {
        promedio = 'No cotiza';
      }
    }

    isNaN(compra) ? compra = 'No cotiza' : compra;
    isNaN(venta) ? venta = 'No cotiza' : venta;

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


    // filter out the items in the filterList
    if (filterList.includes(item.casa.nombre)) {
      return;
    }

    let li = document.createElement("li");
    li.classList.add("cotizacion");
    li.id = item.casa.nombre;

    let textContainer = document.createElement("div");
    textContainer.classList.add("text-container");

    let name = document.createElement("h2");
    name.innerHTML = `${emojis[item.casa.nombre]} ${item.casa.nombre}`;

    // change name of "Dolar Contado con Liqui" to "Dolar CCL"
    if (item.casa.nombre == "Dolar Contado con Liqui") {
      name.innerHTML = `${emojis[item.casa.nombre]} Dolar CCL`;
    }

    let icon = document.createElement("h3");
  
    if (variation > 0) {
      icon.innerHTML = "&blacktriangle;";
      icon.classList.add("up");
    } else if (variation < 0) {
      icon.innerHTML = "&blacktriangledown;";
      icon.classList.add("down");
    } else {
      icon.innerHTML = "=";
      icon.classList.add("neutral");
    }

    
    let value = document.createElement("h3");
    value.innerHTML = promedio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    let compraText = document.createElement("h2");
    compraText.innerHTML = `Compra: ${compra.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`;
    compraText.classList.add("compra-venta");
    compraText.id = "compra";

    let ventaText = document.createElement("h2");
    ventaText.innerHTML = `Venta: ${venta.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`;
    ventaText.classList.add("compra-venta");
    ventaText.id = "venta";

    let valueContainer = document.createElement("div");
    valueContainer.classList.add("value-container");

    
    li.appendChild(name);

    textContainer.appendChild(compraText);
    valueContainer.appendChild(value);
    valueContainer.appendChild(icon);
    textContainer.appendChild(valueContainer);
    textContainer.appendChild(ventaText);
    li.appendChild(textContainer);
    lista.appendChild(li);

    li.addEventListener("click", () => {
      compraText.classList.toggle("show");
      ventaText.classList.toggle("show");
    });
  });
}

getCotizaciones().then(() => {
  placehoders.forEach(placeholder => {
    placeholder.remove();
  });
} );