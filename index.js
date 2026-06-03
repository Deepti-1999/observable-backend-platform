const express = require("express");
const mongoose = require("mongoose");
const client = require("prom-client");	
const logger = require("./logger");

const app = express();
app.use(express.json());

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode
    });

    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode
    });
    logger.info({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode
    });
  });

  next();
});

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Create user

app.post("/users", async (req, res) => {

  try {

    const user = new User(req.body);

    await user.save();

    res.json(user);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

// Get users

app.get("/users", async (req, res) => {

  try {

    const users = await User.find();

    res.json(users);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

// Metrics endpoint

app.get("/metrics", async (req, res) => {

  res.set("Content-Type", client.register.contentType);

  res.end(await client.register.metrics());

});

// DB connection
mongoose.connect("mongodb://127.0.0.1:27017/testdb")
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error:", err.message));

// User Schema

const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model("User", UserSchema);

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
