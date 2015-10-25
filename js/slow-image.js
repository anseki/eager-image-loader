/*
 * Hacking that makes Image delay loading for test
 */

;(function(global, undefined) {
'use strict';

var DEFAULT_DELAY = 3000,
  LOG_MSG_REQUEST = 'Requested Loading (delayed %i ms): %s',
  LOG_MSG_START = 'Start Loading (delayed %i ms): %s';

function getDelay(element) {
  var delay = typeof element.delay === 'number' ? element.delay : DEFAULT_DELAY,
    delayMin = delay > 500 ? delay - 500 : 0,
    delayMax = delay + 500;
  // Emulate unsettled speed.
  return Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
}

function replaceSetter(descriptor) {
  global.console.info('Setter is replaced.');
  (function(nativeMethod) {
    Object.defineProperty(global.Image.prototype, 'src', {
      configurable:   descriptor.configurable,
      enumerable:     descriptor.enumerable,
      get:            descriptor.get,

      set:            function(value) {
        var that = this, delay = getDelay(that);
        global.console.info(LOG_MSG_REQUEST, delay, value);
        global.setTimeout(function() {
          global.console.info(LOG_MSG_START, delay, value);
          nativeMethod.call(that, value);
        }, delay);
      }

    });
  })(descriptor.set);
}

function replaceDescriptor() {
  global.console.info('Descriptor is replaced.');
  Object.defineProperty(global.Image.prototype, 'src', {
    enumerable:     true,

    get:            function() {
      return global.Element.prototype.getAttribute.call(this, 'src');
    },

    set:            function(value) {
      var that = this, delay = getDelay(that);
      global.console.info(LOG_MSG_REQUEST, delay, value);
      global.setTimeout(function() {
        global.console.info(LOG_MSG_START, delay, value);
        global.Element.prototype.setAttribute.call(that, 'src', value);
      }, delay);
    }

  });
}

function wrapConstructor() {
  global.console.info('Constructor is replaced.');
  (function(NativeImage) {
    function Image() {
      this.nativeImage = new NativeImage();
    }

    Object.defineProperty(Image.prototype, 'src', {
      enumerable:     true,

      get:            function() {
        return this.nativeImage.src;
      },

      set:            function(value) {
        var that = this, delay = getDelay(that);
        global.console.info(LOG_MSG_REQUEST, delay, value);
        global.setTimeout(function() {
          global.console.info(LOG_MSG_START, delay, value);
          that.nativeImage.src = value;
        }, delay);
      }

    });

    Image.prototype.addEventListener = function(type, listener, useCapture) {
      this.nativeImage.addEventListener(type, listener, useCapture);
    };

    global.Image = Image;
  })(global.Image);
}

if (!global.Image || !global.HTMLImageElement) { return; }

if (global.Image.prototype === global.HTMLImageElement.prototype) {
  // `Image` reffers `HTMLImageElement`
  wrapConstructor();
} else {
  (function(descriptor) {
    if (descriptor && descriptor.set) {
      replaceSetter(descriptor);
    } else {
      if (Object.getOwnPropertyDescriptor(new global.Image(), 'src')) {
        // Descriptor is created
        wrapConstructor();
      } else {
        replaceDescriptor();
      }
    }
  })(Object.getOwnPropertyDescriptor(global.Image.prototype, 'src'));
}

})(
/* jshint evil:true, newcap:false */
Function('return this')()
/* jshint evil:false, newcap:true */
);
