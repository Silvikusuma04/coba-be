import express from "express";
const app = express();
app.use((req, res, next) => {
  if (false) {
    next("not found");
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

app.get("/silvi", (req, res) => {
  res.send("Ini Silvi Lagi Haloo");
});

app.get("/:greeting", (req, res) => {
  const { greeting } = req.params;
  res.send(greeting);
});
 
app.listen(8080);
