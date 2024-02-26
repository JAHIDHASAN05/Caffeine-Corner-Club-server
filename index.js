const express = require('express')
const app= express();
const cors= require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qm82exp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

        const database= client.db("coffeesDB")
        const coffeesCollection= database.collection('coffees')

        app.post('/coffees', async(req, res)=>{
            console.log(req.body)
            const newCoffe= req.body;
            const result= await coffeesCollection.insertOne(newCoffe)
            res.send(result)

        })

        app.get('/coffees', async(req, res)=>{
            const cursor= coffeesCollection.find()
            const result= await cursor.toArray()
            res.send(result)

        })
        app.get('/coffees/:id',async (req, res)=>{
            const id= req.params.id;
            const query= {_id : new ObjectId(id)}
            const result= await coffeesCollection.findOne(query)
            res.send(result)
        })

        app.delete('/coffees/:id' , async(req, res)=>{
            const id = req.params.id;
            const query= {_id : new ObjectId(id)}
            const result = await coffeesCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/coffees/:id' , async(req, res)=>{
            console.log(req.body)
            const id= req.params.id;
            const coffee= req.body;
            const filter= {_id : new ObjectId(id)};
            const option= {upsert: true };
            const  updatedCoffe={
                $set:{
                    name: coffee.name,
                    quantity : coffee.quantity,
                    supllier: coffee.supllier,
                    test : coffee.test, 
                    category: coffee.category,
                    detail: coffee.detail,
                    photo: coffee.photo,
                }
            }

            const result= await  coffeesCollection.updateOne(filter , updatedCoffe, option);
            res.send(result)
        })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send("clffe3 is running")
})

app.listen(port, ()=>{
    console.log(`server runnitn at ${port}`)
})