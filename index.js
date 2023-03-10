const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const { ObjectID } = require("bson");
const { query } = require("express");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mahmudul:djIXHgfrDX9B1n1W@cluster0.yhrwxpk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const taskCatagories = client.db("MyTask").collection("TaskCollection");
  const completedTaskCatagories = client
    .db("MyTask")
    .collection("completedTaskCollection");
  const commentCategories = client.db("MyTask").collection("comments");
  const mediaCategories = client.db("MyTask").collection("media");

  try {
    app.post("/myTask", async (req, res) => {
      const tasks = req.body;
      console.log(tasks);
      const result = await taskCatagories.insertOne(tasks);
      res.send(result);
    });

    app.post("/completedTask", async (req, res) => {
      const completedTask = req.body;
      console.log(completedTask);
      const result = await completedTaskCatagories.insertOne(completedTask);
      res.send(result);
    });

    app.post("/media", async (req, res) => {
      const data = req.body;
      const result = await mediaCategories.insertOne(data);
      res.send(result);
    });

    app.post("/comments", async (req, res) => {
      const data = req.body;
      const result = await commentCategories.insertOne(data);
      res.send(result);
    });

    app.get("/comments", async (req, res) => {
      let cursor = {};
      if (req.query.taskHeader && req.query.task) {
        cursor = { taskHeader: req.query.taskHeader, task: req.query.task };
      }
      console.log(req.query.task)
      const result = await commentCategories.find(cursor).toArray();
      res.send(result);
    });

    app.get("/media", async (req, res) => {
      let cursor = {};
      if (req.query.email) {
        cursor = { email: req.query.email };
      }
      const result = await mediaCategories.find(cursor).toArray();
      res.send(result);
    });

    app.get("/completedTask", async (req, res) => {
      let cursor = {};
      if (req.query.email) {
        cursor = { email: req.query.email };
      }
      const result = await completedTaskCatagories.find(cursor).toArray();
      res.send(result);
    });

    app.get("/completedTask/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: ObjectID(id) };
      const result = await completedTaskCatagories.findOne(cursor);
      res.send(result);
    });

    app.delete("/completedTask/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: ObjectID(id) };
      const result = await completedTaskCatagories.deleteOne(cursor);
      res.send(result);
    });

    app.delete("/myTask/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const cursor = { _id: ObjectID(id) };
      const result = await taskCatagories.deleteOne(cursor);
      res.send(result);
    });

    app.get("/myTask", async (req, res) => {
      let cursor = {};
      if (req.query.email) {
        cursor = { email: req.query.email };
      }
      const result = await taskCatagories.find(cursor).toArray();
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("This is CORS-enabled for all origins!");
});

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port 80");
});
