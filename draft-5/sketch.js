let shape;
let song = [];
let ampScaler = 0;
let amplitude;
let analyze;
let spectrum;
let baseScale = 9;
let rotVal = 0;
let rotRate = 0.05;
let songNum = 6;
let currentSong;
let chooseButton;
let firstPress = false;
let userPlay = false;
let redVal = 120;
let redDown = true;
let greenVal = 1;
let greenDown = false;
let blueVal = 1;
let blueDown = false;
let cam1;
let cam2;
let usingCam1 = true;
let xVal = 0;
let xTrig = false;
let xShift;
let yVal = 0;
let yTrig = false;
let yShift;
let rotX = 0;
let rotTrig = false;

// bloom from strands tutorial

//bloom stuff
let originalImage;
let bloomShader;

function bloomCallback() {
  // Receive the original image for use
  // in our shader.
  const preBlur = uniformTexture(originalImage);

  filterColor.begin();
  const blurred = getTexture(filterColor.canvasContent,
                             filterColor.texCoord);
  const original = getTexture(preBlur, 
                              filterColor.texCoord);
  
  const intensity = max(original, 0.2) * 10;
    
  const bloom = original + blurred * intensity;
  filterColor.set([bloom.rgb, 1]);
  filterColor.end();
}

async function setup() {
  // Load the map
  shape = await loadModel('../assets/a-isle-3.stl',true);

  // Load sounds, split into seperate files
  for (let i = 0; i < songNum; i++) {
    song[i] = await loadSound('../assets/Akutan_MN-'+i+'.mp3');
    song[i].loop(false);
  }

  // select a random starting song/sound
  currentSong = int(random(songNum));
  console.log(currentSong);

  // Create the canvas and define environment
  createCanvas(windowWidth*0.95, windowHeight*0.8, WEBGL);
  angleMode(DEGREES);
  frameRate(30);

  // Connect sound analysis
  analyze = new p5.Amplitude();
  song[currentSong].connect(analyze);

  // bloom
  originalImage = createFramebuffer();
  bloomShader = buildFilterShader(bloomCallback);

  // model move start
  xShift = random(2,10)/10;
  yShift = random(2,10)/10;
}

function draw() {
  originalImage.begin();
  // model drawing parameters
  strokeWeight(0.5);
  stroke(redVal,greenVal,blueVal);
  fill(redVal-10,greenVal,blueVal,30);

  // Draw background to create smooth motion
  background(0,210);

  // Run function to change mountain hight with sound
  modelScale();

  // Draw the map
  translate(0+xVal,0+yVal,0+ampScaler*10);
  rotateX(rotX);
  scale(baseScale,baseScale,ampScaler);
  //rotVal = rotVal + rotRate;
  rotateZ(rotVal);
  model(shape);
  translate(0+xVal,0+yVal,-100)
  plane(1000, 1000, 1, 1)
  originalImage.end();
  imageMode(CENTER);
  image(originalImage, 0, 0);
  filter(BLUR,25);
  filter(bloomShader);

  
  //song switch
  if(userPlay) {
   
    song[currentSong].onended(newSong)
    // if(song[currentSong].playing){
    //   console.log("song is playing");
    // } else {
    //   newSong();
    //   song[currentSong].start();
    // }
  }

  redAnimation();
  greenAnimation();
  blueAnimation();
  xSlide();
  ySlide();
  modelRock();
  //console.log("X:"+xVal);
  //console.log("Y:"+yVal);
  //console.log("Rotation"+rotX);
}

function modelRock() {
  if(rotTrig) {
    rotX = rotX + 0.03;
    if(rotX >= 20) {
      rotTrig = false;
    }
  } else if(!rotTrig) {
    rotX = rotX - 0.03;
    if(rotX <= -20) {
      rotTrig = true;
    }
  }
}

function xSlide() {
  if(xTrig) {
    xVal = xVal + xShift;
    if(xVal >= 170) {
      xTrig = false;
      xShift = random(2,10)/10;
    }
  } else if(!xTrig) {
    xVal = xVal - xShift;
    if(xVal <= -170) {
      xTrig = true;
      xShift = random(2,10)/10;
    }
  }
}

function ySlide() {
  if(yTrig) {
    yVal = yVal + yShift;
    if(yVal >= 250) {
      yTrig = false;
      yShift = random(1);
    }
  } else if(!yTrig) {
    yVal = yVal - yShift;
    if(yVal <= -250) {
      yTrig = true;
      yShift = random(1);
    }
  }
}

function redAnimation() {
  if(redDown){
    redVal = redVal-0.1;
    if(redVal <= 60) {
      redDown = false;
    }
  } else if(!redDown) {
    redVal = redVal+0.1;
    if(redVal >= 240) {
      redDown = true;
    }
  }
}

function greenAnimation() {
  if(greenDown){
    let ranDown = random()/10;
    greenVal = greenVal-ranDown;
    if(greenVal <= 0.1) {
      greenDown = false;
    }
  } else if(!greenDown) {
    let ranUp = random()/10;
    greenVal = greenVal+ranUp;
    if(greenVal >= 50) {
      greenDown = true;
    }
  }
}

function blueAnimation() {
  if(blueDown){
    let ranDown = random()/10;
    blueVal = blueVal-ranDown;
    if(blueVal <= 0.1) {
      blueDown = false;
    }
  } else if(!blueDown) {
    let ranUp = random()/10;
    blueVal = blueVal+ranUp;
    if(blueVal >= 50) {
      blueDown = true;
    }
  }
}

// Start and stop sound
function keyPressed() {
  if(!firstPress) {
    song[currentSong].start();
    firstPress = true;
    userPlay = true;
  } else {
    if(!song[currentSong].playing) {
     song[currentSong].start();
     userPlay = true;
    }
    else {
      song[currentSong].pause();
      userPlay = false;
    }
  }
  
}

// Choose a new random song/sound
function newSong() {
  currentSong = int(random(songNum));
  song[currentSong].connect(analyze);
  console.log("New Song Picked!");
  console.log(currentSong);
  song[currentSong].start();
  song[currentSong].connect(analyze);
}

// Translate amplitude to model hight
function modelScale() {
  if(song[currentSong].playing) {
    amplitude = analyze.getLevel();
    ampScaler = (amplitude*50)+baseScale;
    // console.log(amplitude);
    // console.log(ampScaler);
  }
}
