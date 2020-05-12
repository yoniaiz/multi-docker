const keys = require("./keys");

const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors")

//connect express
const app = express();
app.use(cors());
app.use(bodyParser.json());

const redis = require("redis");
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

//postgress setup
const {
    Pool
} = require("pg");

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on("error", () => {
    console.log("lost pg connection")
});

pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch(err => console.log(err));



// routes

app.get('/', (req, res) => {
    res.send("hi");
})

app.get("/values/all", async (req, res) => {
    const values = await pgClient.query("SELECT * fron values");

    res.send(values.rows);
})

app.get("/values/current", (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
})

app.post("/values", async (req, res) => {
    const {
        index
    } = req.body;

    if (parseInt(index) > 40) {
        return res.status(422).send("index to high")
    }

    redisClient.hset("values", index, 'nothing');
    redisPublisher.publish('insert', index);
    pgClient.query("INSERT INTO values(number) VALLUES($1)", [index]);

    res.send({
        working: true
    });
})

app.listen(5000, () => {
    console.log("listenint")
})