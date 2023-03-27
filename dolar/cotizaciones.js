let lista = document.getElementById("lista");
let placehoders = document.querySelectorAll("#placeholder");

async function getCotizaciones() {
  const response = await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales');
  const data = await response.json();

  // html prototype
  // <li class="cotizacion" id="dolarBlue">
  //   <h2>Dolar Blue</h2>
  //   <h3>180.00</h3>
  // </li>

  let emojis = {
    "Dolar Oficial": "💵",
    "Dolar Blue": "💸",
    "Dolar Soja": "🌾",
    "Dolar Contado con Liqui": "💳",
    "Dolar Bolsa": "📈",
    "Bitcoin": "🪙",
    "Dolar turista": "🏖️",
    "Dolar": "💲",
    "Argentina": "🇦🇷",
  }

  data.forEach(item => {
    let cotizacion = document.createElement("li");
    cotizacion.classList.add("cotizacion");
    cotizacion.id = item.casa.nombre;

    let nombre = document.createElement("h2");
    nombre.innerHTML = item.casa.nombre;
    if (item.casa.nombre == "Dolar Contado con Liqui") {
      nombre.innerHTML = "Dolar CCL";
    }
    nombre.prepend(emojis[item.casa.nombre] + " ");

    if (item.casa.nombre == "Dolar" || item.casa.nombre == "Argentina") {
      return;
    }

    let promedio = 0;

    if (item.casa.compra != "No Cotiza" && item.casa.venta != "No Cotiza") {
      // text comes formatted as "1.900,00" and needs to be converted to "1900.00"    
      let compra = parseFloat(item.casa.compra.replace(".", "").replace(",", "."));
      let venta = parseFloat(item.casa.venta.replace(".", "").replace(",", "."));
      if (isNaN(compra)) {
        compra = 0;
      }
      if (isNaN(venta)) {
        venta = 0;
      }
  
      if (compra != 0 && venta != 0) {
        promedio = (compra + venta) / 2;
      } else if (compra == 0) {
        promedio = venta;
      } else if (venta == 0) {
        promedio = compra;
      }
    } else {
      console.log(item.casa.nombre + " " + item.casa.compra + " " + item.casa.venta);
      let venta = parseFloat(item.casa.venta.replace(".", "").replace(",", "."));
      if (item.casa.venta > 0) {
        console.log(item.casa.nombre + " " + item.casa.venta);
        let venta = parseFloat(item.casa.venta.replace(".", "").replace(",", "."));
        promedio = venta;
      } else {
        promedio = 'No cotiza';
      }
    }



    let valor = document.createElement("h3");
    valor.innerHTML = promedio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    cotizacion.appendChild(nombre);
    cotizacion.appendChild(valor);

    lista.appendChild(cotizacion);
  });
}

getCotizaciones().then(() => {
  placehoders.forEach(placeholder => {
    placeholder.remove();
  });
} );