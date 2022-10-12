const redis = require("redis");
const client = redis.createClient({
  legacyMode: true,
});

client.connect();

client.on("error", (err) => console.log("Redis Client Error", err));

// single value write and read
client.set("my_key", "Hello World");
client.get("my_key", function (err, reply) {
  console.log(reply);
});

// multiple values read and write
client.mSet("header", 0, "left", 0, "article", 0, "right", 0, "footer", 0);
client.mGet(
  ["header", "left", "article", "right", "footer"],
  function (err, value) {
    console.log(value);
  }
);

client.QUIT();
