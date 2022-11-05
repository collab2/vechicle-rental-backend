const redis = require("redis");

const redisPassword = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

const client = redis.createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  },
  password: redisPassword,
});

(async () => {
  client.connect();
  client.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("You're connected db redis ...");
  });
})();

module.exports = client;
