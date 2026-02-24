import express from "express";

const app = express();

app.use((req, res, next) => {
  if (false) {
    next("salah");
    return;
  }
  next();
});

app.use((err, req, res, next) => {
  res.send("Error Occurred");
});

app.get("/", (req, res) => {
  res.send("Halo ini Silvi Kusuma Wardhani Gunawan :)");
});

app.get("/:greeting", (req, res) => {
  res.send(req.params.greeting);
});
 
export default app;
