const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId=require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvc1i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



async function run(){
  try {
    await client.connect();
    const database = client.db('Tour-Spot');
    const tourscollection = database.collection('tours');
    const oderscollection = database.collection('oders');
   
    //Get Api for topurs
   app.get('/tours',async(req,res)=>{
    const cursor = tourscollection.find({});
    const tours= await cursor.toArray();
    res.json(tours);
   });

   //Get Order Api
   app.get('/orders',async(req,res)=>{
    
    const cursor = oderscollection.find({});
    const orders= await cursor.toArray();
    res.json(orders);
   });

   //Get signle service
   app.get('/tours/:id',async(req,res)=>{
   const id=req.params.id;
   const query={_id:ObjectId(id)};
   const tour=await tourscollection.findOne(query);
   res.json(tour);


   });
   
    //Post Api for tours
    app.post('/tours',async(req,res)=>{
      const tour=req.body;
      const result=await tourscollection.insertOne(tour);
      res.json(result);

    });

    //Post orders
    app.post('/orders',async(req,res)=>{
      const order=req.body;
      const result=await oderscollection.insertOne(order);
      res.json(result);

    });

    //Delete Ap
    app.delete("/deleteorder/:id", async (req, res) => {
      const result = await oderscollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
   

  }

  finally {
    // await client.close();
  }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome To Take A Tour!')
})
app.get('/hello', (req, res) => {
  res.send('hello!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})