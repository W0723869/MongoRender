const { MongoClient } = require("mongodb");

// MongoDB Atlas connection string
const uri = "mongodb+srv://kade0439:Password@cmps-415.kfrm8o9.mongodb.net/?retryWrites=true&w=majority&appName=Cmps-415";

// --- Express setup ---
const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost/:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function(req, res) {
  res.send('Starting... ');
});

app.get('/say/:name', function(req, res) {
  res.send('Hello ' + req.params.name + '!');
});



app.get('/api/mongo/:item', function(req, res) {
const client = new MongoClient(uri);
const searchKey = "{ partID: '" + req.params.item + "' }";
console.log("Looking for: " + searchKey);

async function run() {
  try {
    const database = client.db('Cmps415-DB');
    const parts = database.collection('Mystuff');

    const query = { partID: req.params.item };

    const part = await parts.findOne(query);
    console.log(part);
    res.send('Found this: ' + JSON.stringify(part));  //Use stringify to print a json

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
});