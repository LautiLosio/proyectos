let dolarBlue = document.getElementById("dolarBlue");
let dolarBlueCompra = document.getElementById("dolarBlueCompra");
let dolarBlueVenta = document.getElementById("dolarBlueVenta");

async function getDolarHoy() {
  const response = await fetch('https://www.dolarsi.com/api/api.php?type=dolar');
  const data = await response.json();

  let blue = data.find(item => item.casa.nombre === "Blue");
  
  let compra = parseFloat(blue.casa.compra);
  dolarBlueCompra.innerHTML = compra.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  let venta = parseFloat(blue.casa.venta);
  dolarBlueVenta.innerHTML = venta.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  let dolarHoy = (compra + venta) / 2;

  dolarBlue.innerHTML = dolarHoy.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

}

getDolarHoy();

let texts = [dolarBlue, dolarBlueCompra, dolarBlueVenta];

texts.forEach(text => {
  text.addEventListener("click", function() {
    window.getSelection().selectAllChildren(text);
  } );
});