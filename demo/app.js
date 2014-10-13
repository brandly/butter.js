
var canvas = document.getElementById('sort-pixels'),
    context = canvas.getContext('2d'),
    modeSelect = document.getElementById('mode-select'),
    resetButton = document.getElementById('reset-img'),
    butterButton = document.getElementById('buttery'),
    butter = new Butter(),
    img;

function setImage(uri){
  img = new Image();
  img.onload = render
  img.src = uri;
}

function render() {
  canvas.width = 800;
  canvas.height = 600;
  context.drawImage(img, 0, 0);
}

setImage('wave.jpg');

modeSelect.addEventListener('change', function () {
  butter.mode = modeSelect.value;
});

resetButton.addEventListener('click', function () {
  render();
});

butterButton.addEventListener('click', function () {
  butter.sort(canvas);
});
