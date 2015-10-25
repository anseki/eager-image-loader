
// Fallback for bug in preserveAspectRatio
//    *** No pseudo-elements, No dynamic class, Must be square ***

;(function(global, undefined) {
'use strict';

function bugPreserveAspectRatio() {
  Array.prototype.slice.call(document.querySelectorAll('img'))
    .forEach(function(element) {
      var style = global.getComputedStyle(element, ''),
        wh = (style.backgroundSize || '').split(/\s+/, 2), bgSize;
      if (wh.length === 2 && /\d+%$/.test(wh[0]) && /\d+%$/.test(wh[1])) {
        bgSize = Math.min(
          parseFloat(style.width) * parseFloat(wh[0]) / 100,
          parseFloat(style.height) * parseFloat(wh[1]) / 100) + 'px';
        element.style.backgroundSize = bgSize + ' ' + bgSize;
      }
    });
}

if (document.readyState === 'complete') {
  bugPreserveAspectRatio();
} else {
  document.addEventListener('DOMContentLoaded', bugPreserveAspectRatio, false);
}

})(
/* jshint evil:true, newcap:false */
Function('return this')()
/* jshint evil:false, newcap:true */
);
