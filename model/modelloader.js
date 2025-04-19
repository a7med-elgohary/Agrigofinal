const tf = require("@tensorflow/tfjs");

let model;

const loadModel = async () => {
  try {
    // تحميل النموذج من مجلد dist/tfjs
    model = await tf.loadLayersModel('file://dist/tfjs/model.json');
    console.log("✅ Model loaded!");
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
};

loadModel();

module.exports = { model };
