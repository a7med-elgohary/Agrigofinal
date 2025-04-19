const tf = require("@tensorflow/tfjs-node");

let model;

const loadModel = async () => {
  model = await tf.loadLayersModel("file://model_tfjs/model.json");
  console.log("✅ Model loaded!");
};

loadModel();

module.exports = { model };
