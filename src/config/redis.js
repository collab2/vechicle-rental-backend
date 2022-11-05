const redis = require("redis");

const redisPassword = "E9CxKhY1OOMnTcgMAWF4Vs3U4qevqMly";
const redisHost = "redis-12605.c14.us-east-1-3.ec2.cloud.redislabs.com";
const redisPort = "12605";

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
