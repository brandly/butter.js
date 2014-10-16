
var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    destination = document.getElementById('sort-pixels'),
    fileInput = document.getElementById('file-upload'),
    modeSelect = document.getElementById('mode-select'),
    resetButton = document.getElementById('reset-img'),
    butterButton = document.getElementById('buttery'),
    threshold = document.getElementById('threshold'),
    butter = new Butter(),
    // This will store our Image, used for loading in initial image data
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

function setImageURL(url) {
  img = new Image();
  img.onload = renderImageToCanvas;
  img.src = url;
}

var maxWidth = 900;
function renderImageToCanvas() {
  var width = Math.min(maxWidth, img.width),
      // If we're downsizing the img, this'll maintain the correct aspect ratio
      height = (width / img.width) * img.height;

  canvas.width = width;
  canvas.height = height;

  context.drawImage(img, 0, 0, width, height);
  img.onload = null;

  renderCanvasToImage();
}

function renderCanvasToImage() {
  destination.src = canvas.toDataURL("image/png");
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
setImageURL('wave.jpg');

fileInput.addEventListener('change', function (event) {
  var target = event.target || window.event.srcElement,
      files = target.files,
      reader = new FileReader();

  img = new Image();
  reader.onload = function () {
    img.onload = renderImageToCanvas;
    img.src = reader.result;
  };

  if (files.length) {
    reader.readAsDataURL(files[0]);
  }
});

Array.prototype.forEach.call(document['butter-form'].mode, function (radio) {
  radio.addEventListener('click', function () {
    butter.mode = this.value;
    updateThresholdRange();
  });
});

threshold.addEventListener('input', function () {
  var newValue = getThreshold();
  butter.setThreshold(newValue);
  thresholdSettings[butter.mode] = newValue;
})

resetButton.addEventListener('click', function (e) {
  e.preventDefault();
  renderImageToCanvas();
});

butterButton.addEventListener('click', function (e) {
  e.preventDefault();
  butter.sort(canvas);
  renderCanvasToImage();
});
