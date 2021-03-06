// Tandygram Viewer
// Base size of our tangram, doesn't need to be the same
var baseSize = 430;

var savedShapes = [];

// Get title element in the DOM
var tandyTitle = document.getElementById('tandy-title');

var getShapes = function() {
  var shapesRequest = new XMLHttpRequest();
  shapesRequest.open('GET', '/api/composites', true);

  shapesRequest.onload = function(){
    if (shapesRequest.status >= 200 && shapesRequest.status < 400) {
      // Success!
      savedShapes = JSON.parse(shapesRequest.responseText);

      if (savedShapes) {
        play(savedShapes, 4000, 2000);
      } else {
        alert('No shapes saved yet! Go make some Tandys.');
      }
    } else {
      // We reached our target server, but it returned an error
      alert('We reached our target server, but it returned an error.');
    }
  };

  shapesRequest.send();
};

// Get Shapes on Load
getShapes();

// Rotation helper function
var rotate = function(paper, element, degrees) {
  element.matrix.rotate(degrees, element.centerX, element.centerY);
};

// Instantiate initial colorless shapes
var s = Snap("#tandy-svg");

var rightTriA = rightTriangle(s, baseSize * 0.63, baseSize * 0.352, baseSize); //left big
var rightTriB = rightTriangle(s, baseSize * 0.964, baseSize * 0.015, baseSize); //top big
var rightTriC = rightTriangle(s, baseSize * 1.3697, baseSize * 0.826, baseSize * (Math.sqrt(2) / 2)); //right medium
var rightTriD = rightTriangle(s, baseSize * 1.083, baseSize * 0.756, baseSize / 2); //middle small
var rightTriE = rightTriangle(s, baseSize * 1.503, baseSize * 0.334, baseSize / 2 ); //right small
var squareA = square(s, baseSize * 1.275, baseSize * 0.645, baseSize * (Math.sqrt(2) / 4)); 
var parallelogramA = parallelogram(s, baseSize * 0.947, baseSize * 1.078, baseSize / 2);

var intitRotate = function(paper, element, degrees) {
  element.matrix.rotate(degrees, element.centerX, element.centerY);
  element.degrees += degrees;
  element.transform(element.matrix);
};

//set initial rotation for traditional tandy layout
intitRotate(s, rightTriA, 225);
intitRotate(s, rightTriB, 315);
intitRotate(s, rightTriC, 270);
intitRotate(s, rightTriD, 135);
intitRotate(s, rightTriE, 45);
intitRotate(s, squareA, 45);

// Build shapes array and assign ids by index just like draw view
shapes = [
  rightTriA,
  rightTriB,
  rightTriC,
  rightTriD,
  rightTriE,
  squareA,
  parallelogramA
];

shapes.forEach(function(shape, index) {
  shape.id = index;
});

animating = false;

transition = function(nextSet, animationTime) {
  if (!animating) {
    // Fade the title out immediately
    tandyTitle.classList.add('fade-out');

    var layerTimer = setTimeout(function(){
      // Fade in the title
      // Change the title and fade it in
      tandyTitle.childNodes[0].nodeValue = nextSet.name;
      tandyTitle.classList.remove('fade-out');

      nextSet.layers.forEach(function(ordinal){
        // Get the shapes dom node and make it the last
        // one inside the parent
        shapeEl = shapes[ordinal].node;
        shapeEl.parentNode.appendChild(shapeEl);
      });
    }, animationTime/5);

    shapes.forEach(function(currentShape) {
      // Get the next shape in the set
      var nextShape = nextSet.members.filter(function(member){
        return currentShape.id == member.id;
      });

      nextShape = nextShape[0];

      // Clone shape to transform its matrix
      clone = currentShape;
      rotate(s, clone, nextShape.degrees - currentShape.degrees);
      currentShape.degrees = nextShape.degrees;
      clone.matrix.e = nextShape.e;
      clone.matrix.f = nextShape.f;

      animating = true;

      currentShape.animate({
        transform: clone.matrix,
        fill: nextShape.color
      }, animationTime, mina.bounce, function(){
        clearTimeout(layerTimer);
        animating = false;
      });
    });
  }
};

i = 0;
window.addEventListener('keyup', function(event) {
  if (event.keyCode == 39 && !animating) {
    i ++;
    if (i >= savedShapes.length) i = 0;
    transition(savedShapes[i], 2000);
  }
});

play = function(playShapes, transitionTime, animationTime){
  var i = 0;
  if (transitionTime > animationTime) {
    var transitionInterval = setInterval(function(){
      if (i < playShapes.length) {
        transition(playShapes[i], animationTime);
        i ++;
      } else {
        clearInterval(transitionInterval);
        // Recursively get shapes without breaking the universe (please)
        getShapes();
      }
    }, transitionTime);
  } else {
    alert('You have to set a transition time that\'s longer than the animation time.');
  }
};