
var canvas = document.getElementById('sort-pixels'),
    context = canvas.getContext('2d'),
    button = document.getElementById('buttery');

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

button.addEventListener('click', function () {
  var butter = new Butter();
  butter.sort(canvas);
});
