const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = 2000;
let height = canvas.height = 2000;
let lowRes = false;

let x = -0.5;
let y = 0;
let zoom = 0.3;
let max_iter = 50;

function mandelbrot(c) {
  let z = {re: 0, im: 0};
  let n = 0;
  while (n < max_iter && z.re ** 2 + z.im ** 2 < 4) {
    let re = z.re ** 2 - z.im ** 2 + c.re;
    let im = 2 * z.re * z.im + c.im;
    z.re = re;
    z.im = im;
    n++;
  }
  return n;
}

// if the image is low resolution, draw it every frame, otherwise only draw it once
let drawCount = 0;
function draw() {
  if (lowRes) {
    if (drawCount < 1) {
      drawImage();
    }
    if (!drag) {
      drawCount++;
    }
  }
  else {
    if (drawCount < 1) {
      drawImage();
    }
    drawCount++;
  }
  requestAnimationFrame(draw);
}

// draw the image
function drawImage() {
  let imageData = ctx.createImageData(width, height);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let c = {
        re: (i / width - 0.5) / zoom + x,
        im: (j / height - 0.5) / zoom + y
      };
      let n = mandelbrot(c);

      let color = 0;
      if (n < max_iter) {
        color = 255 * (n / max_iter);
      }

      let index = (i + j * width) * 4;
      imageData.data[index + 0] = color;
      imageData.data[index + 1] = color;
      imageData.data[index + 2] = color;
      imageData.data[index + 3] = 255;
    }

  }
  ctx.putImageData(imageData, 0, 0);
}



// controls
// mouse wheel zoom
canvas.addEventListener("wheel", (e) => {
  setRes(300);
  if (e.deltaY < 0) {
    zoom *= 1.1;
  }
  else {
    zoom /= 1.1;
  }
});

// mouse drag
let drag = false;
let drag_x = 0;
let drag_y = 0;
canvas.addEventListener("mousedown", (e) => {
  setRes(300);
  drag = true;
  drag_x = e.clientX;
  drag_y = e.clientY;
});
canvas.addEventListener("mouseup", (e) => {
  drag = false;
});
canvas.addEventListener("mousemove", (e) => {
  if (drag) {
    x -= (e.clientX - drag_x) / width / zoom / 2;
    y -= (e.clientY - drag_y) / height / zoom / 2;
    drag_x = e.clientX;
    drag_y = e.clientY;
  }
});

// touch drag
canvas.addEventListener("touchstart", (e) => {
  setRes(300);
  drag = true;
  drag_x = e.touches[0].clientX;
  drag_y = e.touches[0].clientY;
});
canvas.addEventListener("touchend", (e) => {
  drag = false;
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (drag) {
    x -= (e.touches[0].clientX - drag_x) / width / zoom / 2;
    y -= (e.touches[0].clientY - drag_y) / height / zoom / 2;
    drag_x = e.touches[0].clientX;
    drag_y = e.touches[0].clientY;
  }
});

// touch zoom
let touch_zoom = 0;
canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length == 2) {
    touch_zoom = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
  }
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (e.touches.length == 2) {
    let new_touch_zoom = Math.abs(e.touches[0].clientX - e.touches[1].clientX) + Math.abs(e.touches[0].clientY - e.touches[1].clientY);

    if (new_touch_zoom > touch_zoom) {
      zoom *= 1.05;
    }
    else {
      zoom /= 1.05;
    }
    touch_zoom = new_touch_zoom;
  }
});

// set the resolution of the image
let resolutionIndicator = document.getElementById("res");
function setRes(res) {
  drawCount = 0;
  lowRes = true
  resolutionIndicator.innerHTML = '';
  resolutionIndicator.classList.remove('fade-out');
  width = canvas.width = height = canvas.height = res;
  if (res > 500) {
    lowRes = false;
    if (res == 2000) {
      resolutionIndicator.innerHTML = '2k';
      resolutionIndicator.classList.add('fade-out');
    } else if (res == 4000) {
      resolutionIndicator.innerHTML = '4k';
      resolutionIndicator.classList.add('fade-out');
    }
  }
}

// zoom out smoothly and proportionally to the zoom
function setPos(a, b, z) {
  setRes(300);
  drawCount = 0;
  //if the zoom is close enough to the target zoom, stop zooming and center the image
  if (Math.abs(zoom - z) < 0.01 || drag) {
    center(a, b);
    return;
  }
  if (zoom > z) {
    zoom *= 0.99;
    setTimeout(() => { setPos(a, b, z); }, 10);
  }
  else if (zoom < z) {
    zoom /= 0.99;
    setTimeout(() => { setPos(a, b, z); }, 10);
  }
}

function homeView() {
  setPos(-0.5,0,0.3);
}

// center the image smoothly and proportionally to the zoom
function center(a, b) {
  drawCount = 0;
  //if the coordinates are close enough to the target coordinates, stop
  if (Math.abs(x - a) < 0.01 / zoom && Math.abs(y - b) < 0.01 / zoom || drag) {
    setRes(2000);
    return;
  }
  if (x > a) {
    x -= 0.005 / zoom;
  }
  if (x < a) {
    x += 0.005 / zoom;
  }
  if (y > b) {
    y -= 0.005 / zoom;
  }
  if (y < b) {
    y += 0.005 / zoom;
  }
  setTimeout(() => { center(a, b); }, 20);
}

// go to a specific point and zoom
function goTo(a, b, z) {
  x = a;
  y = b;
  zoom = z;
  setRes(2000);
}

// goto modal
const modal = document.querySelector(".modal");
const trigger = document.querySelector("#goToModal");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

// goto button
function modalGo() {
  let coordsAndZoom = document.getElementById("coords").value;
  let a = parseFloat(coordsAndZoom.split(",")[0]);
  let b = parseFloat(coordsAndZoom.split(",")[1]);
  let z = parseFloat(coordsAndZoom.split(",")[2]);
  goTo(a, b, z);
  toggleModal();
}

// copy coordinates to clipboard
function copyCoords() {
  let coords = x + "," + y + "," + zoom;
  navigator.clipboard.writeText(coords);
}

// download the image
function download() {
  let link = document.createElement("a");
  link.download = "mandelbrot_" + width + "px_coords" + "(" + x + "," + y + "," + zoom + ")" + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

draw();
