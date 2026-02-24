import express from 'express';

const app= express()
app.get('/',(req,res)=>{
    res.send('Halo ini Silvi Kusuma Wardhani Gunawan :)');
});

app.get('/say/:greeting', (req, res) => {
  const { greeting } = req.params;
  res.send(greeting);
});

app.listen(3001);