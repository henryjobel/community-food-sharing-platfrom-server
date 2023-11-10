const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



//middleware

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cmmcrj9.mongodb.net/?retryWrites=true&w=majority`;

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

    const foodCollection = client.db('foodShare').collection('foods');
    const AvailableFoodCollection = client.db('foodShare').collection('availableFoods');
    const requestCollection = client.db('foodShare').collection('foodRequst');



    app.get('/foods', async(req,res) =>{
        const cursor =  foodCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get('/availableFoods', async(req,res) =>{
        const cursor =  AvailableFoodCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get('/availableFoods/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await AvailableFoodCollection.findOne(query)
      res.send(result)
    })


    app.get('/foodrequest', async(req,res)=>{
      const result = await requestCollection.find().toArray()
      res.send(result)
    })


    app.delete('/foodrequest/:id', async(req,res)=>{
      const id = req.params.id;
      const query= {_id: new ObjectId(id)}
      const result = await requestCollection.deleteOne(query)
      res.send(result);
    })


    app.post('/foodrequest', async(req,res) =>{
      const foodRequst = req.body
      console.log(foodRequst)
      const result = await requestCollection.insertOne(foodRequst)
      res.send(result)
    })

    app.put('/foodrequest/:id', async(req,res) =>{
      const updatedRequst = req.body;
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



app.get('/', (req,res)=>{
    res.send('food server is running')
})

app.listen(port,()=>{
    console.log(`food server is running on port ${port}`)
})