
(function() {

var
  img1element = document.getElementById('sample-04-img-01'),
  img1html = img1element.innerHTML,
  img1svg, img1symbol, img1anim1, img1anim2,
  img1anim3, img1anim4, img1reset1, img1reset2,

  img2element = document.getElementById('sample-04-img-02'),
  img2html = img2element.innerHTML,
  img2svg, img2anim1, img2anim2, animList, img2image,

  img3element = document.getElementById('sample-04-img-03'),
  img3html = img3element.innerHTML,
  img3svg, img3symbol1use, img3symbol2,
  img3anim1, img3anim2, img3anim3, img3anim4, img3anim5, img3image;

function img1EffectStart() {
  img1svg = document.getElementById('sample-04-01');
  img1symbol = document.getElementById('sample-04-01-symbol');
  img1anim1 = document.getElementById('sample-04-01-anim-01');
  img1anim2 = document.getElementById('sample-04-01-anim-02');
  img1anim3 = document.getElementById('sample-04-01-anim-03');
  img1anim4 = document.getElementById('sample-04-01-anim-04');
  img1reset1 = document.getElementById('sample-04-01-reset-01');
  img1reset2 = document.getElementById('sample-04-01-reset-02');
  img1svg.setAttribute('class', 'cover'); // NOT className
  img1anim1.beginElement(); // for Webkit
}

function img1EffectStop(url, cb) {
  img1anim2.beginElement();
  setTimeout(function() {
    img1anim1.endElement();
    img1symbol.setAttribute('class', 'shaped');
    img1svg.removeAttribute('class');
    img1anim3.beginElement();
    img1anim4.beginElement();
    setTimeout(cb, 1100);
  }, 700);
}

function img1EffectReset() {
  img1anim1.endElement();
  img1anim2.endElement();
  img1anim3.endElement();
  img1anim4.endElement();
  img1reset1.beginElement();
  img1reset2.beginElement();
  img1svg.setAttribute('class', 'stopped');
  img1symbol.removeAttribute('class');
  img1element.style.backgroundImage = 'none';
  img1element.className = '';
  // for Webkit (This is probably silly job.)
  img1element.innerHTML = img1html;
}

// ====================================

function splitEffect(svg, idPrefix, imgW, imgH) {

  function setAnimAttrs(anim, linkId) {
    anim.setAttribute('calcMode', 'spline');
    anim.setAttribute('keyTimes', '0;1');
    anim.setAttribute('keySplines',
      (1 - (DEFAULT_PART_H * index + partH) / imgH) +
      ' 0.0 1.0 ' + LAST_SPEED);
    anim.setAttribute('begin', 'indefinite');
    anim.setAttribute('dur',
      (START_DURATION - durationOffset * index) + 's');
    anim.setAttribute('repeatCount', '1');
    anim.setAttribute('fill', 'freeze');
    if (linkId) {
      anim.setAttributeNS('http://www.w3.org/1999/xlink',
        'href', '#' + linkId);
    }
  }

  var DEFAULT_PART_H = 30, START_OFFSET_Y = -60, OFFSET_RANGE_RATIO = 1,
    START_DURATION = 1, LAST_SPEED = '0.9', MAX_ANGLE = 40,
    NS = svg.namespaceURI,

    imageId = idPrefix + '-img-base',
    partCenterX = imgW / 2, partCenterY,
    offsetRange = imgW * OFFSET_RANGE_RATIO,
    durationOffset = START_DURATION / Math.ceil(imgH / DEFAULT_PART_H),
    clipPathId, partSvgId, partSvgY, partH, imageSpanH,
    animList = [], index = -1,

    clipPath, rect, partSvg, use, anim,
    defs = document.createElementNS(NS, 'defs'),
    image = document.createElementNS(NS, 'image');

  image.id = imageId;
  image.width.baseVal.value = imgW;
  image.height.baseVal.value = imgH;
  defs.appendChild(image);
  svg.appendChild(defs);

  while (true) {
    index++;

    clipPathId = idPrefix + '-img-c' + index;
    partSvgId = idPrefix + '-img-p' + index;

    partH = DEFAULT_PART_H;
    imageSpanH = imgH - DEFAULT_PART_H * index;
    if (imageSpanH <= 0) { break; }
    if (partH > imageSpanH) { partH = imageSpanH; }
    partCenterY = DEFAULT_PART_H * index + partH / 2;
    partSvgY = START_OFFSET_Y/* - DEFAULT_PART_H * index*/ - imgH;

    clipPath = document.createElementNS(NS, 'clipPath');
    clipPath.id = clipPathId;
    rect = document.createElementNS(NS, 'rect');
    rect.width.baseVal.value = imgW;
    rect.height.baseVal.value = partH;
    if (index > 0) { rect.y.baseVal.value = DEFAULT_PART_H * index; }
    clipPath.appendChild(rect);
    defs.appendChild(clipPath);

    partSvg = document.createElementNS(NS, 'svg'); // for FF
    partSvg.id = partSvgId;
    partSvg.style.overflow = 'visible';
    partSvg.y.baseVal.value = partSvgY;

    use = document.createElementNS(NS, 'use');
    use.href.baseVal = '#' + imageId;
    use.setAttribute('clip-path', 'url(#' + clipPathId + ')');

    anim = document.createElementNS(NS, 'animateTransform');
    anim.setAttribute('attributeName', 'transform');
    anim.setAttribute('type', 'rotate');
    anim.setAttribute('values', Math.floor(Math.random() * MAX_ANGLE + 1) +
      ',' + partCenterX + ',' + partCenterY +
      ';0,' + partCenterX + ',' + partCenterY);
    setAnimAttrs(anim);
    animList.push(anim);

    use.appendChild(anim);
    partSvg.appendChild(use);
    svg.appendChild(partSvg);

    anim = document.createElementNS(NS, 'animate');
    anim.setAttribute('attributeName', 'x');
    anim.setAttribute('values', (Math.floor(
      Math.random() * (offsetRange * 2 + 1)) - offsetRange) + ';0');
    setAnimAttrs(anim, partSvgId);
    animList.push(anim);
    svg.appendChild(anim);

    anim = document.createElementNS(NS, 'animate');
    anim.setAttribute('attributeName', 'y');
    anim.setAttribute('values', partSvgY + ';0');
    setAnimAttrs(anim, partSvgId);
    animList.push(anim);
    svg.appendChild(anim);
  }

  animList.unshift(image);
  return animList;
}

function img2EffectStart() {
  img2svg = document.getElementById('sample-04-02');
  img2anim1 = document.getElementById('sample-04-02-anim-01');
  img2anim2 = document.getElementById('sample-04-02-anim-02');
  animList = splitEffect(img2svg, 'sample-04-02', 224, 147);
  img2image = animList.shift();
  img2svg.setAttribute('class', 'cover');
  img2anim1.beginElement(); // for Chrome
}

function img2EffectStop(url, cb) {
  img2image.href.baseVal = url;
  img2anim2.beginElement();
  setTimeout(function() {
    img2anim1.endElement();
    animList.forEach(function(anim) { anim.beginElement(); });
    setTimeout(function() {
      img2svg.setAttribute('class', 'stopped'); // hide
      cb();
    }, 1100);
  }, 900);
}

function img2EffectReset() {
  img2element.style.backgroundImage = 'none';
  img2element.className = '';
  img2element.innerHTML = img2html;
}

// ====================================

function img3EffectStart() {
  img3svg = document.getElementById('sample-04-03');
  img3symbol1use = document.getElementById('sample-04-03-symbol1-use');
  img3symbol2 = document.getElementById('sample-04-03-symbol2');
  img3anim1 = document.getElementById('sample-04-03-anim-01');
  img3anim2 = document.getElementById('sample-04-03-anim-02');
  img3anim3 = document.getElementById('sample-04-03-anim-03');
  img3anim4 = document.getElementById('sample-04-03-anim-04');
  img3anim5 = document.getElementById('sample-04-03-anim-05');
  img3image = document.getElementById('sample-04-03-image');
  img3svg.setAttribute('class', 'cover');
  img3anim1.beginElement(); // for Webkit
  img3anim2.beginElement();
  img3anim3.beginElement();
  setTimeout(function() {// for Webkit
    img3symbol1use.setAttribute('class', 'running');
    img3symbol2.setAttribute('class', 'running');
  }, 10);
}

function img3EffectStop(url) {
  img3image.href.baseVal = url;
  img3symbol1use.removeAttribute('class');
  img3symbol2.removeAttribute('class');
  img3anim1.endElement();
  img3anim2.endElement();
  img3anim3.endElement();
  img3anim4.beginElement();
  img3anim5.beginElement();
  setTimeout(function() {
    img3svg.setAttribute('class', 'stopped'); // hide
  }, 2500);
}

function img3EffectReset() {
  img3element.style.backgroundImage = 'none';
  img3element.className = '';
  img3element.innerHTML = img3html;
}

// ====================================

function effectStart(event) {
  switch (event.eagerImageLoader.stepIndex) {
    case 0: img1EffectStart(); break;
    case 1: img2EffectStart(); break;
    case 2: img3EffectStart(); break;
  }
}

function effectStop(event) {
  var url = this.background,
    cb = function() { event.eagerImageLoader.start(); };
  switch (event.eagerImageLoader.stepIndex) {
    case 0: img1EffectStop(url, cb); break;
    case 1: img2EffectStop(url, cb); break;
    case 2: setTimeout(function() { img3EffectStop(url); }, 5000); break;
  }
}

function effectReset() {
  img1EffectReset();
  img2EffectReset();
  img3EffectReset();
}

if (!document.createElementNS || !/SVGAnimate/.test(({}).toString.call(
    document.createElementNS('http://www.w3.org/2000/svg', 'animate')))) {
  img1element.innerHTML = img2element.innerHTML = img3element.innerHTML =
    '<p>This sample does not work in this browser.</p>';
  window.sample04EffectStart =
    window.sample04EffectStop =
    window.sample04EffectReset = function() {};
} else {
  window.sample04EffectStart = effectStart;
  window.sample04EffectStop = effectStop;
  window.sample04EffectReset = effectReset;
}

})();
