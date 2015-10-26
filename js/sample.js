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

// if (document.uniqueID) {
//   if (document.readyState === 'complete') {
//     ieBg();
//   } else {
//     document.addEventListener('DOMContentLoaded', ieBg, false);
//   }
// }

// for FF
(function() {
  // NOT `new Image()`
  document.createElement('img').src = 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiPjxzdHlsZT48IVtDREFUQVtAbWVkaWEgYWxsIGFuZCAoLW1zLWhpZ2gtY29udHJhc3Q6IG5vbmUpLCAoLW1zLWhpZ2gtY29udHJhc3Q6IGFjdGl2ZSl7c3ZnOnJvb3R7dHJhbnNmb3JtOnRyYW5zbGF0ZVooMCk7Ym94LXNoYWRvdzowIDAgMXB4IHRyYW5zcGFyZW50O2FuaW1hdGlvbi1uYW1lOnNwaW47YW5pbWF0aW9uLWR1cmF0aW9uOjFzO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyO2FuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6aW5maW5pdGV9fUAtbXMta2V5ZnJhbWVzIHNwaW57ZnJvbXstbXMtdHJhbnNmb3JtOnJvdGF0ZSgwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDBkZWcpfXRvey1tcy10cmFuc2Zvcm06cm90YXRlKDM2MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpfX1Aa2V5ZnJhbWVzIHNwaW57ZnJvbXstbXMtdHJhbnNmb3JtOnJvdGF0ZSgwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDBkZWcpfXRvey1tcy10cmFuc2Zvcm06cm90YXRlKDM2MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpfX1dXT48L3N0eWxlPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjE0IiBvcGFjaXR5PSIwLjI1Ii8+PHBhdGggZD0iTTE2LDJhMTQsMTQgMCAwIDEgMTQsMTQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgMTYgMTYiIHRvPSIzNjAgMTYgMTYiIGJlZ2luPSIwcyIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L3BhdGg+PC9zdmc+';
})();
