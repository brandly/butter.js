
function setImage(uri){
  img = new Image();
  img.onload = function () {
    render(img);
  }
  img.src = uri;
}

function render(img) {
  var canvas = document.getElementById('sort-pixels'),
      context = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 600;

  context.drawImage(img, 0, 0);

  var butter = new Butter();
  butter.sort(canvas);
}

setImage('wave.jpg');
