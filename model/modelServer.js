const tf = require('@tensorflow/tfjs');
const path = require('path');
const express = require('express');
const app = express();

// Serve model files
const modelPath = path.join(__dirname, '../tfjs');
app.use('/model', express.static(modelPath));

// Test endpoint to verify model loading
app.get('/test', async (req, res) => {
  try {
    const model = await tf.loadLayersModel('http://localhost:3002/model/model.json');
    const testTensor = tf.zeros([1, 128, 128, 3]);
    const testPrediction = await model.predict(testTensor);
    res.json({ status: 'success', prediction: testPrediction.arraySync() });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start model server on port 3002
const PORT = 3002;
app.listen(PORT, async () => {
  try {
    // Test loading the model
    const model = await tf.loadLayersModel('http://localhost:3002/model/model.json');
    console.log('✅ Model loaded successfully on server');
    
    // Test prediction
    const testTensor = tf.zeros([1, 128, 128, 3]);
    const testPrediction = await model.predict(testTensor);
    console.log('✅ Model test prediction successful');
    
    console.log(`Model server running on port ${PORT}`);
  } catch (error) {
    console.error('Error loading model on server:', error);
    process.exit(1);
  }
});
