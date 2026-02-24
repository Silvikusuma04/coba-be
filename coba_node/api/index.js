import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Halo ini Silvi Kusuma Wardhani Gunawan :)");
});

app.get("/say/:greeting", (req, res) => {
  res.send(req.params.greeting);
});

export default app;