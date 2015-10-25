/* exported initSample */

var
  DUMMY_IMG = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E';

function initSample(selector) {
  Array.prototype.slice.call(document.querySelectorAll(selector))
    .forEach(function(element) {
      if (element.nodeName.toLowerCase() === 'img') {
        element.src = DUMMY_IMG;
      } else {
        element.style.backgroundImage = 'none';
      }
      element.className = '';
    });
}

// In IE, use GIF instead of SVG.
function ieBg() {
  var CSS_TEXT = '.sample-frame img.loading {background-image: url("img/loading.gif");}',
    sheet;
  if (document.createStyleSheet) { // old IE
    sheet = document.createStyleSheet();
    sheet.cssText = CSS_TEXT;
  } else {
    sheet = (document.getElementsByTagName('head')[0] || document.documentElement)
      .appendChild(document.createElement('style'));
    sheet.type = 'text/css';
    sheet.textContent = CSS_TEXT;
  }
}

if (document.uniqueID) {
  if (document.readyState === 'complete') {
    ieBg();
  } else {
    document.addEventListener('DOMContentLoaded', ieBg, false);
  }
}
