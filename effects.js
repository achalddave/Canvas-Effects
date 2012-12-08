// credit http://paulirish.com/2011/requestanimationframe-for-smart-animating/
var requestAnimation = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ) { window.setTimeout(callback, 1000 / 60); };
})();

function GradientCalculator(startGradient, endGradient, duration, easing) {
  this.startTime    = +(new Date());
  this.startInner   = this.hexToRgbArr(startGradient[0]);
  this.startOuter   = this.hexToRgbArr(startGradient[1]);
  this.endInner     = this.hexToRgbArr(endGradient[0]);
  this.endOuter     = this.hexToRgbArr(endGradient[1]);
  this.currentInner = this.startInner.slice(0);
  this.currentOuter = this.startOuter.slice(0);
  this.duration     = duration;

  if (typeof easing == 'string') {
    this.easing = this.getEasingFunction(easing);
    if (this.easing == null) {
      throw new Error("Invalid easing function: ", easing);
    }
  }
}

GradientCalculator.prototype.getNextColors = function() {
  if (!this.startTime) this.startTime = Date.now();
  for (var i = 0; i < 3; i++) { // loop through the colors
    this.currentInner[i] = this.easing(this.startInner[i], this.endInner[i]);
    this.currentOuter[i] = this.easing(this.startOuter[i], this.endOuter[i]);
  }
  return [this.currentInner, this.currentOuter]
}

GradientCalculator.prototype.hexToRgbArr = function(hex) {
  // credit: http://stackoverflow.com/questions/5623838/
  // result becomes array of hex digits; 0th index is last matched characters
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

GradientCalculator.prototype.rgbArrToHex = function(arr) {
  var r = arr[0], g = arr[1], b = arr[2];
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

GradientCalculator.prototype.getEasingFunction = function(easingType) {
  var self = this;
  var easings = {
    sine : function(startValue, endValue) {
      var scaler = self.duration/Math.PI*2,
          timeDifference = Date.now() - self.startTime,
          scaledDiff = timeDifference/scaler;
      return startValue + (endValue-startValue)*Math.sin(scaledDiff);
    }
  }

  if (easingType in easings) {
    return easings[easingType];
  } else {
    return null;
  }
}

function Circle() { /* not much to see here */ }

Circle.prototype.draw = function(context, x, y, r, gradArr) {
  this.context = context,
  this.x = x,
  this.y = y,
  this.r = r;

  var radialGradient = context.createRadialGradient(x,y,0,x,y,r);

  // set up the original gradient
  radialGradient.addColorStop(0, gradArr[0]);
  radialGradient.addColorStop(1, gradArr[1]);

  context.fillStyle = radialGradient;
  context.beginPath();
  context.arc(x, y, r, 0, 2*Math.PI, false);
  context.closePath();
  context.fill();

}

	// [start|grad]: array of two hex values
Circle.prototype.pulsate = function(startGradient, endGradient, duration, easing) {
  this.gradientCalculator = new GradientCalculator(startGradient, endGradient, duration, easing);

  var self = this,
      currentInner = [],
      currentOuter = [],
      nextColors = [],
      rgbArrToHex = this.gradientCalculator.rgbArrToHex;

  // update to use request animation frame
  this.animation = function() {
    nextColors   = self.gradientCalculator.getNextColors();
    currentInner = nextColors[0];
    currentOuter = nextColors[1];

    self.draw(self.context, self.x, self.y, self.r, [rgbArrToHex(currentInner), rgbArrToHex(currentOuter)]);

    requestAnimation(self.animation);
  }

  this.timer = requestAnimation(this.animation);
}
