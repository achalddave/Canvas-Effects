var canvas = document.getElementById('canvas');
var ctx		 = canvas.getContext("2d");

// [ gradient1, gradient2 ]
// gradient of form [ inner color, outer color ]
var gradColors = [['#C90000', '#960000'], ['#FF0000', '#960000']];

var circle = new Circle();
circle.draw(ctx, 250, 250, 250, gradColors[0]);
circle.pulsate(gradColors[0], gradColors[1], 1000, 'sine');
