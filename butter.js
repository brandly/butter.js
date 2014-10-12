/*
  Butter.js
  http://github.com/brandly/butter.js
*/

(function () {
  var validModes = ['black', 'bright', 'white'];

  function Butter(options) {
    options || (options = {});

    var defaultMode = validModes[0];
    this.mode = options.mode || defaultMode;
    if (validModes.indexOf(this.mode) === -1) {
      console.log('Butter has no mode called "' + this.mode + '".')
      this.mode = defaultMode;
    }

    this.blackValue = options.blackValue || -10000000;
    this.whiteValue = options.whiteValue || -6000000;
    this.brightnessValue = options.brightnessValue || 30;
  }

  Butter.prototype.sort = function (canvas, iterations) {
    this.canvas = canvas;
    if (!this.canvas) {
      throw 'Butter needs a <canvas> to sort';
    }
    this.context = this.canvas.getContext('2d');

    this.height = this.canvas.height;
    this.width = this.canvas.width;

    iterations || (iterations = 1);

    // Read in the image currently on the canvas
    this.imageData = this.context.getImageData(0, 0, this.width, this.height);

    for (var i = 0; i < iterations; i++) {

      for (var column = 0; column < this.width; column++) {
        this.sortColumn(column);
      }

      for (var row = 0; row < this.height; row++) {
        this.sortRow(row);
      }
    }

    this.context.putImageData(this.imageData, 0, 0);
  };

  Butter.prototype.sortColumn = function sortColumn(x) {
    var ranges = this.getRangesForColumn(x),
        range, width, unsorted, sorted;

    // For each range...
    for (var i = 0; i < ranges.length; i++) {
      range = ranges[i];
      width = range.end - range.start;

      unsorted = new Array(width);
      sorted = new Array(width);

      // Get all the pixels in that range
      for (var j = 0; j < width; j++) {
        unsorted[j] = this.getPixelValue(x, range.start + j);
      }

      // Sort them!
      sorted = unsorted.sort();

      // And put the new pixels back
      for (var j = 0; j < width; j++) {
        this.setPixelValue(x, (range.start + j), sorted[j]);
      }
    }
  };

  Butter.prototype.sortRow = function sortRow(y) {
    var ranges = this.getRangesForRow(y),
        range, width, unsorted, sorted;

    // For each range...
    for (var i = 0; i < ranges.length; i++) {
      range = ranges[i];
      width = range.end - range.start;

      unsorted = new Array(width);
      sorted = new Array(width);

      // Get all the pixels in that range
      for (var j = 0; j < width; j++) {
        unsorted[j] = this.getPixelValue(range.start + j, y);
      }

      // Sort them!
      sorted = unsorted.sort();

      // And put the new pixels back
      for (var j = 0; j < width; j++) {
        this.setPixelValue((range.start + j), y, sorted[j]);
      }
    }
  };

  Butter.prototype.getRangesForColumn = function getRangesForColumn(x) {
    var ranges = [],
        start = 0
        end = 0;

    switch(this.mode) {
      case 'black':
        findFirst = this.getFirstNotBlackY;
        findNext = this.getNextBlackY;
        break;

      case 'bright':
        findFirst = this.getFirstBrightY;
        findNext = this.getNextDarkY;
        break;

      case 'white':
        findFirst = this.getFirstNotWhiteY;
        findNext = this.getNextWhiteY;
        break;
    }

    for ( ; end < this.height; start = (end + 1)) {
      start = findFirst.call(this, x, start);
      end = findNext.call(this, x, start);

      // No more ranges
      if (start < 0 || start >= this.height) break;

      ranges.push({start: start, end: end});
    }
    return ranges;
  };

  Butter.prototype.getRangesForRow = function getRangesForRow(y) {
    var ranges = [],
        start = 0
        end = 0,
        findFirst, findNext;

    switch(this.mode) {
      case 'black':
        findFirst = this.getFirstNotBlackX;
        findNext = this.getNextBlackX;
        break;

      case 'bright':
        findFirst = this.getFirstBrightX;
        findNext = this.getNextDarkX;
        break;

      case 'white':
        findFirst = this.getFirstNotWhiteX;
        findNext = this.getNextWhiteX;
        break;
    }

    for ( ; end < this.width; start = (end + 1)) {
      start = findFirst.call(this, start, y);
      end = findNext.call(this, start, y);

      // No more ranges
      if (start < 0 || start >= this.width) break;

      ranges.push({start: start, end: end});
    }
    return ranges;
  };

  /*
    Finders
  */

  Butter.prototype.getFirstNotBlackX = function getFirstNotBlackX(x, y) {
    // Loop until we find a match
    for ( ; this.getPixelValue(x, y) < this.blackValue; x++) {
      // Oh no, we've reached the edge!
      if (x >= this.width) return -1;
    }
    // Return the match
    return x;
  }

  Butter.prototype.getNextBlackX = function getNextBlackX(x, y) {
    // We want the _next_ one
    x += 1;
    for ( ; this.getPixelValue(x, y) > this.blackValue; x++) {
      if (x >= this.width) return this.width - 1;
    }
    return x;
  }


  Butter.prototype.getFirstBrightX = function getFirstBrightX(x, y) {
    for ( ; this.getPixelBrightness(x, y) < this.brightnessValue; x++) {
      if (x >= this.width) return -1;
    }
    return x;
  }

  Butter.prototype.getNextDarkX = function getNextDarkX(x, y) {
    x += 1;
    for ( ; this.getPixelBrightness(x, y) > this.brightnessValue; x++) {
      if (x >= this.width) return this.width - 1;
    }
    return x;
  }


  Butter.prototype.getFirstNotWhiteX = function getFirstNotWhiteX(x, y) {
    for ( ; this.getPixelValue(x, y) > this.whiteValue; x++) {
      if (x >= this.width) return -1;
    }
    return x;
  }

  Butter.prototype.getNextWhiteX = function getNextWhiteX(x, y) {
    x += 1;
    for ( ; this.getPixelValue(x, y) < this.whiteValue; x++) {
      if (x >= this.width) return this.width - 1;
    }
    return x;
  }


  Butter.prototype.getFirstNotBlackY = function getFirstNotBlackY(x, y) {
    for ( ; this.getPixelValue(x, y) < this.blackValue; y++) {
      if (y >= this.height) return -1;
    }
    return y;
  }

  Butter.prototype.getNextBlackY = function getNextBlackY(x, y) {
    y += 1;
    for ( ; this.getPixelValue(x, y) > this.blackValue; y++) {
      if (y >= this.height) return this.height - 1;
    }
    return y;
  }


  Butter.prototype.getFirstBrightY = function getFirstBrightY(x, y) {
    for ( ; this.getPixelBrightness(x, y) < this.brightnessValue; y++) {
      if (y >= this.height) return -1;
    }
    return y;
  }

  Butter.prototype.getNextDarkY = function getNextDarkY(x, y) {
    y += 1;
    for ( ; this.getPixelBrightness(x, y) > this.brightnessValue; y++) {
      if (y >= this.height) return this.height - 1;
    }
    return y;
  }


  Butter.prototype.getFirstNotWhiteY = function getFirstNotWhiteY(x, y) {
    for ( ; this.getPixelValue(x, y) > this.whiteValue; y++) {
      if (y >= this.height) return -1;
    }
    return y;
  }

  Butter.prototype.getNextWhiteY = function getNextWhiteY(x, y) {
    y += 1;
    for ( ; this.getPixelValue(x, y) < this.whiteValue; y++) {
      if (y >= this.height) return this.height - 1;
    }
    return y;
  }

  /*
    Utilities
  */

  Butter.prototype.getPixelOffset = function getPixelOffset(x, y) {
    return (x + y * this.width) * 4;
  };

  Butter.prototype.setPixelValue = function setPixelValue(x, y, val) {
    var offset = this.getPixelOffset(x, y),
        r = (val >> 16) & 255,
        g = (val >> 8) & 255,
        b = val & 255,
        data = this.imageData.data;

    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
  }

  Butter.prototype.getPixelValue = function getPixelValue(x, y) {
    var offset = this.getPixelOffset(x, y),
        data = this.imageData.data,
        r = data[offset],
        g = data[offset + 1],
        b = data[offset + 2];

    return ( ((255 << 8) | r) << 8 | g) << 8 | b;
  }

  Butter.prototype.getPixelBrightness = function getPixelBrightness(x, y) {
    var offset = this.getPixelOffset(x, y),
        data = this.imageData.data,
        r = data[offset],
        g = data[offset + 1],
        b = data[offset + 2];

    return Math.max(r, g, b) / 255 * 100;
  }

  // Let it loose
  if ((typeof module !== "undefined") && (module.exports)) {
    module.exports = Butter;
  } else {
    this.Butter = Butter;
  }
}())
