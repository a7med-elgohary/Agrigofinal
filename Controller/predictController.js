const fs = require("fs");
const tf = require("@tensorflow/tfjs");
const { classNames } = require("../config/classNames");
const modelLoader = require("../model/modelloader");
const sharp = require('sharp');

// Initialize model before controller is ready
let initialized = false;
let currentModel;

const initializeModel = async () => {
  try {
    if (!initialized) {
      await modelLoader.loadModel();
      currentModel = modelLoader.getModel();
      initialized = true;
      console.log('✅ Model initialized in controller');
    }
    return currentModel;
  } catch (error) {
    console.error('Failed to initialize model:', error);
    throw error;
  }
};

const predictImage = async (req, res) => {
  try {
    console.log('Starting prediction...');
    
    // Ensure model is initialized
    const model = await initializeModel();
    console.log('✅ Model is ready');

    // Read and process image
    console.log('Reading and processing image...');
    const imageBuffer = fs.readFileSync(req.file.path);
    
    // Process image
    console.log('Processing image...');
    const processedImage = await sharp(imageBuffer)
      .resize(128, 128, {
        fit: 'fill',
        position: 'centre'
      })
      .toFormat('jpeg', {
        quality: 90
      })
      .toBuffer();

    // Check image metadata
    const image = sharp(processedImage);
    const metadata = await image.metadata();
    console.log('Image metadata:', {
      width: metadata.width,
      height: metadata.height,
      channels: metadata.channels
    });

    // Create tensor from processed image
    console.log('Creating tensor...');
    // Convert image buffer to tensor using raw pixel data
    // Get raw pixel data
    const { data } = await image.raw().toBuffer({ resolveWithObject: true });
    
    // Create tensor from raw pixel data
    const tensor = tf.tensor4d(
      new Uint8Array(data),
      [1, metadata.height, metadata.width, 3]
    );

    // Normalize the tensor values to be between 0 and 1
    const normalizedTensor = tensor.div(255.0);
    console.log('Tensor shape:', normalizedTensor.shape);
    console.log('✅ Tensor created');

    // Make prediction
    console.log('Making prediction...');
    const prediction = model.predict(tensor);
    const predictionArray = await prediction.array();
    console.log('✅ Prediction made');
    
    // Get the highest probability and its index
    const resultIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
    const diseaseName = classNames[resultIndex];
    const confidence = Math.max(...predictionArray[0]) * 100;
    
    console.log('Prediction result:', {
      disease: diseaseName,
      confidence: `${confidence.toFixed(2)}%`
    });

    // Clean up
    fs.unlinkSync(req.file.path);
    tensor.dispose();
    prediction.dispose();

    // Return prediction with disease name
    res.json({ 
      prediction: diseaseName,
      confidence: Math.max(...predictionArray[0]) * 100
    });
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Initialize model when controller is loaded
initializeModel();

module.exports = { predictImage };
