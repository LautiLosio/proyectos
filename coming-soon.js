// get the item with class .info
var info = document.querySelector('.countdown');

// change the text of the element with class .info with a countdown from 5 to 0, then redirect to the home page
var count = 5;
var interval = setInterval(function () {
  count--;
  info.innerHTML = count;
  if (count === 0) {
    clearInterval(interval);
    window.location.href = 'index.html';
  }
}
  , 1000);

