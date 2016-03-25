// Tandygram Viewer
// Base size of our tangram, doesn't need to be the same
var baseSize = 500;

var savedShapes = [];

var shapesRequest = new XMLHttpRequest();
shapesRequest.open('GET', '/api/composites', true);

shapesRequest.onload = function(){
  if (shapesRequest.status >= 200 && shapesRequest.status < 400) {
    // Success!
    savedShapes = JSON.parse(shapesRequest.responseText);
    play(savedShapes, 4000, 2000);
  } else {
    // We reached our target server, but it returned an error
    alert('error');
  }
};

shapesRequest.send();


// Rotation helper function
var rotate = function(paper, element, degrees) {
  element.matrix.rotate(degrees, element.centerX, element.centerY);
};

// Instantiate initial colorless shapes
var s = Snap("#tandy-svg");

var rightTriA = rightTriangle(s, 0, 0, baseSize);

var rightTriB = rightTriangle(s, 0, 0, baseSize);

var rightTriC = rightTriangle(s, 0, 0, baseSize * (Math.sqrt(2) / 2));

var rightTriD = rightTriangle(s, 0, 0, baseSize / 2);

var rightTriE = rightTriangle(s, 0, 0, baseSize / 2 );

var squareA = square(s, 0, 0, baseSize * (Math.sqrt(2) / 4));

var parallelogramA = parallelogram(s, 0, 0, baseSize / 2);

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
  //var orderTimer = setTimeout(function(){
  //  nextSet.order.forEach(function(ordinal){
  //    // Get the shapes dom node and make it the last
  //    // one inside the parent
  //    shapeEl = shapes[ordinal].node;
  //    shapeEl.parentNode.appendChild(shapeEl);
  //  });
  //}, 200);

  console.log(nextSet);

  if (!animating) {
    shapes.forEach(function(currentShape) {
      // Get the next shape in the set
      var nextShape = nextSet.members.filter(function(member){
        return currentShape.id == member.id;
      });

      nextShape = nextShape[0];

      // Clone shape to transform its matrix
      clone = currentShape;
      console.log(currentShape.degrees, 'current');
      console.log(nextShape.degrees, 'next');
      console.log(nextShape.degrees - currentShape.degrees, 'difference');
      rotate(s, clone, nextShape.degrees - currentShape.degrees);
      currentShape.degrees = nextShape.degrees;
      clone.matrix.e = nextShape.e;
      clone.matrix.f = nextShape.f;

      animating = true;

      currentShape.animate({
        transform: clone.matrix,
        fill: nextShape.color
      }, animationTime, mina.bounce, function(){
        //clearTimeout(orderTimer);
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
  i = 0;
  if (transitionTime > animationTime) {
    setInterval(function(){
      i ++;
      if (i >= playShapes.length) i = 0;

      transition(playShapes[i], animationTime);
    }, transitionTime);
  } else {
    alert('You have to set a transition time that\'s longer than the animation time.');
  }
};