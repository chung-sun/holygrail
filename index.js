const express = require("express");
const app = express();
const redis = require("redis");
const client = redis.createClient({
  legacyMode: true,
});

client.connect();

client.on("error", (err) => console.log("Redis Client Error", err));

// init values
client.mSet("header", 0, "left", 0, "article", 0, "right", 0, "footer", 0);
client.mGet(
  ["header", "left", "article", "right", "footer"],
  function (err, value) {
    console.log(value);
  }
);

function data() {
  return new Promise((resolve, reject) => {
    client.mGet(
      ["header", "left", "article", "right", "footer"],
      function (err, value) {
        const data = {
          header: Number(value[0]),
          left: Number(value[1]),
          article: Number(value[2]),
          right: Number(value[3]),
          footer: Number(value[4]),
        };
        err ? reject(null) : resolve(data);
      }
    );
  });
}

// static file
app.use(express.static("public"));

// get data
app.get("/data", (req, res) => {
  data().then((data) => {
    console.log(data);
    res.send(data);
  });
});

// update data
app.get("/update/:key/:value", (req, res) => {
  const key = req.params.key;
  let value = Number(req.params.value);
  client.get(key, function (err, reply) {
    // new value
    value = Number(reply) + value;
    client.set(key, value);

    // return data to client
    data().then((data) => {
      console.log(data);
      res.send(data);
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
