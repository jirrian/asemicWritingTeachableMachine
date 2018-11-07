// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
adapted from:
ml5 Example
KNN Classification on Webcam Images with mobileNet. Built with p5.js
=== */
let video;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
// Create a featureExtractor that can extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

var x = 0;
var y = 10;
var isWrite = 0;
var isWritelong = 0;

var cnv;

function setup() {
  // Create canvas on side
  cnv = createCanvas(windowWidth/2, windowHeight);
  cnv.position(windowWidth-width, 0);
  background(220,220,220);
  // Create a video element
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  // Create the UI buttons
  createButtons();
  noLoop();

  beginShape();
  curveVertex(x, y);
}

/* drawing functions
*/

function draw(){
  
  x=x+10;
  strokeWeight(3);
  stroke(0);
  noFill();

  //check if it's time to do functions
  if(isWrite == 1){
    write();
    isWrite = 0;
    isWritelong = 0;
  }
  
}

function write(){
  console.log("writing");
  
  if(isWritelong == 0){
    var bottom1 = int(random(30, 40));
    var bottom2 = int(random(30, 40));
  }
  else{
    var bottom1 = int(random(50, 80));
    var bottom2 = int(random(50, 80));
  }

  var top1 = int(random(10,20));
  var top2 = int(random(10,20));
  
curveVertex(x, y+bottom1);
  curveVertex(x+int(random(1,5)),  y+top1);
  curveVertex(x+int(random(5,8)),  y+top2);
    curveVertex(x+8,  y+bottom2);
 curveVertex(x+8,  y+bottom2);
  endShape();
}

function space(){
   console.log("space");
   x = x+10;
  beginShape();
  curveVertex(x, y);
}

function newline(){
  console.log("newline");
  y = y+10;
  x = 0;
  beginShape();
  curveVertex(x, y);
}

/* ml5 functions
*/

function modelReady(){
  select('#status').html('FeatureExtractor(mobileNet model) Loaded')
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(video);
  // You can also pass in an optional endpoint, defaut to 'conv_preds'
  // const features = featureExtractor.infer(video, 'conv_preds');
  // You can list all the endpoints by calling the following function
  // console.log('All endpoints: ', featureExtractor.mobilenet.endpoints)

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateExampleCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of classes from knnClassifier
  const numClasses = knnClassifier.getNumClasses();
  if (numClasses <= 0) {
    console.error('There is no examples in any class');
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  // Use knnClassifier to classify which class do these features belong to
  // You can pass in a callback function `gotResults` to knnClassifier.classify function
  knnClassifier.classify(features, gotResults);
  // You can also pass in an optional K value, K default to 3
  // knnClassifier.classify(features, 3, gotResults);

  // You can also use the following async/await function to call knnClassifier.classify
  // Remember to add `async` before `function predictClass()`
  // const res = await knnClassifier.classify(features);
  // gotResults(null, res);
}

// A util function to create UI buttons
function createButtons() {
  // When the A button is pressed, add the current frame
  // from the video with a label of "write" to the classifier
  buttonA = select('#addClassWrite');
  buttonA.mousePressed(function() {
    addExample('Write');
  });

  // When the B button is pressed, add the current frame
  // from the video with a label of "Space" to the classifier
  buttonB = select('#addClassSpace');
  buttonB.mousePressed(function() {
    addExample('Space');
  });

  // When the C button is pressed, add the current frame
  // from the video with a label of "Newline" to the classifier
  buttonC = select('#addClassNewline');
  buttonC.mousePressed(function() {
    addExample('Newline');
  });

  buttonD = select('#addClassWritelong');
  buttonD.mousePressed(function() {
    addExample('Writelong');
  });
  // Reset buttons
  resetBtnA = select('#resetWrite');
  resetBtnA.mousePressed(function() {
    clearClass('Write');
  });
	
  resetBtnB = select('#resetSpace');
  resetBtnB.mousePressed(function() {
    clearClass('Space');
  });
	
  resetBtnC = select('#resetNewline');
  resetBtnC.mousePressed(function() {
    clearClass('Newline');
  });

  resetBtnD = select('#resetNewline');
  resetBtnD.mousePressed(function() {
    clearClass('Writelong');
  });

  // Predict button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select('#clearAll');
  buttonClearAll.mousePressed(clearAllClasses);

  // Load saved classifier dataset
  buttonSetData = select('#load');
  buttonSetData.mousePressed(loadDataset);

  // Get classifier dataset
  buttonGetData = select('#save');
  buttonGetData.mousePressed(saveDataset);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confideces = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      select('#result').html(result.label);
      select('#confidence').html(`${confideces[result.label] * 100} %`);
      if(result.label == "Write"){
        isWrite = 1;
        redraw();
      }
      else if(result.label == "Writelong"){
        isWritelong = 1;
        isWrite = 1;
        redraw();
      }
      else if(result.label == "Space"){
        space();
      }
      else if(result.label == "Newline"){
        newline();
      }
    }

    select('#confidenceWrite').html(`${confideces['Write'] ? confideces['Write'] * 100 : 0} %`);
    select('#confidenceSpace').html(`${confideces['Space'] ? confideces['Space'] * 100 : 0} %`);
    select('#confidenceNewline').html(`${confideces['Newline'] ? confideces['Newline'] * 100 : 0} %`);
    select('#confidenceWritelong').html(`${confideces['Writelong'] ? confideces['Writelong'] * 100 : 0} %`);
  }

  classify();
}

// Update the example count for each class	
function updateExampleCounts() {
  const counts = knnClassifier.getClassExampleCountByLabel();

  select('#exampleWrite').html(counts['Write'] || 0);
  select('#exampleSpace').html(counts['Space'] || 0);
  select('#exampleNewline').html(counts['Newline'] || 0);
  select('#exampleWritelong').html(counts['Writelong'] || 0);
}

// Clear the examples in one class
function clearClass(classLabel) {
  knnClassifier.clearClass(classLabel);
  updateExampleCounts();
}

// Clear all the examples in all classes
function clearAllClasses() {
  knnClassifier.clearAllClasses();
  updateExampleCounts();
}

// Save dataset as myKNNDataset.json
function saveDataset() {
  knnClassifier.saveDataset('myDataset');
}

// Load dataset to the classifier
function loadDataset() {
  knnClassifier.loadDataset('./myDataset.json', updateExampleCounts);
}
