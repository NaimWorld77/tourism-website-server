const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId =require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hsow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();

        const database = client.db('coxATour');
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('booking');


        //GET Api
        app.get('/services', async (req,res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        })
        //get booking api
        app.get('/booking',async (req,res)=>{
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        })

        //delete booking api
        app.delete('/booking/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })


        //POST BOOKING
        app.post('/booking', async(req,res)=>{
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        })


    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);










app.get('/',(req,res)=>{
    res.send("coxatour running on the server");
});

app.listen(port,()=>{
    console.log('this server running on the port',port);
})