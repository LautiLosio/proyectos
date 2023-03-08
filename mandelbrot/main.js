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

// if the resolution is low, draw the image every frame, otherwise only draw it once
function draw() {
  if (lowRes) {
    drawImage();
  }
  else {
    requestAnimationFrame(drawImage);
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
function setRes(res) {
  width = canvas.width = height = canvas.height = res;
  if (res < 500) {
    lowRes = true;
  }
  else {
    lowRes = false;
  }
}

// zoom out smoothly and proportionally to the zoom
function zoomOut() {
  setRes(300);
  if (zoom > 0.3) {
  zoom *= 0.99;
  setTimeout(() => { zoomOut(); }, 10);
  }
  else {
    // when done zooming out, center the image
    center();
  }
}

// center the image smoothly and proportionally to the zoom
function center() {
  if (x > -0.5) {
    x -= 0.005 / zoom;
  }
  if (x < -0.5) {
    x += 0.005 / zoom;
  }
  if (y > 0) {
    y -= 0.005 / zoom;
  }
  if (y < 0) {
    y += 0.005 / zoom;
  }
  // stop when the image is centered or user starts dragging
  if (Math.abs(x + 0.5) < 0.01 && Math.abs(y) < 0.01 || drag) {
    return;
  }
  setTimeout(() => { center(); }, 20);
}

// download the image
function download() {
  let link = document.createElement("a");
  link.download = "mandelbrot" + width + "px.png"
  link.href = canvas.toDataURL("image/png");
  link.click();
}

draw();
