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
let firstPress = false;
let userPlay = false;

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
  
  const intensity = max(original, 0.2) * 18;
    
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
}

function draw() {
  originalImage.begin();
  // model drawing parameters
  strokeWeight(0.5);
  stroke(120,0,0);
  fill(0,190);

  // Draw background to create smooth motion
  background(0,190);

  // Run function to change mountain hight with sound
  modelScale();

  // Draw the map
  translate(0,-95,0+ampScaler*10);
  rotateX(60);
  scale(baseScale,baseScale,ampScaler);
  rotVal = rotVal + rotRate;
  rotateZ(rotVal);
  model(shape);
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
}

// Translate amplitude to model hight
function modelScale() {
  if(song[currentSong].playing) {
    amplitude = analyze.getLevel();
    ampScaler = (amplitude*70)+baseScale;
    // console.log(amplitude);
    // console.log(ampScaler);
  }
}

