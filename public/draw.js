// Tandygram!

// Initial application configuration
// Base size of our tangram
var baseSize = 500;
// Speed of rotation (higher is slower)
var rotateSpeed = 8;

// Placeholder active shape until it is set
var activeShape = undefined;

// Pick random color scheme using randomColor
// https://github.com/davidmerfield/randomColor
var colorSchemes = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'monochrome'
];

var color = [];


var randomizeColors = function() {
  var randomScheme = Math.floor(Math.random() * 8);
  colors = randomColor({
    hue: colorSchemes[randomScheme],
    count: 8
  });
};

// Randomize colors to start
randomizeColors();

var observeActive = function(activeId){
  activeShape = undefined;

  shapes.forEach(function(shape) {
    if (shape.id === activeId) {
      shape.attr({
        stroke: colors[7],
        strokeWidth: baseSize/150
      });

      // Get the shapes dom node and make it the last
      // one inside the parent
      shapeEl = shape.node;
      shapeEl.parentNode.appendChild(shapeEl);

      // Get the layers without the active ID
      layers = layers.filter(function(id) {
        return id != activeId;
      });
      // And then push the active ID on the end
      layers.push(activeId);

      activeShape = shape;
    } else {
      shape.active = false;
      shape.attr({
        strokeWidth: 0
      })
    }
  });
};

var rotate = function(paper, element, degrees) {
  element.matrix.rotate(degrees, element.centerX, element.centerY);
  element.degrees += degrees;
  element.transform(element.matrix);
};

var s = Snap("#tandy-svg");

var rightTriA = rightTriangle(s, 0, 0, baseSize);
var rightTriB = rightTriangle(s, 0, 0, baseSize);
var rightTriC = rightTriangle(s, 0, 0, baseSize * (Math.sqrt(2) / 2));
var rightTriD = rightTriangle(s, 0, 0, baseSize / 2);
var rightTriE = rightTriangle(s, 0, 0, baseSize / 2 );
var squareA = square(s, 0, 0, baseSize * (Math.sqrt(2) / 4));
var parallelogramA = parallelogram(s, 0, 0, baseSize / 2);

shapes = [
    rightTriA,
    rightTriB,
    rightTriC,
    rightTriD,
    rightTriE,
    squareA,
    parallelogramA
];

layers = [];

var dragMove = function(dx,dy) {
  if(!rotating) {
    this.attr({
      transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
    });
  }
};

var dragStart = function() {
  this.data('origTransform', this.transform().local );
};

// For each shape, setup colors, add its ID to layers,
// and then bind our draggin' function
shapes.forEach(function(shape, index) {
  shape.id = index;
  layers.push(shape.id);

  shape.attr({
    fill: colors[index]
  });

  shape.drag(dragMove, dragStart);
});

//hammer touch events for rotating the shapes on mobile wo buttons
var tandyShape = document.getElementById('tandy-svg');
var mc = new Hammer.Manager(tandyShape);
var lastRotation = 0;
var rotating = false;
mc.add(new Hammer.Pan({ threshold: 1, pointers: 0 })).recognizeWith(mc.get('pan'));
mc.add(new Hammer.Rotate({ threshold: 0 }));

mc.on("rotate", onRotate);
mc.on("rotateend", function(){
  rotating = false
});

function onRotate(event) {
  console.log(lastRotation, deltaRotation);
  if (rotating && activeShape) {
    var deltaRotation = Math.abs(event.rotation - lastRotation);
    if (event.rotation > lastRotation) {
      rotate(s, activeShape, deltaRotation);
    } else {
      rotate(s, activeShape, -1 * deltaRotation);
    }
    lastRotation = event.rotation;
  } else {
    lastRotation = event.rotation;
    rotating = true;
  }
}

//color coordinating static elements
var footer = document.querySelector('.page-footer');
var tandyLogo = document.querySelector('.tandy-logo');
var tandyLogoStacked = document.querySelector('.modal-content .tandy-logo-stacked');
var modal = document.querySelector('.modal-content');
var toColorize = [footer, tandyLogo, tandyLogoStacked, modal];

var isTooLightYiq = function(hexColor) {
  var r = parseInt(hexColor.substr(1,2),16);
  var g = parseInt(hexColor.substr(3,2),16);
  var b = parseInt(hexColor.substr(5,2),16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;

  return yiq >= 140;
}

var lightenDarkenColor = function(col, amt) {
  var usePound = false;

  if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
  }

  var num = parseInt(col,16);
  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if  (r < 0) r = 0;

  var b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255;
  else if  (b < 0) b = 0;

  var g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

var incidentalColorizer = function(el) {
  if (colors.length) {
    if (isTooLightYiq(colors[7])) {
      el.style.backgroundColor = lightenDarkenColor(colors[7], -30);
    } else {
      el.style.backgroundColor = colors[7];
    }
  }
}

toColorize.forEach(function(el) {
  incidentalColorizer(el);
});


// Simple saving
var saveButton = document.querySelector('[data-button-save]');

var record = function() {
  var shapeObjects = {
    name: prompt('Would you like to name or note your Tandygram?'),
    members: [],
    // Shape layers array
    layers: layers
  };

  shapes.forEach(function(shape){
    var shapeJson = {
      id: shape.id,
      type: shape.type,
      size: shape.size,
      color: shape.attr('fill'),
      degrees: shape.degrees,
      e: shape.matrix.e,
      f: shape.matrix.f
    };

    shapeObjects.members.push(shapeJson);
  });

  return JSON.stringify(shapeObjects);
};

saveButton.addEventListener('click', function(event) {
  var request = new XMLHttpRequest();
  request.open('POST', '/api/composites', true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send(record());
  randomizeColors();
  shapes.forEach(function(shape, index) {
    shape.attr({
      fill: colors[index]
    });
  });
  //more color styling when the color scheme changes
  toColorize.forEach(function(el) {
    incidentalColorizer(el);
  });
});
