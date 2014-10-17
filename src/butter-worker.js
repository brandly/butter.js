importScripts('butter.js');

self.addEventListener('message', function(e) {
  var data = e.data,
      imageData = data.imageData,
      width = data.width,
      height = data.height,
      iterations = data.iterations,
      options = data.options;

  // TODO: ensure imageData, width, height

  var butter = new Butter(options),
      sortedImage = butter.sortImageData(imageData, width, height, iterations);

  self.postMessage({imageData: sortedImage});
  self.close();
}, false);
