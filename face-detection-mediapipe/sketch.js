// Face detection with mediapipe
// https://google.github.io/mediapipe/solutions/face_detection.html


let sketch = function(p) {
  let xmin;
  let xmax;
  let ymin;
  let ymax;

  let capture = p.createCapture(p.VIDEO); //this needs to be flipped across x axis

  p.setup = function() {
    p.createCanvas(cam_w, cam_h);
    p.rectMode(p.CENTER);
  }

  p.draw = function() {
    p.clear(0);

    if(detections != undefined) {
      if(detections.detections != undefined) {
       // console.log(detections.detections[0].boundingBox);
        p.drawFaces();
        // console.log(detections.detections);
        p.handlePixels();
      }
    }
  }

  p.drawFaces = function() {
    p.strokeWeight(3);

    for(let i = 0; i < detections.detections.length; i++) {

      // it's not necessary to create this boundingBox variable, but it makes for less typing and neater coder
      const boundingBox = detections.detections[i].boundingBox;
      xmin = p.width-boundingBox.xCenter*p.width - (boundingBox.width * p.width)/2;
      xmax = xmin + boundingBox.width * p.width;
      ymin = boundingBox.yCenter*p.height - (boundingBox.height * p.height)/2;
      ymax = ymin + boundingBox.height * p.height;
      p.noStroke();
      p.fill(0, 180, 255, 80);
      p.rect(p.width-boundingBox.xCenter*p.width, boundingBox.yCenter*p.height, boundingBox.width * p.width, boundingBox.height * p.height);
      //p.quad(xmin, ymin, xmin, ymax, xmax, ymax, xmax, ymin);

      let prevX;
      let prevY;
      //looping through landmaks, drawing points at them
      for(let j = 0; j < detections.detections[i].landmarks.length; j++) {
        const facePoint = detections.detections[i].landmarks[j]
        const x = p.width - (facePoint.x * p.width)
        const y = facePoint.y * p.height
        //p.point(x, y); //makes point at the landmark
       
        if (j%2 == 0){
          prevX = x;
          prevY = y;
        }
        p.stroke(255, 0, 255);
        p.line(x, y, prevX, prevY);

        p.stroke(0, 255, 0);
        p.text(j, x, y);
        //reassign prevX and prevY
        // prevX = x;
        // prevY= y;
      }
    }
  }

  p.handlePixels = function(){
    capture.loadPixels();

    const threshold = 150;

    for(let y = 0; y < p.height; y++) {
      for (let x = 0; x < p.width; x++) {
          const index = ((p.width - x) + y * p.width) * 4;

          const r = capture.pixels[index];
          const g = capture.pixels[index+1];
          const b = capture.pixels[index+2];

          // calculate the pixel brightness by finding the average of the three channels
          const brightness = p.floor((r + g + b) / 3)

          // if((brightness > threshold) && (xmin < x) && (x < xmax) && (ymin < y) && (y < ymax)) {
          //     capture.pixels[index] = 255-r;
          //     capture.pixels[index+1] = 255-g;
          //     capture.pixels[index+2] = 255-b;
          // }
          if((xmin < x) && (x < xmax) && (ymin < y) && (y < ymax)) {
            if((x%5 != 0) && (y%5 != 0)){
            capture.pixels[index] = 255-r;
            capture.pixels[index+1] = 255-g;
            capture.pixels[index+2] = 255-b;
            }
        }
          
      }
  }
  capture.updatePixels(); 
  p.push();
  // draw the updated webcam feed
    p.translate(capture.width, 0);
    p.scale(-1, 1);
    p.image(capture, 0, 0);    
  p.push();
  } 
}

let myp5 = new p5(sketch)