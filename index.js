const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId=require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT||5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvc1i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
  try {
    await client.connect();
    const database = client.db('Tour-Spot');
    const tourscollection = database.collection('tours');
   
    //Get Api 
   app.get('/tours',async(req,res)=>{
    
    const cursor = tourscollection.find({});
    const tours= await cursor.toArray();
    res.send(tours);
   });

   //Get signle service
   app.get('/tours/:id',async(req,res)=>{
   const id=req.params.id;
   const query={_id:ObjectId(id)};
   const tour=await tourscollection.findOne(query);
   res.json(tour);


   })
   
    //Post Api
    app.post('/tours',async(req,res)=>{
      const tour=req.body;
      const result=await tourscollection.insertOne(tour);
      res.json(result);

    })

  }

  finally {
    // await client.close();
  }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome To Take A Tour!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})