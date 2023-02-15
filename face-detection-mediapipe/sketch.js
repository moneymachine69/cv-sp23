// Face detection with mediapipe
// https://google.github.io/mediapipe/solutions/face_detection.html

let sketch = function(p) {

  p.setup = function() {
    p.createCanvas(cam_w, cam_h);
    p.rectMode(p.CENTER);
  }

  p.draw = function() {
    p.clear(0);

    if(detections != undefined) {
      if(detections.detections != undefined) {
        //console.log(detections);
        p.drawFaces();
        // console.log(detections.detections);
      }
    }
  }

  p.drawFaces = function() {
    p.strokeWeight(3);

    for(let i = 0; i < detections.detections.length; i++) {

      // it's not necessary to create this boundingBox variable, but it makes for less typing and neater coder
      const boundingBox = detections.detections[i].boundingBox;
      p.noStroke();
      p.fill(0, 180, 255, 80);
      p.rect(p.width-boundingBox.xCenter*p.width, boundingBox.yCenter*p.height, boundingBox.width * p.width, boundingBox.height * p.height);

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
}

let myp5 = new p5(sketch)