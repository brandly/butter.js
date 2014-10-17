importScripts('butter.js');

self.addEventListener('message', function(e) {
  var data = e.data,
      imageData = data.imageData,
      width = data.width,
      height = data.height,
      iterations = data.iterations,
      mode = data.mode,
      threshold = data.threshold;

  // TODO: ensure imageData, width, height

  var butter = new Butter(mode, threshold),
      sortedImage = butter.sortImageData(imageData, width, height, iterations);

  self.postMessage({imageData: sortedImage});
}, false);
