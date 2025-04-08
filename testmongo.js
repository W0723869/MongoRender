const { MongoClient } = require("mongodb");

// MongoDB Atlas connection string
const uri = "mongodb+srv://kade0439:Rohwedder101@@cmps-415.kfrm8o9.mongodb.net/?retryWrites=true&w=majority&appName=Cmps-415";

// --- Express setup ---
const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Default route ---
app.get('/', function(req, res) {
  console.log("Default route '/' hit");
  res.send('Starting');
});

// --- Greeting route ---
app.get('/say/:name', function(req, res) {
  console.log("Greeting route hit with name:", req.params.name);
  res.send('Hello ' + req.params.name + '!');
});

// --- MongoDB Query by partID ---
app.get('/api/mongo/:item', function(req, res) {
  console.log("/api/mongo/:item route hit");

  const client = new MongoClient(uri);
  const searchKey = req.params.item;
  console.log("Looking for partID:", searchKey);

  async function run() {
    try {
      const database = client.db('Cmps-415');
      const parts = database.collection('Mystuff');

      const query = { partID: searchKey }; // Make sure partID is stored as a string

      const part = await parts.findOne(query);
      console.log("Query result:", part);

      if (!part) {
        res.status(404).send("❌ No part found with partID: " + searchKey);
        return;
      }

      res.send('Found this: ' + JSON.stringify(part));
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      await client.close();
      console.log("MongoDB connection closed");
    }
  }

  run().catch(err => {
    console.error("Run function failed:", err);
  });
});
