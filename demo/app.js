
var canvas = document.getElementById('sort-pixels'),
    context = canvas.getContext('2d'),
    modeSelect = document.getElementById('mode-select'),
    resetButton = document.getElementById('reset-img'),
    butterButton = document.getElementById('buttery'),
    threshold = document.getElementById('threshold'),
    butter = new Butter(),
    img;

var thresholdSettings = {
  black: {
    value: -10000000,
    min: -20000000,
    max: -1000000
  },
  bright: {
    value: 30,
    min: 0,
    max: 100
  },
  white: {
    value: -6000000,
    min: -16000000,
    max: -3000000
  }
};

function setImage(uri){
  img = new Image();
  img.onload = renderImage
  img.src = uri;
}

function renderImage() {
  canvas.width = 800;
  canvas.height = 600;
  context.drawImage(img, 0, 0);
}

function getThreshold() {
  return parseInt(threshold.value, 10);
}

function updateThresholdRange() {
  ['min', 'max', 'value'].forEach(function (setting) {
    threshold[setting] = thresholdSettings[butter.mode][setting];
  });
}

updateThresholdRange();
setImage('wave.jpg');

modeSelect.addEventListener('change', function () {
  butter.mode = modeSelect.value;
  updateThresholdRange();
});

threshold.addEventListener('input', function () {
  var newValue = getThreshold();
  butter.setThreshold(newValue);
  thresholdSettings[butter.mode] = newValue;
})

resetButton.addEventListener('click', function () {
  renderImage();
});

butterButton.addEventListener('click', function () {
  butter.sort(canvas);
});
