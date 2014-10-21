![Butter.js](http://i.imgur.com/Nzg0p74.png)

pixel sorting for canvas

```shell
$ npm install --save butter.js
```

## general idea

Take a canvas. Define a filter for which pixels get sorted and which don't. Rows and columns of pixels that pass that filter will be sorted based on their color value.

## basic use

```js
var canvas = document.getElementById('my-canvas');
var butter = new Butter();
butter.sort(canvas);
```

For convenience, you can sort multiple times in quick succession
```js
butter.sort(canvas, 3);
```

By default, the mode is set to `black`, but you could also set it to `bright` or `white`.
```js
var butter = new Butter({mode: 'bright'});
```

You can also change the threshold for the current mode using `butter.setThreshold(newThreshold)`

## web worker

Here's the thing: Butter has to loop through _a lot_ of pixels, which isn't super fast. This slowness can lock up your UI, and people don't like that.

Fortunately, we can use [Web Workers](http://www.html5rocks.com/en/tutorials/workers/basics/) nowadays to sort our pixels on another thread.

Web Workers don't have access to the DOM, so we need to do a tiny bit more work, but maybe it's worth it. Here's what that looks like.

```js
var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');

var butter = new Worker('butter-worker.js');

// it'll message us back when it's done sorting
butter.addEventListener('message', function afterSort(e) {
  context.putImageData(e.data.imageData, 0, 0);
}, false);

// get the raw pixel data from our canvas' context
var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

// message the worker to tell it to sort those pixels
butter.postMessage({
  imageData: imageData,
  width: canvas.width,
  height: canvas.height,
  mode: 'black',       // optional
  threshold: -10000000 // optional
});
```

Check out [butter.pics](http://butter.pics/)

## development

```shell
$ npm install
$ gulp
```
