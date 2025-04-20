const tf = require('@tensorflow/tfjs');
const path = require('path');

let model;

const loadModel = async () => {
  try {
    // Initialize TensorFlow.js
    await tf.ready();
    console.log('TensorFlow.js initialized');
    
    // Load model directly from files
    console.log('Loading model...');
    const modelPath = path.join(__dirname, '../tfjs/model.json');
    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log('✅ Model loaded successfully');
    
    // Test the model with a test tensor
    console.log('Testing model with test tensor...');
    const testTensor = tf.zeros([1, 128, 128, 3]);
    const testPrediction = await model.predict(testTensor);
    console.log('✅ Model test prediction successful');
    console.log('Test prediction shape:', testPrediction.shape);
    
    // Check model summary
    console.log('Model summary:');
    console.log(model.summary());
    
    // Test with random data
    console.log('Testing with random data...');
    const randomData = tf.randomNormal([1, 128, 128, 3]);
    const randomPrediction = await model.predict(randomData);
    console.log('✅ Random data test successful');
    console.log('Random prediction shape:', randomPrediction.shape);
    
    // Test with zeros tensor
    console.log('Testing with zeros tensor...');
    const zerosTensor = tf.zeros([1, 128, 128, 3]);
    const zerosPrediction = await model.predict(zerosTensor);
    console.log('✅ Zeros tensor test successful');
    console.log('Zeros prediction shape:', zerosPrediction.shape);
    
    return model;
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
};

// Initialize model loading
(async () => {
  try {
    console.log('Starting model initialization...');
    model = await loadModel();
    console.log('✅ Model ready to use');
  } catch (error) {
    console.error('❌ Failed to load model:', error);
    process.exit(1);
  }
})();

// Export the model and loadModel function
module.exports = {
  model,
  loadModel,
  getModel: () => model
};
