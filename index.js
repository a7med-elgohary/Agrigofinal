const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
require('dotenv').config()
const {errorhandler} = require('./middelwares/errorHandler')
const modelLoader = require("./model/modelloader");

// Start model server
require('./model/modelServer');

// Middleware
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Serve model files
app.use('/model', express.static(path.join(__dirname, 'tfjs')))

// Routes
app.get('/', (req, res) => {    
    res.send('Hello World in Green Api')
})

app.use("/api/flower" , require('./routes/FlowerRoute'))
app.use("/api/auth" , require('./routes/UserRoute'))
app.use("/api/notify" , require('./routes/NotifyRoute'))
app.use("/api/predict", require('./routes/PredictRoute'));
app.use(errorhandler)

// Listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})