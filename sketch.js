let shape;
let song = [];
let ampScaler;
let amplitude;
let analyze;
let spectrum;
let baseScale = 8.5;
let rotVal = 0;
let rotRate = 0.05;
let songNum = 6;
let currentSong;
let chooseButton;

async function setup() {
  // Load the map and sound
  shape = await loadModel('./a-isle-3.stl',true);

  for (let i = 0; i < songNum; i++) {
    song[i] = await loadSound('./Akutan_MN-'+i+'.mp3');
    song[i].loop(false);
  }

  currentSong = int(random(songNum));
  console.log(currentSong);
  //song = await loadSound('/Akutan_MN.mp3');

  // Create the canvas and define environment
  createCanvas(600, 400, WEBGL);
  angleMode(DEGREES);
  frameRate(30);

  analyze = new p5.Amplitude();
  song[currentSong].connect(analyze);

  //
  chooseButton = createButton("New Song");
  chooseButton.mousePressed(newSong);
}

function draw() {
  strokeWeight(0.5);
  stroke(255);
  fill(0);
  background(0);
  // Enable orbiting with the mouse.
  //orbitControl();

  modelScale();

  // Draw the map
  translate(0,-95,0);
  rotateX(60);
  scale(baseScale,baseScale,ampScaler);
  rotVal = rotVal + rotRate;
  rotateZ(rotVal);
  model(shape);


}

function keyPressed() {
  if(!song[currentSong].playing) {
     song[currentSong].start();
  }
  else {
    song[currentSong].stop();
  }
}

function newSong() {
  if(!song[currentSong].playing) {
     currentSong = int(random(songNum));
     song[currentSong].connect(analyze);
  }
}

function modelScale() {
  if(song[currentSong].playing) {
    amplitude = analyze.getLevel();
    ampScaler = (amplitude*70)+baseScale;
    console.log(amplitude);
    console.log(ampScaler);
  }
}

