![Butter.js](http://i.imgur.com/Nzg0p74.png)

pixel sorting for canvas

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

## development

```shell
$ npm install
$ gulp
```
