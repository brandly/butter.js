
var canvas = document.getElementById('sort-pixels'),
    context = canvas.getContext('2d'),
    modeSelect = document.getElementById('mode-select'),
    button = document.getElementById('buttery'),
    butter = new Butter();

function setImage(uri){
  img = new Image();
  img.onload = function () {
    render(img);
  }
  img.src = uri;
}

function render(img) {
  canvas.width = 800;
  canvas.height = 600;

  context.drawImage(img, 0, 0);
}

setImage('wave.jpg');

modeSelect.addEventListener('change', function () {
  butter.mode = modeSelect.value;
});

button.addEventListener('click', function () {
  butter.sort(canvas);
});
