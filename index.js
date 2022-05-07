const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { config } = require('dotenv');
const jwt = require('jsonwebtoken');
const verify = require('jsonwebtoken/verify');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();
// middleware

app.use(cors());
app.use(express.json());

const tokenVerify = (req, res, next) => {
    const headerInfo = req.headers.authorization;
    
    if (!headerInfo) {
        return res.status(401).send({message: 'Unauthorized Access'})
    }
    const token = headerInfo.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
          return  res.status(403).send({message: 'Forbidden Access'})
        }
        req.decoded = decoded;
        next();
    })
   
    
}

app.get('/', (req, res) => {
    res.send('Inventory Server is running');

})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@furniture-inventory-man.tnveo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const furnitureCollection = client.db("inventory").collection("furnitures");
        // const furnitureCollection = client.db("inventory").collection("myItems");


        // Secure API
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            
            res.send({ accessToken });
        })

        // GET: get all furniture and send back to client
        app.get('/furnitures', async (req, res) => {
            const query = {};
            const cursor = furnitureCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
            
        });

        // POST: Post in the furniture collections 
        app.post('/furnitures', async (req, res) => {
            const furnitures = req.body;
            const result = await furnitureCollection.insertOne(furnitures);
            res.send(result);
        } )


        // DELETE: delete item from manage Inventories 
        app.delete('/furnitures/:id', async (req, res) => {
            const id = req.params.id;
            
            const query = { _id: ObjectId(id) };
            const result = await furnitureCollection.deleteOne(query);
            res.send(result);
            
        })

        // find single furniture details 
        app.get('/furnitures/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await furnitureCollection.findOne(query);
            
            res.send(result);
        })
        // update furniture quantity 
        app.put('/furnitures/:id', async (req, res) => {
            const id = req.params.id;
            const Updatefurniture = req.body;
            const filter = { _id: ObjectId(id) }

            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: Updatefurniture.quantity
                }
            };
            const result = await furnitureCollection.updateOne(filter,updateDoc,options);
            
            res.send(result);
        })

        app.post('/myItems', async (req, res) => {
            const myFruniture = req.body;
            
            const result = await furnitureCollection.insertOne(myFruniture);
            res.send(result);
        })
        
        app.get('/myItems', tokenVerify, async (req, res) => {

            const decodedEmail = req.decoded.email;
            const userEmail = req.query.email;
           
            if (userEmail !== decodedEmail) {
                res.status(403).send({message: 'Forbidden Request'})
            }
            else {
                const query = { email: userEmail };
                const cursor = furnitureCollection.find(query);
                const myItems = await cursor.toArray();
                res.send(myItems);
            }
            
            
        })
        app.delete('/myItems/:id', async (req, res) => {
            const id = req.params.id;
            
            const query = { _id: ObjectId(id) };
            const result = await furnitureCollection.deleteOne(query);
            res.send(result);
            
        })
    } finally {
        
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log('listening port',port);
})