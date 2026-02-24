import express from "express";

const app = express();

app.use((req, res, next) => {
  console.log(`Request lewat jalur ini: ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Halo ini Silvi Kusuma Wardhani Gunawan :)");
});

app.get("/:greeting", (req, res) => {
  res.send(req.params.greeting);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;