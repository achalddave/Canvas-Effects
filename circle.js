function Circle() { /* not much to see here */ }

Circle.prototype.draw = function(ctx, x, y, r, gradArr) {
  this.ctx = ctx,
  this.x = x,
  this.y = y,
  this.r = r;

  var radialGradient = ctx.createRadialGradient(x,y,0,x,y,r);

  // set up the original gradient
  radialGradient.addColorStop(0, gradArr[0]);
  radialGradient.addColorStop(1, gradArr[1]);

  ctx.fillStyle = radialGradient;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI, false);
  ctx.closePath();
  ctx.fill();
}

	// [start|grad]: array of two hex values
Circle.prototype.pulsate = function(startGrad, endGrad, duration, easing) {
  if (typeof easing == 'string') {
    if (easing in this.easingFunctions) {
      easing = this.easingFunctions[easing];
    } else {
      return;
    }
  }
  var startTime = +(new Date()),
      sl = hexToRgbArr(startGrad[0]), // start light array
      sd = hexToRgbArr(startGrad[1]), // start dark array
      el = hexToRgbArr(endGrad[0]),		// end light array
      ed = hexToRgbArr(endGrad[1]),		// end dark array
      cl = sl.slice(0), // current light colors
      cd = sd.slice(0); // current dark colors

  var self = this;

  // update to use request animation frame
  this.timer = setInterval(function() {
    var diff = +(new Date())-startTime;
    for (var i = 0; i < cl.length; i++) {
      cl[i] = easing(sl[i], el[i], diff, duration);
      cd[i] = easing(sd[i], ed[i], diff, duration);
    }
    self.draw(self.ctx, self.x, self.y, self.r, [rgbArrToHex(cl), rgbArrToHex(cd)]);
  }, 10);
  
  // credit: http://stackoverflow.com/questions/5623838/
  function hexToRgbArr(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
  }

  function rgbArrToHex(arr) {
    var r = arr[0], g = arr[1], b = arr[2];
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

}

// currently unused
// credit http://paulirish.com/2011/requestanimationframe-for-smart-animating/
Circle.prototype.requestAnim = function () {
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame 
  }

Circle.prototype.easingFunctions = {
  sine : function(start, end, time, duration) {
    var scaler = duration/Math.PI*2,
        scaledDiff = time/scaler;
    return start + (end-start)*Math.sin(scaledDiff);
 }
}
