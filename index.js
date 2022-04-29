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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@furniture-inventory-man.tnveo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const furnitureCollection = client.db("inventory").collection("furnitures");
        app.get('/furnitures', async (req, res) => {
            const query = {};
            const cursor = furnitureCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
            
        })


    } finally {
        
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log('listening port',port);
})