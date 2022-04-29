const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { config } = require('dotenv');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();
// middleware

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Inventory Server is running');

})




app.listen(port, () => {
    console.log('listening port',port);
})