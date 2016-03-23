// Tandygram Viewer
// Base size of our tangram, doesn't need to be the same
var baseSize = 500;

var sampleShapes = {
  "tangrams": [
    {"name":"Blake","client":"Mac","members":[{"id":0,"type":"tri","color":"rgb(229, 58, 45)","degrees":0,"e":450,"f":173},{"id":1,"type":"tri","color":"rgb(237, 168, 163)","degrees":0,"e":644,"f":3},{"id":2,"type":"tri","color":"rgb(181, 23, 12)","degrees":0,"e":317,"f":396},{"id":3,"type":"tri","color":"rgb(255, 109, 99)","degrees":0,"e":320,"f":468},{"id":4,"type":"tri","color":"rgb(232, 138, 132)","degrees":0,"e":207,"f":542},{"id":5,"type":"sq","color":"rgb(244, 157, 151)","degrees":0,"e":452,"f":348},{"id":6,"type":"pg","color":"rgb(247, 113, 103)","degrees":0,"e":771,"f":229}]},
    {"name":"Blake","client":"Mac","members":[{"id":0,"type":"tri","color":"rgb(229, 58, 45)","degrees":0,"e":75,"f":-92},{"id":1,"type":"tri","color":"rgb(237, 168, 163)","degrees":0,"e":505,"f":-86},{"id":2,"type":"tri","color":"rgb(181, 23, 12)","degrees":0,"e":429,"f":15},{"id":3,"type":"tri","color":"rgb(255, 109, 99)","degrees":0,"e":505,"f":91},{"id":4,"type":"tri","color":"rgb(232, 138, 132)","degrees":0,"e":253,"f":84},{"id":5,"type":"sq","color":"rgb(244, 157, 151)","degrees":0,"e":251,"f":88},{"id":6,"type":"pg","color":"rgb(247, 113, 103)","degrees":0,"e":731,"f":140}]},
    {"name":"Blake","client":"Mac","members":[{"id":0,"type":"tri","color":"rgb(229, 58, 45)","degrees":83,"e":573.4341000000001,"f":97.00470000000001},{"id":1,"type":"tri","color":"rgb(237, 168, 163)","degrees":97,"e":616.1589,"f":530.4544000000001},{"id":2,"type":"tri","color":"rgb(181, 23, 12)","degrees":82,"e":868.032,"f":162.50240000000002},{"id":3,"type":"tri","color":"rgb(255, 109, 99)","degrees":51,"e":517.4300318248754,"f":191.89124653473633},{"id":4,"type":"tri","color":"rgb(232, 138, 132)","degrees":82,"e":793.4289,"f":506.0973000000001},{"id":5,"type":"sq","color":"rgb(244, 157, 151)","degrees":55,"e":829.0944,"f":259.28739999999993},{"id":6,"type":"pg","color":"rgb(247, 113, 103)","degrees":106,"e":635.6038,"f":287.256}]},
    {"name":"Blake","client":"Mac","members":[{"id":0,"type":"tri","color":"rgb(229, 58, 45)","degrees":-7,"e":160.15090000000004,"f":338.1327},{"id":1,"type":"tri","color":"rgb(237, 168, 163)","degrees":-79,"e":-56.16589999999999,"f":437.0698},{"id":2,"type":"tri","color":"rgb(181, 23, 12)","degrees":-10,"e":410.1550999999999,"f":178.11040000000003},{"id":3,"type":"tri","color":"rgb(255, 109, 99)","degrees":-19,"e":112.84208087752583,"f":296.60675258510395},{"id":4,"type":"tri","color":"rgb(232, 138, 132)","degrees":-27,"e":497.999,"f":299.00380000000007},{"id":5,"type":"sq","color":"rgb(244, 157, 151)","degrees":-24,"e":514.6763,"f":472.59899999999993},{"id":6,"type":"pg","color":"rgb(247, 113, 103)","degrees":-703,"e":386.8428,"f":130.3928}]},
    {"name":"Blake","client":"Mac","members":[{"id":0,"type":"tri","color":"rgb(163, 244, 93)","degrees":138,"e":829.1459,"f":568.0049},{"id":1,"type":"tri","color":"rgb(255, 204, 206)","degrees":34,"e":726.9511,"f":65.3947},{"id":2,"type":"tri","color":"rgb(153, 134, 239)","degrees":-145,"e":566.996,"f":515.9887},{"id":3,"type":"tri","color":"rgb(242, 224, 169)","degrees":-257,"e":348.01118193030493,"f":193.94664688335985},{"id":4,"type":"tri","color":"rgb(152, 249, 232)","degrees":148,"e":549.3489000000001,"f":230.5688},{"id":5,"type":"sq","color":"rgb(234, 159, 177)","degrees":-69,"e":753.1023139455965,"f":496.6283223574857},{"id":6,"type":"pg","color":"rgb(211, 57, 193)","degrees":-122,"e":489.30861233754473,"f":388.31107149792655}]},
    {"name":"Blake","client":"Mac","members":[{"id":0,"type":"tri","color":"rgb(163, 244, 93)","degrees":199,"e":510.5339,"f":572.9198},{"id":1,"type":"tri","color":"rgb(255, 204, 206)","degrees":-104,"e":430.18340000000006,"f":659.686},{"id":2,"type":"tri","color":"rgb(153, 134, 239)","degrees":-157,"e":401.9078,"f":581.6328},{"id":3,"type":"tri","color":"rgb(242, 224, 169)","degrees":-164,"e":611.0858,"f":373.3787},{"id":4,"type":"tri","color":"rgb(152, 249, 232)","degrees":159,"e":429.2185,"f":661.309},{"id":5,"type":"sq","color":"rgb(234, 159, 177)","degrees":-102,"e":381.1462,"f":646.8034},{"id":6,"type":"pg","color":"rgb(211, 57, 193)","degrees":-235,"e":642.7659,"f":424.5799}]}
  ]
};


// Rotation helper function
var rotate = function(paper, element, degrees) {
  element.matrix.rotate(degrees, element.centerX, element.centerY);
  element.degrees += degrees;
  console.log(element.degrees);
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
  shape.attr({
    fill: colors[index]
  });
});