let dolarBlue = document.getElementById("dolarBlue");
let dolarBlueCompra = document.getElementById("dolarBlueCompra");
let dolarBlueVenta = document.getElementById("dolarBlueVenta");
let scrollArrow = document.getElementById("arrow");
let ultimaActualizacion = document.getElementById("ultimaActualizacion");
let dolarBlueValues = {};

async function getDolarHoy() {
  const response = await fetch('https://www.dolarsi.com/api/api.php?type=dolar');
  const data = await response.json();

  let blue = data.find(item => item.casa.nombre === "Blue");

  let compra = parseFloat(blue.casa.compra);
  dolarBlueCompra.innerHTML = compra.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  let venta = parseFloat(blue.casa.venta);
  dolarBlueVenta.innerHTML = venta.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  let dolarHoy = (compra + venta) / 2;

  // Save the value of the dolar
  dolarBlueValues = {
    dolarBlueCompra: compra,
    dolarBlueVenta: venta,
    dolarBlue: dolarHoy
  }

  // Add the value of the dolar to the page
  dolarBlue.innerHTML = dolarHoy.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  // Add the value of the dolar to the window title
  document.title += " | " + dolarHoy.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

// Get the date of the last update
async function getLastUpdate() {
  const response = await fetch('https://www.dolarsi.com/api/api.php?type=ultima');
  const data = await response.json();
  
  console.log(data);

  let fecha = data[0].ultima.zona37.fecha;
  let hora = data[0].ultima.zona37.hora;
  console.log(fecha);
  console.log(hora);

  ultimaActualizacion.innerHTML = `Actualizado: ${fecha} - ${hora}`;
}

getDolarHoy();
getLastUpdate();

let texts = [dolarBlue, dolarBlueCompra, dolarBlueVenta];

texts.forEach(text => {
  text.addEventListener("click", function () {
    navigator.clipboard.writeText(dolarBlueValues[text.id])
    .then(() => {
      Swal.fire({
        title: 'Copiado!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'top',
        toast: true,
        color: '#40612a',
        background: '#f0ffdd'
      })
    })
  });
});

// Scroll to bottom
scrollArrow.addEventListener("click", function () {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
});