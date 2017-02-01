# EagerImageLoader

[![npm](https://img.shields.io/npm/v/eager-image-loader.svg)](https://www.npmjs.com/package/eager-image-loader) [![GitHub issues](https://img.shields.io/github/issues/anseki/eager-image-loader.svg)](https://github.com/anseki/eager-image-loader/issues) [![dependencies](https://img.shields.io/badge/dependencies-No%20dependency-brightgreen.svg)](package.json) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE-MIT)

The eager-loading for image files on the web page that loads the files according to your plan.  
This differs from the lazy-loading, for example, this can be used to avoid that the user waits for the loading.

[![ss-01](ss-01.gif)](https://anseki.github.io/eager-image-loader/)
[![ss-02](ss-02.gif)](https://anseki.github.io/eager-image-loader/)

**See <a href="https://anseki.github.io/eager-image-loader/">DEMO</a>**

The lazy-loading is very useful for the user which left your web page before he read all. It avoids forcing that user to pay the network cost for the images he didn't see, in the mobile networks. The image files are not loaded until it's presumed that each image is seen by the user. Therefore the user often be kept waiting it.

EagerImageLoader loads the image files according to specific plan or document order.  
For example, it loads a first image file in a hurry without other loading interfering. And after the loading a first image file finished, it starts the loading a second image file while the user is seeing a first image or reading something. As necessary, it loads the remaining image files in the order in which they would be seen by the user, one by one(default).

By default, it loads without a break. You can control that it starts and stops. For example, like the lazy-loading, EagerImageLoader loads the image files when the user scrolls the window.  
Also, it can pre-load the image files before those are used.

```html
<script src="eager-image-loader.min.js"></script>
<script>new EagerImageLoader()</script>

<!--
A minimum required is above code.
You can use this even if all of the HTML is not loaded yet.
For example, this can be in the head.
-->

<img data-src="img-1.png">

<iframe data-src="img-2.svg"></iframe>
<object data-data="img-3.svg"></object>

<div data-background="img-4.png"></div>
<button data-background="img-5.png"></button>

<!--
By default, EagerImageLoader starts automatically.
It finds out the 5 elements above.
Serially, it loads the each image file,
and it set that file to the each element.
-->
```

## Constructor

```js
loader = new EagerImageLoader([targets[, options]])
```

### <a name="constructor-targets"></a>`targets`

*Type:* string, HTMLElement, NodeList, HTMLCollection, Elements, Object or Array  
*Default:* `'[data-src],[data-data],[data-background]'`

The elements that specify the image files that are loaded.

The string such as `'#img-1'` is the CSS selector to select `<img id="img-1">` element. The CSS selector might select multiple elements.  
Also, you can specify the HTMLElement such as a return value of `document.querySelector('#img-1')` or `document.getElementById('img-1')`. Note that those methods might not be able to get the target element before the HTML is loaded sufficiently (target DOM structure is ready). EagerImageLoader selects the target elements by given string after that. Therefore you can specify the string even if the HTML is not loaded yet.

By default, the URL of the image file is got via the `data-src`, `data-data` or `data-background` attribute of that element.

- If that is the element that accepts the `src` attribute (e.g. `<img>`, `<input>`, `<iframe>`, etc.), the URL that was got via the `data-src` attribute of that element is set to the `src` attribute of that element after the image file was loaded.  
For example: `<img data-src="img-1.png">`
- If that is the element that accepts the `data` attribute (e.g. `<object>`), the URL that was got via the `data-data` attribute of that element is set to the `data` attribute of that element after the image file was loaded.  
For example: `<object data-data="img-1.svg">`
- If that is any element that doesn't accept both the `src` and  `data` attribute (e.g. `<div>`, `<body>`, `<section>`, etc.), the URL that was got via the `data-background` attribute of that element is set to the `style.backgroundImage` property of that element after the image file was loaded.  
For example: `<div data-background="img-1.png">`

Or, you can specify an URL via the [`imageTarget`](#imagetarget) object.

You can specify the loading order via the Array. EagerImageLoader loads those according to the order of that Array.  
For example:

```js
new EagerImageLoader([
  '#img-1',
  '#img-2',
  '#img-3'
]);
```

1. Start to load `'#img-1'`. (It means a image file `'#img-1'` points. The same hereinafter.)
2. Start to load `'#img-2'` after `'#img-1'` was loaded.
3. Start to load `'#img-3'` after `'#img-2'` was loaded.

The multiple image files in nested Array are loaded at the same time.  
For example:

```js
new EagerImageLoader([
  '#img-1',
  ['#img-2a', '#img-2b', '#img-2c'],
  '#img-3'
]);
```

1. Start to load `'#img-1'`. (It means a image file `'#img-1'` points. The same hereinafter.)
2. Start to load `'#img-2a'`, `'#img-2b'`, and `'#img-2c'` at the same time after `'#img-1'` was loaded.
3. Start to load `'#img-3'` after 3 files above was loaded.

If the specific string as the CSS selector such as `'img.pic'` selects multiple elements, it is considered as an Array that includes those elements in document order.  
For example, the following 2 codes work same:

```js
// Single selector that selects 3 elements
new EagerImageLoader('#img-1,#img-2,#img-3');
```

```js
new EagerImageLoader([
  '#img-1',
  '#img-2',
  '#img-3'
]);
```

*Note that multiple elements are selected in document order via the string as the CSS selector.* If the codes above are used in the HTML code that is `<img id="img-3"><img id="img-2"><img id="img-1">`, 2 codes work not same.

That string in the Array is considered as a nested Array. That is, those are loaded at the same time.  
For example, the following 2 codes work same:

```js
new EagerImageLoader([
  '#img-1',
  '#img-2a,#img-2b,#img-2c', // Single selector that selects 3 elements
  '#img-3'
]);
```

```js
new EagerImageLoader([
  '#img-1',
  ['#img-2a', '#img-2b', '#img-2c'], // 3 are loaded at the same time.
  '#img-3'
]);
```

Also, NodeList, HTMLCollection or Elements such as a return value of `document.querySelectorAll('img')` or `document.getElementsByTagName('img')` that includes multiple elements is considered as an Array that includes those elements. Note that those methods might not be able to get the target elements before the HTML is loaded sufficiently (target DOM structure is ready). EagerImageLoader selects the target elements by given string after that. Therefore you can specify the string even if the HTML is not loaded yet.

If something as multiple elements is specified in the nested Array, it is flattened in that nested Array.  
For example, the following 2 codes work same:

```js
new EagerImageLoader([
  '#img-1',
              // 2nd selector in below selects 3 elements.
  ['#img-2a', '#img-2b-x,#img-2b-y,#img-2b-z', '#img-2c'],
  '#img-3'
]);
```

```js
new EagerImageLoader([
  '#img-1',
  // 5 are loaded at the same time.
  ['#img-2a', '#img-2b-x', '#img-2b-y', '#img-2b-z', '#img-2c'],
  '#img-3'
]);
```

If `targets` argument is not specified, the elements that have `data-src`, `data-data` or `data-background` attribute are selected as the targets.

#### `imageTarget`

You can specify the `imageTarget` object instead of others above at everywhere.  
For example:

```js
new EagerImageLoader([
  '#img-1',
  { element: '#img-2', src: 'foo.png' }, // imageTarget object
  '#img-3'
]);
```

It can have following properties.

##### `element`

*Type:* string, HTMLElement, NodeList, HTMLCollection, or Elements  
*Default:* `undefined`

This works the same as case that something except for `imageTarget` object is specified, if a single element is specified.  
For example, `'#img-1'` works the same as `{ element: '#img-1' }`.

If one that includes multiple elements is specified, it is considered as an Array that includes copied `imageTarget` objects that have `element` property as each element, in document order. Note that those `imageTarget` objects are always put into the nested Array. That is, those are loaded at the same time.  
For example, the following 2 codes work same:

```js
new EagerImageLoader([
  { element: '#img-1,#img-2,#img-3', src: 'foo.png' }
]);
```

```js
new EagerImageLoader([
  [
    { element: '#img-1', src: 'foo.png' },
    { element: '#img-2', src: 'foo.png' },
    { element: '#img-3', src: 'foo.png' }
  ]
]);
```

You can specify `new Image()` to pre-load the image file you use later.

```js
new EagerImageLoader(
  // This image file is not shown until the button is pushed.
  { element: new Image(), src: 'button-pushed.png' },
);
```

##### `src`, `data`, `background`

*Type:* string  
*Default:* `undefined`

The URL of the image file that is loaded.

- `src` is used when the [`element`](#element) property points the element that accepts the `src` attribute (e.g. `<img>`, `<input>`, `<iframe>`, etc.). The URL that is specified to this `src` property is set to the `src` attribute of that element after the image file was loaded.
- `data` is used when the [`element`](#element) property points the element that accepts the `data` attribute (e.g. `<object>`). The URL that is specified to this `data` property is set to the `data` attribute of that element after the image file was loaded.
- `background` is used when the [`element`](#element) property points the element that doesn't accept both the `src` and  `data` attribute (e.g. `<div>`, `<body>`, `<section>`, etc.). The URL that is specified to this `background` property is set to the `style.backgroundImage` property of that element after the image file was loaded.

If these are not specified, it tries to get the URL via the `data-src`, `data-data` or `data-background` attribute of that element.

For example, show the low-definition image until the original image file is loaded:

```html
<div id="div-1"><img src="img-1-low.jpg"></div>
<div id="div-2"><img src="img-2-low.jpg"></div>
<div id="div-3"><img src="img-3-low.jpg"></div>
```

```js
new EagerImageLoader([1, 2, 3].map(function(id) {
  return {
    element: '#div-' + id,
    background: 'img-' + id + '.png'
  };
}));
```

```css
div > img         { visibility: hidden; }
div.loading > img { visibility: visible; }
```

##### `start`, `load`, `error`, `abort`

*Type:* function  
*Default:* `undefined`

The event handlers of the loading.

The Event object that is passed to these event handlers has `imageTarget` property that refers to this `imageTarget` object. The `this` in these event handlers also refers to this `imageTarget` object.  
Also, it has `eagerImageLoader` property that refers to the current instance itself.

The additional properties are added to this `imageTarget` object.

- `startTime` property is the time-value (milliseconds since Unix Epoch) as the time when the loading the image file of this `imageTarget` object started.
- `endTime` property is the time-value as the time when the loading it finished.

For example:

```js
new EagerImageLoader({
  element: '#img-1',
  src: 'foo.png',

  load: function(event) {
    console.log('Loaded File: ' + this.src);
    console.log('Loading Time: ' + (this.endTime - this.startTime) + 'ms');
  },
  error: function(event) {
    console.error(event);
  }
});
```

```js
var loader = new EagerImageLoader({
  element: '#img-1,#img-2,#img-3',
  load: function() {
    // Enable the "Next" button of Carousel Panel.
    frameInit(loader.stepIndex - 1);
    // Or, frameInit(event.eagerImageLoader.stepIndex - 1);
  }
});
```

```js
new EagerImageLoader({
  element: '#img-1,#img-2,#img-3',
  start: effectForLoading,
  load: effectForShowing
});
```

See [`stop`](#stop) method also.

##### `stopLoading`

*Type:* boolean  
*Default:* `false`

If `true` is specified, EagerImageLoader stops the loading, when the loading the image file of this `imageTarget` object (and all image files that start loading the same time) finished.  
The stopped loading can be resumed by [`start`](#start) method.

For example, it loads the image files that are parts of the UI (e.g. buttons, headers, menu items, etc.) when the page is opened, and it stops, and it loads other image files when the user scrolls the window.

```js
var loader = new EagerImageLoader([
  { // UI parts
    element: '#button-1,#button-2,#button-3,#menu-1,#menu-2,',
    stopLoading: true
  },
  // other images
  '#picture-1,#picture-2,#picture-3'
]);

window.addEventListener('scroll', function() {
  if (!loader.done && loader.stopped) {
    loader.start();
  }
}, false);
```

### <a name="constructor-options"></a>`options`

`options` Object that is passed to the constructor can have following properties.

#### `autoStart`

*Type:* boolean  
*Default:* `true`

By default, EagerImageLoader starts the loading automatically. If `false` is specified to this option, it does not start the loading until [`start`](#start) method is called.  
For example:

```js
var loader = new EagerImageLoader(null, {autoStart: false});

startButton.addEventListener('click', function() {
  loader.start();
}, false);
```

#### `complete`

*Type:* function  
*Default:* `undefined`

The callback that is called when the loading is finished.  
`this` in this function refers to the current instance itself.

For example:

```js
new EagerImageLoader(
  '#button-1,#button-2,#button-3,#menu-1,#menu-2,', // UI parts
  {
    complete: function() {
      console.log('All %i steps are done.', this.targets.length);
      controlPanelInit(); // Enable UI.
    }
  }
);
```

#### `loadingClass`

*Type:* string  
*Default:* `'loading'`

Add this class name to the element when the loading the image file that element points is started, and remove it when that loading is finished.

## Methods

### `start`

```js
loader = loader.start()
```

Start the loading. Or resume the loading that was stopped by [`stop`](#stop) method or [`stopLoading`](#stoploading) property of [`imageTarget`](#imagetarget) object.  
This method returns the current instance itself.

### `stop`

```js
loader = loader.stop()
```

Stop the loading.  
The stopped loading can be resumed by [`start`](#start) method.  
This method returns the current instance itself.

For example, it switches to the lazy-loading, when the page was opened in the mobile network (i.e. the loading is slow):

```js
new EagerImageLoader({
  element: '#img-1',

  load: function(event) {
    var loadingTime = this.endTime - this.startTime,
      speed = FILE_SIZE / (loadingTime / 1000) * 8; // bits per second
    if (speed < 74 * 1024 * 1024) { // less than 74 Mbps
      // Switch to lazy-loading when network is slow.
      event.eagerImageLoader.stop();
      switch2LazyLoad();
    }
  }
});
```

## Properties

### <a name="properties-targets"></a>`targets`

*Type:* Array  
*Read Only*

The [`targets`](#constructor-targets) Array that was passed to the [constructor](#constructor) and parsed and optimized.

### `options`

*Type:* Object

The [`options`](#constructor-options) Object that was passed to the [constructor](#constructor).

### `stepIndex`

*Type:* number  
*Read Only*

The index of [`targets`](#properties-targets) Array.  
This is the index of the cycles of the loading. That is, it might not be the number of the files that are loaded because a single cycle might include multiple targets.

### `stopped`

*Type:* boolean  
*Read Only*

The boolean to indicate whether the loading was stopped by [`stop`](#stop) method or [`stopLoading`](#stoploading) property of [`imageTarget`](#imagetarget) object.

### `done`

*Type:* boolean  
*Read Only*

The boolean to indicate whether the loading was finished.
