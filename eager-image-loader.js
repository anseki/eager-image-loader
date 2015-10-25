/*
 * EagerImageLoader
 * https://github.com/anseki/eager-image-loader
 *
 * Copyright (c) 2015 anseki
 * Licensed under the MIT license.
 */

;(function(global, undefined) {
'use strict';

var
  DEFAULT_OPTIONS = {
    autoStart: true,
    loadingClass: 'loading'
  },
  RE_LIKESPACE = /[\t\r\n\f]/g,
  RE_NOSPACE = /\S+/g,
  RE_TRIM = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

function EagerImageLoader(targets, options) {
  var that = this;

  /*
    ==== targets ====
    [
      { // stepTarget
        imageTargets:   [ <imageTarget>, <imageTarget> ... ],
        started:        <boolean>,
      },
      ...
    ]

    ==== imageTarget ====
    {
      element:        <element>,
      src, data, background,        // <string> Attrs
      start, load, error, abort,    // <function> Callbacks
      stopLoading:    <boolean>,

      startTime:      <number>,
      endTime:        <number>
      _attrName, _url               // <string>
    }
  */
  function parseTargets() {
    var list2array = Function.prototype.call.bind(Array.prototype.slice),
      uniqueElements = [];

    function getArray(elements, onlyElement) {
      var constructorName;
      if (elements) {
        if (typeof elements === 'string') {
          return list2array(document.querySelectorAll(elements));
        }
        if (typeof elements === 'object' ||
            typeof elements === 'function') { // for object/embed in FF (NPObject?)
          constructorName = Object.prototype.toString.call(elements);
          if (constructorName === '[object NodeList]' ||
              constructorName === '[object HTMLCollection]' ||
              constructorName === '[object Elements]') { // DOM4
            return list2array(elements);
          }
          if (elements instanceof HTMLElement || (!onlyElement && elements.element)) {
            return [elements];
          }
        }
      }
      global.console.warn('Couldn\'t get element.');
      global.console.warn(elements);
      return [];
    }

    function checkElement(imageTarget) {

      function getAttrName(element) {
        var proto = Object.getPrototypeOf(element);
        return ( // element property for old DOM
          proto.hasOwnProperty('src') || element.hasOwnProperty('src') ? 'src' :
          proto.hasOwnProperty('data') || element.hasOwnProperty('data') ? 'data' :
          'background'
        );
      }

      var element = imageTarget.element,
        attrName = getAttrName(element),
        url = imageTarget[attrName] ||
          (element.dataset ? element.dataset[attrName] :
            element.getAttribute('data-' + attrName));

      if (url) {
        imageTarget._attrName = attrName;
        imageTarget._url = url;
        return true;
      } else {
        global.console.warn('Couldn\'t get URL.');
        global.console.warn(imageTarget);
        return false;
      }
    }

    function isNew(element) { // This check has to be last.
      if (uniqueElements.indexOf(element) > -1) {
        global.console.warn('Element was specified in duplicate.');
        global.console.warn(element);
        return false;
      }
      uniqueElements.push(element);
      return true;
    }

    that.targets = [];
    (Array.isArray(targets) ? targets :
      getArray(targets || '[data-src],[data-data],[data-background]')
    ).forEach(function(target) {
      var imageTargets = [];
      (Array.isArray(target) ? target : [target]).forEach(function(target) {
        var elementsTarget = target, imageTargetBase;
        // check for [null] or [[null]]
        if (target && typeof target === 'object' && target.element) {
          elementsTarget = target.element;
          imageTargetBase = target;
        }

        getArray(elementsTarget, true).forEach(function(element) {
          var imageTarget = {element: element};
          if (imageTargetBase) {
            imageTarget = ['src', 'data', 'background',
                'start', 'load', 'error', 'abort', 'stopLoading'].reduce(
              function(imageTarget, objKey) { // shallow copy
                imageTarget[objKey] = imageTargetBase[objKey];
                return imageTarget;
              }, imageTarget);
          }
          if (checkElement(imageTarget) && isNew(imageTarget.element)) {
            imageTargets.push(imageTarget);
          }
        });
      });
      if (imageTargets.length) {
        that.targets.push({imageTargets: imageTargets}); // stepTarget
      } else {
        global.console.warn('Couldn\'t get any element in a step.');
        global.console.warn(target);
      }
    });

    if (!that.targets.length) {
      that.done = true;
    } else {
      that.stepIndex = 0;
      if (that.options.autoStart) { that.start(); }
    }
  }

  that.options = Object.keys(DEFAULT_OPTIONS).reduce(function(options, optionName) {
    if (options[optionName] === undefined) {
      options[optionName] = DEFAULT_OPTIONS[optionName];
    }
    return options;
  }, options || {});

  that.stepIndex = -1;
  that.done = that.stopped = false;

  if (document.readyState === 'complete') {
    parseTargets();
  } else {
    document.addEventListener('DOMContentLoaded', parseTargets, false);
  }
}

function trim(text) {
  /* jshint eqnull:true */
  return text != null ?
    (text + '').replace(RE_TRIM, '') : '';
  /* jshint eqnull:false */
}

function addClass(element, value) {
  var curClassValue = element.className,
    classText = curClassValue ? // space for indexOf()
      (' ' + curClassValue + ' ').replace(RE_LIKESPACE, ' ') : ' ';

  ((value || '').match(RE_NOSPACE) || []).forEach(function(target) {
    if (classText.indexOf(' ' + target + ' ') < 0) {
      classText += target + ' ';
    }
  });

  classText = trim(classText);
  if (classText !== curClassValue) { element.className = classText; }
  return element;
}

function removeClass(element, value) {
  var curClassValue = element.className,
    classText = curClassValue ?
      (' ' + curClassValue + ' ').replace(RE_LIKESPACE, ' ') : '';

  if (classText) {
    if (value) {
      (value.match(RE_NOSPACE) || []).forEach(function(target) {
        while (classText.indexOf(' ' + target + ' ') >= 0) {
          classText = classText.replace(' ' + target + ' ', ' ');
        }
      });
      classText = trim(classText);
    } else { // remove all
      classText = '';
    }
    if (classText !== curClassValue) { element.className = classText; }
  }
  return element;
}

function nextTarget(loader) {
  var stepTarget = loader.targets[loader.stepIndex];
  if (loader.done || loader.stopped || stepTarget.started) { return; }

  stepTarget.started = true;
  stepTarget.imageTargets.forEach(function(imageTarget) {
    var loadImage = new Image();

    function imageTargetFinish(event) {
      if (event.type === 'load') {
        if (imageTarget._attrName === 'src' || imageTarget._attrName === 'data') {
          imageTarget.element[imageTarget._attrName] = loadImage.src;
        } else {
          imageTarget.element.style.backgroundImage = 'url("' + loadImage.src + '")';
        }
      }
      loadImage = null;
      if (loader.options.loadingClass) {
        removeClass(imageTarget.element, loader.options.loadingClass);
      }
      imageTarget.endTime = Date.now();

      if (imageTarget[event.type]) {
        event.imageTarget = imageTarget;
        event.eagerImageLoader = loader;
        imageTarget[event.type](event); // `this` is imageTarget
      }

      if (stepTarget.imageTargets.every(
          function(imageTarget) { return !!imageTarget.endTime; })) {
        if (loader.stepIndex >= loader.targets.length - 1) {
          loader.done = true;
          if (loader.options.complete) { loader.options.complete.call(loader); }
        } else {
          loader.stepIndex++;
          setTimeout(function() { nextTarget(loader); }, 0);
        }
      }
    }

    if (imageTarget.stopLoading) { loader.stop(); } // Stop when current step is finished.
    if (loader.options.loadingClass) {
      addClass(imageTarget.element, loader.options.loadingClass);
    }
    imageTarget.startTime = Date.now();

    if (imageTarget.start) {
      // `this` is imageTarget
      imageTarget.start(createEvent('start',
        {imageTarget: imageTarget, eagerImageLoader: loader}));
    }

    ['load', 'error', 'abort'].forEach(
      function(type) { loadImage.addEventListener(type, imageTargetFinish, false); });
    loadImage.src = imageTarget._url;
  });
}

function createEvent(type, props) {
  var evt, funcs = [
      function() {
        evt = new Event(type, {bubbles: false, cancelable: false});
      },
      function() {
        evt = new CustomEvent(type);
      },
      function() {
        evt = document.createEvent('Event');
        evt.initEvent(type, false, false);
      },
      function() {
        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(type, false, false, null);
      }
    ];

  if (!funcs.some(function(func) {
        try {
          func();
          return true;
        } catch (e) {}
      })) {
    evt = {type: type}; // In the worst case.
  }

  Object.keys(props).forEach(function(propName) {
    evt[propName] = props[propName];
  });
  return evt;
}

EagerImageLoader.prototype.start = function() {
  if (!this.done) {
    this.stopped = false;
    if (this.stepIndex >= 0) {
      nextTarget(this);
    } else { // before parseTargets
      this.options.autoStart = true;
    }
  }
  return this;
};

EagerImageLoader.prototype.stop = function() {
  this.stopped = true;
  return this;
};

global.EagerImageLoader = EagerImageLoader;
})(
/* jshint evil:true, newcap:false */
Function('return this')()
/* jshint evil:false, newcap:true */
);
