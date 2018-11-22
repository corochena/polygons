var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var W = canvas.getAttribute("width");
var H = canvas.getAttribute("height");

var ballRad = 18;
var cols = Math.floor(W / 5 / ballRad);
var rows = Math.floor(H / 5 / ballRad);
var colors = ["purple", "blue", "pink", "green", "red", "orange", "yellow"];
var sides = [3, 4, 5, 6, 8, Infinity];
var backg = "black";
var universe = new Set();
var stars = new Set(), nStars = 100, ptStar = 4, radStar = 4;
var lullaby = new Audio("259519__xtrgamr__music-box.wav");
var time = 0;
var secs = 0; // update
var images = [
  { src: "conejo.jpg", width: 485, height: 727 },
  { src: "pug.jpg", width: 388, height: 442 },
  { src: "carita.jpg", width: 323, height: 330 },
  { src: "carita2.jpg", width: 0, height: 0 },
  { src: "conpapi.jpg", width: 380, height: 475 },
  { src: "rayitas.jpg", width: 528, height: 834 },
  { src: "chineado.jpg", width: 0, height: 0 },
  { src: "chineado2.jpg", width: 0, height: 0 },
  { src: "llaves.jpg", width: 0, height: 0 },
  { src: "tierno.jpg", width: 0, height: 0 },
  { src: "dinos.jpg", width: 0, height: 0 },
  { src: "siman.jpg", width: 0, height: 0 },
  { src: "siman2.jpg", width: 0, height: 0 },
  { src: "rostipollo.jpg", width: 0, height: 0 },
  { src: "rostipollo2.jpg", width: 0, height: 0 },
  { src: "varones.jpg", width: 0, height: 0 }
];
var mat = document.createElement("img");

// llena el set con n estrellas
for (var i = 0; i < nStars; i++) {
  var x = Math.random() * W, y = Math.random() * H;
  stars.add({
    shape: "star",
    center: [x, y],
    rInt: Math.random() * radStar / 4,
    rOut: radStar * (1 / 2 + Math.random()),
    npoints: ptStar,
    angle: 0,
    color: "white",
    filled: true
  });
}

// llena el set universe con diferentes figuras geometricas
for (var j = 0; j < rows; j++) {
  for (var i = 0; i < cols; i++) {
    var color = colors[Math.floor(colors.length * Math.random())];
    var numSides = sides[Math.floor(sides.length * Math.random())];
    var numPoints = Math.floor(Math.random() * 3) + 4;
    var filled = Math.random() > 0.5;
    var phi = Math.random() * Math.PI;
    var x = (1 + 5 * i) * ballRad + 40 * Math.random();
    var y = 2 * (1 + 2.5 * j) * ballRad + 40 * Math.random();
    var rnd = Math.random();

    if (rnd < 0.5)
      universe.add({
        shape: "polygon",
        center: [x, y],
        radius: 1.5 * ballRad * (0.1 + Math.random()),
        angle: phi,
        sides: numSides,
        color: color,
        filled: filled
      });
    else if (rnd < 0.75) {
      universe.add({
        shape: "star",
        center: [x, y],
        rInt: (1 / 2 + Math.random()) * ballRad / 2,
        rOut: ballRad * (1 / 4 + Math.random()),
        npoints: numPoints,
        angle: 0,
        color: color,
        filled: filled
      });
    } else if (rnd < 0.88)
      universe.add({
        shape: "moon",
        center: [x, y],
        radius: 1.5 * ballRad * (0.1 + Math.random()),
        color: color,
        backcolor: backg
      });
    else if (rnd < 0.89)
      universe.add({
        shape: "yingyang",
        center: [x, y],
        radius: 1.5 * ballRad * (0.1 + Math.random()),
        angle: Math.random() * 4,
        color: color,
        backcolor: backg
      });
    else
      universe.add({
        shape: "comet",
        center: [x, y],
        radius: 1.5 * ballRad * (0.1 + Math.random()),
        color: color,
        backcolor: backg
      });
  }
}

requestAnimationFrame(animate);

function animate(t) {
  console.log(secs);
  
  ctx.fillStyle = backg;
  ctx.rect(0, 0, W, H);
  ctx.fill();

  // dibuja las estrellas
  stars.forEach(function(s) {
    star(
      ctx,
      s.center[0],
      s.center[1],
      s.rInt,
      s.rOut,
      s.npoints,
      s.angle + secs,
      s.color,
      s.filled
    );
  });

  // dibuja cada figura del universo segun su forma
  universe.forEach(function(fig) {
    if (fig.shape == "polygon")
      polygon(
        ctx,
        fig.center[0],
        fig.center[1],
        fig.radius,
        fig.angle + secs,
        fig.sides,
        fig.color,
        fig.filled
      );
    else if (fig.shape == "moon")
      moon(
        ctx,
        fig.center[0],
        fig.center[1],
        fig.radius,
        secs,
        fig.color,
        fig.backcolor
      );
    else if (fig.shape == "yingyang")
      comet(
        ctx,
        fig.center[0],
        fig.center[1],
        fig.radius,
        fig.angle + secs,
        fig.color,
        fig.backcolor,
        true
      );
    else if (fig.shape == "star")
      star(
        ctx,
        fig.center[0],
        fig.center[1],
        fig.rInt,
        fig.rOut,
        fig.npoints,
        fig.angle - secs,
        fig.color,
        fig.filled
      );
    else if (fig.shape == "comet")
      comet(
        ctx,
        fig.center[0],
        fig.center[1],
        fig.radius,
        t / 1e3,
        fig.color,
        fig.backcolor
      );
  });

  // dibuja la imagen de mateo y su nombre
  ctx.fillStyle = "black";
  ctx.rect(W / 2 - 110, H / 2 - 40, 250, 70);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "40px Calibri";
  ctx.fillText("Carlos Mateo", W / 2 - 100, H / 2 + 10);

  var xpos = W / 3 * (1 + Math.sin(t / 6000));
  var ypos = H / 3 * (1 - Math.sin(2 * t / 6000));
  if (time % 900 == 0)
    mat.src = images[Math.floor(Math.random() * images.length)].src;
  // ctx.drawImage(mat, 0, 0, 500, 800, xpos, ypos, 200, 320);

  // toca la cancion de cuna
  if (time % 900 == 0) lullaby.play();
  time++;

  secs += 1/60;
  requestAnimationFrame(animate);
}
/* 
    Este archivo contiene un grupo de funciones que dibujan diferentes figuras como poligonos regulares,
    estrellas, poligonos irregulares, lunas, yingyang, cometas, esferas, naves
*/

function polygon(ctx, x, y, radius, angle, sides, color, filled) {
  var points = vertices(x, y, radius, angle, sides);
  drawPoints(ctx, points, color, filled);
}

function star(ctx, x, y, rExt, rInt, nPoints, angle, color, filled) {
  var insidePoints = vertices(x, y, rInt, angle, nPoints);
  var outsidePoints = vertices(x, y, rExt, angle + Math.PI / nPoints, nPoints);
  var points = [];
  insidePoints.forEach(function(p, index) {
    points.push(p);
    points.push(outsidePoints[index]);
  });
  drawPoints(ctx, points, color, filled);
}

function vertices(x, y, rad, phi, sides) {
  // devuelve un arreglo con las coordenadas [x,y] de los vertices de un poligono regular de n lados
  var v = [];
  if (sides == Infinity) sides = 96;
  for (var n = 0; n <= sides; n++)
    v.push([
      x + rad * Math.cos(phi + 2 * Math.PI / sides * n),
      y - rad * Math.sin(phi + 2 * Math.PI / sides * n)
    ]);
  return v;
}

function drawPoints(ctx, points, color, filled) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.forEach(function(point) {
    ctx.lineTo(point[0], point[1]);
  });
  filled ? (ctx.fillStyle = color) : (ctx.strokeStyle = color);
  filled ? ctx.fill() : ctx.stroke();
}

function moon(ctx, x, y, rad, angle, color, back) {
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    x + 1.42 * rad * Math.cos(angle),
    y - 1.42 * rad * Math.cos(angle),
    rad,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = back;
  ctx.fill();
}

function comet(ctx, x, y, rad, angle, color, back, yingyang) {
  ctx.beginPath();
  ctx.arc(x, y, rad, angle, angle + Math.PI);
  ctx.arc(
    x - rad / 2 * Math.cos(angle),
    y - rad / 2 * Math.sin(angle),
    rad / 2,
    angle + Math.PI,
    angle
  );
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    x + rad / 2 * Math.cos(angle),
    y + rad / 2 * Math.sin(angle),
    rad / 2,
    angle,
    angle + 2 * Math.PI
  );
  ctx.fillStyle = back;
  ctx.fill();

  if (yingyang) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

function sphere(ctx, x, y, rad, color) {
  // dibuja el circulo grande
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, 7);
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;
  ctx.stroke();

  // dibuja las elipses punteadas
  var yratio = 0.1;
  ctx.scale(1, yratio);
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  var rArray = [
    [1, 0],
    [Math.sqrt(15) / 4, 1 / 4],
    [Math.sqrt(12) / 4, 2 / 4],
    [Math.sqrt(7) / 4, 3 / 4],
    [Math.sqrt(31) / 16, 15 / 16]
  ];
  var magik = 4.25;
  rArray.forEach(function(factor) {
    ctx.beginPath();
    ctx.arc(
      x,
      y * (1 - factor[1] * yratio * magik) / yratio,
      factor[0] * rad,
      0,
      7
    );
    ctx.moveTo(
      x + factor[0] * rad,
      y * (1 + factor[1] * yratio * magik) / yratio
    );
    ctx.arc(
      x,
      y * (1 + factor[1] * yratio * magik) / yratio,
      factor[0] * rad,
      0,
      7
    );
    ctx.stroke();
  });
  ctx.setLineDash([1, 0]);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function evilStar(ctx, x, y, rExt, rInt, tip, points, color) {
  polygon(ctx, x, y, rExt, Math.PI / points, points, color, false);
  star(ctx, x, y, rExt + tip, rInt, 3 / 2 * points, 0, color, false);
  //star(ctx, x, y, rExt-tip/2, rExt-tip/4, 20*points, -Math.PI/points/3, color, false);
  //polygon(ctx, x + rInt/5, y + rInt/5, rInt/20, 0, 4, color, false);
}

function spaceship(ctx, x, y, rad, color1, color2, num) {
  polygon(ctx, x, y, rad / 2, 0, 6, color1, false);
  ctx.beginPath();
  ctx.fillStyle = color2;
  ctx.arc(x + rad / 6, y + rad / 6, rad / 8, 0, 2 * Math.PI);
  ctx.fill();
  polygon(ctx, x + rad / 3, y + rad / 3, rad / 2, 0, 6, color1, false);
}

function deltaship(ctx, x, y, rad, angle, color1, color2) {
  polygon(ctx, x, y, rad, angle, 3, color1, false);
  comet(ctx, x, y, rad / 4, angle, color1, color2, true);
  polygon(
    ctx,
    x - rad * Math.cos(Math.PI / 3) - rad / 10,
    y - rad / 3,
    rad / 5,
    angle + Math.PI / 3,
    3,
    color1,
    true
  );
  polygon(
    ctx,
    x - rad * Math.cos(Math.PI / 3) - rad / 10,
    y + rad / 3,
    rad / 5,
    angle + Math.PI / 3,
    3,
    color1,
    true
  );
}

function danger(ctx, x, y, phi, rad1, rad2, color1, color2) {
  var centros = vertices(x, y, rad1, phi, 3);
  var centros2 = vertices(x, y, 5 / 4 * rad1, phi, 3);
  centros.forEach(function(c) {
    ctx.beginPath();
    ctx.arc(c[0], c[1], rad1, 0, 7);
    ctx.fillStyle = color1;
    ctx.fill();
  });
  centros2.forEach(function(c) {
    ctx.beginPath();
    ctx.arc(c[0], c[1], rad2, 0, 7);
    ctx.fillStyle = color2;
    ctx.fill();
  });
  polygon(ctx, x, y, rad1 / 5, phi, 6, color2, true);
}