const fs = require("fs");
const tf = require("@tensorflow/tfjs-node");
const { classNames } = require("../config/classNames");
const { model } = require("../model/modelloader");
const predictImage = async (req, res) => {
  try {
    const imageBuffer = fs.readFileSync(req.file.path);

    const tensor = tf.node
      .decodeImage(imageBuffer, 3)
      .resizeBilinear([128, 128])
      .expandDims(0)
      .div(255.0);

    const prediction = model.predict(tensor);
    const predictionArray = await prediction.array();
    const resultIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));

    fs.unlinkSync(req.file.path);

    res.json({ prediction: classNames[resultIndex] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { predictImage };
