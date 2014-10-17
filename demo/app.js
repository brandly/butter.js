
var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    destination = document.getElementById('sort-pixels'),
    fileInput = document.getElementById('file-upload'),
    modeSelect = document.getElementById('mode-select'),
    resetButton = document.getElementById('reset-img'),
    butterButton = document.getElementById('buttery'),
    threshold = document.getElementById('threshold'),
    // This will store our Image, used for loading in initial image data
    img;

var mode = 'black';
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
  img.crossOrigin = 'http://profile.ak.fbcdn.net/crossdomain.xml';
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

function readFileToImage(file) {
  var reader = new FileReader();
  img = new Image();

  reader.onload = function () {
    img.onload = renderImageToCanvas;
    img.src = reader.result;
  };

  reader.readAsDataURL(file);
}

function renderCanvasToImage() {
  destination.src = canvas.toDataURL("image/png");
}

function getThreshold() {
  return parseInt(threshold.value, 10);
}

function updateThresholdRange() {
  ['min', 'max', 'value'].forEach(function (setting) {
    threshold[setting] = thresholdSettings[mode][setting];
  });
}

updateThresholdRange();
setImageURL('wave.jpg');

fileInput.addEventListener('change', function (event) {
  var target = event.target || window.event.srcElement,
      files = target.files;

  if (files.length) {
    readFileToImage(files[0]);
  }
});

Array.prototype.forEach.call(document['butter-form'].mode, function (radio) {
  radio.addEventListener('click', function () {
    mode = this.value;
    updateThresholdRange();
  });
});

threshold.addEventListener('input', function () {
  var newValue = getThreshold();
  thresholdSettings[mode].value = newValue;
})

resetButton.addEventListener('click', function (e) {
  e.preventDefault();
  renderImageToCanvas();
});

var butter = new Worker('butter-worker.js');

// it'll message us back when it's done sorting
butter.addEventListener('message', function afterSort(e) {
  context.putImageData(e.data.imageData, 0, 0);
  renderCanvasToImage();
}, false);

butterButton.addEventListener('click', function (e) {
  e.preventDefault();
  // TODO: disable button and display loading indicator

  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  butter.postMessage({
    imageData: imageData,
    width: canvas.width,
    height: canvas.height,
    mode: mode,
    threshold: thresholdSettings[mode].value
  });
});

// Handle dropping files
destination.addEventListener('drop', function (e) {
  e.stopPropagation();
  e.preventDefault();

  var target = event.target || window.event.srcElement,
      files = e.dataTransfer.files,
      url = e.dataTransfer.getData('URL');

  removeClass(target, droppingClass);

  if (files.length) {
    readFileToImage(files[0]);
  } else if (url) {
    setImageURL(url);
  }
});

destination.addEventListener('dragover', function (e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

var droppingClass = 'dropping-file';
destination.addEventListener('dragenter', function (e) {
  var target = event.target || window.event.srcElement;
  addClass(target, droppingClass);
});

destination.addEventListener('dragleave', function (e) {
  var target = event.target || window.event.srcElement;
  removeClass(target, droppingClass);
});

function addClass(el, name) {
  el.className += ' ' + name;
}

function removeClass(el, name) {
  var exp = RegExp(name, 'g');
  el.className = el.className.replace(exp, '');
}
