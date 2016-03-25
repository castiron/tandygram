// Tandygram Viewer
// Base size of our tangram, doesn't need to be the same
var baseSize = 500;

var sampleShapes = [
  {"name":"bad dawg!","client":"Mac","order": [2,5,1,0,4,6,3],"members":[{"id":0,"type":"tri","size":500,"color":"rgb(211, 154, 249)","degrees":-314.438172670118,"e":537.6447000000001,"f":178.5236},{"id":1,"type":"tri","size":500,"color":"rgb(51, 0, 107)","degrees":-493.61657222364573,"e":707.5213,"f":696.6193},{"id":2,"type":"tri","size":353.5533905932738,"color":"rgb(181, 147, 249)","degrees":-96.81172396470356,"e":172.7426,"f":358.1766},{"id":3,"type":"tri","size":250,"color":"rgb(156, 57, 249)","degrees":-406.6038939783421,"e":575.8122000000001,"f":175.70009999999996},{"id":4,"type":"tri","size":250,"color":"rgb(112, 83, 181)","degrees":-406.4413587560438,"e":333.9211,"f":180.3498},{"id":5,"type":"sq","size":176.7766952966369,"color":"rgb(127, 89, 193)","degrees":-178.33456435006494,"e":710.1723,"f":508.3089},{"id":6,"type":"pg","size":250,"color":"rgb(121, 84, 188)","degrees":-444.3576722137315,"e":769.0767,"f":317.2788}]},
  {"name":"Das Boot","client":"Mac","order": [4,1,5,0,3,6,2],"members":[{"id":0,"type":"tri","size":500,"color":"rgb(252, 194, 213)","degrees":-405.6078057244682,"e":138.94020926035245,"f":520.0019343640529},{"id":1,"type":"tri","size":500,"color":"rgb(181, 71, 41)","degrees":-45.438067970033956,"e":415.2263,"f":517.2871},{"id":2,"type":"tri","size":353.5533905932738,"color":"rgb(209, 92, 77)","degrees":48.21876434311014,"e":504.0918,"f":155.4772},{"id":3,"type":"tri","size":250,"color":"rgb(255, 201, 208)","degrees":48.10075948032153,"e":511.2927334075696,"f":7.287826442903082},{"id":4,"type":"tri","size":250,"color":"rgb(209, 89, 46)","degrees":-133.52706551347012,"e":515.0597368485325,"f":344.7381887831713},{"id":5,"type":"sq","size":176.7766952966369,"color":"rgb(219, 94, 98)","degrees":0.504163045193593,"e":443.786,"f":586.2268},{"id":6,"type":"pg","size":250,"color":"rgb(255, 196, 207)","degrees":0,"e":777,"f":388}]},
  {"name":"anime hairdo","client":"Mac","order": [1,4,3,5,2,6,0],"members":[{"id":0,"type":"tri","size":500,"color":"rgb(53, 76, 160)","degrees":-314.4068971741412,"e":599.7679,"f":194.57830000000007},{"id":1,"type":"tri","size":500,"color":"rgb(157, 209, 232)","degrees":-81.21883726561452,"e":343.920362068863,"f":441.1894878382437},{"id":2,"type":"tri","size":353.5533905932738,"color":"rgb(27, 173, 183)","degrees":0,"e":696,"f":228},{"id":3,"type":"tri","size":250,"color":"rgb(14, 103, 104)","degrees":-219.44005273669043,"e":936.3005,"f":544.4327},{"id":4,"type":"tri","size":250,"color":"rgb(126, 160, 211)","degrees":-203.96248897457815,"e":573.636304165452,"f":672.6129150660263},{"id":5,"type":"sq","size":176.7766952966369,"color":"rgb(45, 37, 130)","degrees":0,"e":591,"f":478},{"id":6,"type":"pg","size":250,"color":"rgb(128, 189, 221)","degrees":0,"e":757,"f":528}]},
  {"name":"Üfrand","client":"Mac","order": [5,2,1,0,3,4,6],"members":[{"id":0,"type":"tri","size":500,"color":"rgb(124, 124, 124)","degrees":-224.2791593409067,"e":872.7821207367618,"f":179.17394978626726},{"id":1,"type":"tri","size":500,"color":"rgb(234, 234, 234)","degrees":-225.8162587903132,"e":1096.0155757978557,"f":256.4656434415272},{"id":2,"type":"tri","size":353.5533905932738,"color":"rgb(117, 117, 117)","degrees":-224.57059670263342,"e":225.66635203188872,"f":219.91213890853706},{"id":3,"type":"tri","size":250,"color":"rgb(84, 84, 84)","degrees":-224.1970139264571,"e":277.32911113545754,"f":152.26542369784843},{"id":4,"type":"tri","size":250,"color":"rgb(94, 94, 94)","degrees":-224.64849656012672,"e":729.6676,"f":225.2839},{"id":5,"type":"sq","size":176.7766952966369,"color":"rgb(40, 40, 40)","degrees":0,"e":232,"f":355},{"id":6,"type":"pg","size":250,"color":"rgb(219, 219, 219)","degrees":-313.917631621933,"e":588.0848,"f":359.0638}]}
];


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
  var orderTimer = setTimeout(function(){
    nextSet.order.forEach(function(ordinal){
      // Get the shapes dom node and make it the last
      // one inside the parent
      shapeEl = shapes[ordinal].node;
      shapeEl.parentNode.appendChild(shapeEl);
    });
  }, 200);

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
        clearTimeout(orderTimer);
        animating = false;
      });
    });
  }
};

i = 0;
window.addEventListener('keyup', function(event) {
  if (event.keyCode == 39 && !animating) {
    i ++;
    if (i >= sampleShapes.length) i = 0;
    transition(sampleShapes[i], 2000);
  }
});

play = function(transitionTime, animationTime){
  if (transitionTime > animationTime) {
    setInterval(function(){
      i ++;
      if (i >= sampleShapes.length) i = 0;

      transition(sampleShapes[i], animationTime);
    }, transitionTime);
  } else {
    alert('You have to set a transition time that\'s longer than the animation time.');
  }
};

play(4000, 2000);