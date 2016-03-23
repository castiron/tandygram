// Tangram Ready Shape Generators
// ------------------------------
// Note that the sizing variable (width/hypotenuse etc) should always
// be a factor of the Tangram base size to use as part of a tangram

var rightTriangle = function(paper, startX, startY, hypotenuse, id) {
  var tri = paper.polygon(
    startX, startY,
    startX, startY + (hypotenuse * (Math.sqrt(2)/2)),
    startX + (hypotenuse * (Math.sqrt(2)/2)), startY + (hypotenuse * (Math.sqrt(2)/2))
  );
  tri.type = 'tri';
  tri.size = hypotenuse;
  tri.id = id ? id : 0;
  tri.centerX = startX + (hypotenuse * (Math.sqrt(2)/6));
  tri.centerY = startY + (2 * hypotenuse * (Math.sqrt(2)/6));

  tri.degrees = 0;

  tri.xPos = tri.centerX;
  tri.yPos = tri.centerY;

  tri.bBox = tri.getBBox();

  tri.active = false;

  tri.mousedown(function(){
    tri.active = true;
    observeActive(tri.id);
  });
  return tri;
};

var square = function(paper, startX, startY, width, id) {
  var sq = paper.polygon(
    startX, startY, 
    startX, startY + width, 
    startX + width, startY + width, 
    startX + width, startY
  );
  sq.type = 'sq';
  sq.size = width;
  sq.id = id ? id : 0;
  sq.centerX = startX + (width / 2);
  sq.centerY = startY + (width / 2);

  sq.degrees = 0;

  sq.xPos = sq.centerX;
  sq.yPos = sq.centerY;

  sq.bBox = sq.getBBox();

  sq.active = false;

  sq.mousedown(function(){
    sq.active = true;
    observeActive(sq.id);
  });
  return sq;
};

var parallelogram = function(paper, startX, startY, base, id) {
  var pg = paper.polygon(
    startX, startY,
    startX - (base / 2), startY + (base / 2),
    startX + (base / 2), startY + (base / 2),
    startX + base, startY
  );
  pg.type = 'pg';
  pg.size = base;
  pg.id = id ? id : 0;
  pg.centerX = startX + (base / 8);
  pg.centerY = startY + (base / 8);

  pg.degrees = 0;

  pg.xPos = pg.centerX;
  pg.yPos = pg.centerY;

  pg.bBox = pg.getBBox();

  pg.active = false;

  pg.mousedown(function(){
    pg.active = true;
    observeActive(pg.id);
  });
  return pg;
};