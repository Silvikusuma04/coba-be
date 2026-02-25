import express from "express";
const app = express();

app.use((req, res, next) => {
  const authorized = true;

  if (!authorized) {
    return res.status(401).send("Yah Error");
  }

  next();
});
app.get("/", (req, res) => {
  res.send("Halo ini Silvi Kusuma Wardhani Gunawan :)");
});

app.get("/silvi", (req, res) => {
  res.send("ini Silvi Lagi Haloo");
});

app.get("/:greeting", (req, res) => {
  const { greeting } = req.params;
  res.send(greeting);
});

app.use((err, req, res, next) => {
  res.send("Error Occurred");
});
 
app.listen(8080);
