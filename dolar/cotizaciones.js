let lista = document.getElementById("lista");
let placehoders = document.querySelectorAll("#placeholder");

async function getCotizaciones() {
  const response = await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales');
  const data = await response.json();

  // html prototype
  // <li class="cotizacion" id="dolarBlue">
  //   <div class="icon">&blacktriangle;</div>
  //   <h2>Dolar Blue</h2>
  //   <h3>180.00</h3>
  // </li>

  let emojis = {
    "Dolar Oficial": "💵",
    "Dolar Blue": "💸",
    "Dolar Soja": "🌾",
    "Dolar Contado con Liqui": "🏦",
    "Dolar Bolsa": "📈",
    "Bitcoin": "🪙",
    "Dolar turista": "🏖️",
    "Dolar": "💲",
    "Argentina": "🇦🇷",
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


    // filter out "Dolar" and "Argentina"
    if (item.casa.nombre == "Dolar" || item.casa.nombre == "Argentina") {
      return;
    }

    let li = document.createElement("li");
    li.classList.add("cotizacion");
    li.id = item.casa.nombre;

    let h2 = document.createElement("h2");
    h2.innerHTML = `${emojis[item.casa.nombre]} ${item.casa.nombre}`;

    // change name of "Dolar Contado con Liqui" to "Dolar CCL"
    if (item.casa.nombre == "Dolar Contado con Liqui") {
      h2.innerHTML = `${emojis[item.casa.nombre]} Dolar CCL`;
    }

    let div = document.createElement("div");
    div.classList.add("icon");
  
    if (variation > 0) {
      div.innerHTML = "&blacktriangle;";
      div.classList.add("up");
    } else if (variation < 0) {
      div.innerHTML = "&blacktriangledown;";
      div.classList.add("down");
    } else {
      div.innerHTML = "=";
      div.classList.add("neutral");
    }

    
    let h3 = document.createElement("h3");
    h3.innerHTML = promedio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    
    li.appendChild(h2);
    li.appendChild(h3);
    li.appendChild(div);
    lista.appendChild(li);
  });
}

getCotizaciones().then(() => {
  placehoders.forEach(placeholder => {
    placeholder.remove();
  });
} );