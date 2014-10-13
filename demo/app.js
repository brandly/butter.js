
var canvas = document.getElementById('sort-pixels'),
    context = canvas.getContext('2d'),
    fileInput = document.getElementById('file-upload'),
    modeSelect = document.getElementById('mode-select'),
    resetButton = document.getElementById('reset-img'),
    butterButton = document.getElementById('buttery'),
    threshold = document.getElementById('threshold'),
    butter = new Butter(),
    img = new Image();

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

function setImageURL(url){
  img.onload = renderImage
  img.src = url;
}

function renderImage() {
  canvas.width = img.width;
  canvas.height = img.height;
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
setImageURL('wave.jpg');

fileInput.addEventListener('change', function (event) {
  var target = event.target || window.event.srcElement,
      files = target.files,
      reader = new FileReader();

  reader.onload = function () {
    img.src = reader.result;
  };
  reader.readAsDataURL(files[0]);
});

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
