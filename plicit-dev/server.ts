import express from 'express';
import pathlib from 'path';


const app = express();

app.listen(8080);

app.get('*.ttf', (req, res) => {
  const filename = pathlib.basename(req.params[0]) + '.ttf';
  res.sendFile(pathlib.join(__dirname, 'dist', filename));
})

app.get('*/service-worker.js', (req, res) => {
  res.sendFile(pathlib.join(__dirname, 'dist/service-worker.js'));
});

app.get('*/bundle.js', (req, res) => {
  res.sendFile(pathlib.join(__dirname, 'dist/bundle.js'));
});

app.get('/*', (req, res) => {
  res.sendFile(pathlib.join(__dirname, 'public/index.html'));
})
