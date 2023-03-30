let lista = document.getElementById("lista");
let placehoders = document.querySelectorAll("#placeholder");

async function getCotizaciones() {
  const dolar = await fetch('https://www.dolarsi.com/api/api.php?type=dolar');
  const valoresPrincipales = await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales');


  let data =  await Promise.all([dolar, valoresPrincipales]) // wait for both promises to resolve
    .then(responses => Promise.all(responses.map(r => r.json()))) // parse each response as JSON
    .then(data => {
      return data[0].concat(data[1]);
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

    const filterList = [
      "Dolar",
      "Argentina",
      "Dolar Oficial",
      "Dolar Blue",
      "Dolar Soja",
      "Banco Nación Billete",
      "Banco Nación Público"
    ];


    // filter out the items in the filterList
    if (filterList.includes(item.casa.nombre)) {
      return;
    }

    let li = document.createElement("li");
    li.classList.add("cotizacion");
    li.id = item.casa.nombre;

    let name = document.createElement("h2");
    name.innerHTML = `${emojis[item.casa.nombre]} ${item.casa.nombre}`;

    // change name of "Dolar Contado con Liqui" to "Dolar CCL"
    if (item.casa.nombre == "Dolar Contado con Liqui") {
      name.innerHTML = `${emojis[item.casa.nombre]} Dolar CCL`;
    }

    let div = document.createElement("div");

    let icon = document.createElement("h3");
    div.classList.add("icon");
  
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
    
    li.appendChild(name);
    div.appendChild(icon);
    div.appendChild(value);
    li.appendChild(div);
    lista.appendChild(li);
  });
}

getCotizaciones().then(() => {
  placehoders.forEach(placeholder => {
    placeholder.remove();
  });
} );