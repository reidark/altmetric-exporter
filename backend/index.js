const fs = require('fs');
const Express = require('express');
const AS = require('altmetric-scraper');

const app = Express();

app
  .use(Express.json())
  .use(Express.static('tmp'))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
});

app.post('/export', async (req, res) => {
  const scraper = new AS();
  let buffer = await scraper.exec(req.body);
  
  if (!buffer) {
    res.status(400).send({
      error: 'Error to export.'
    });
  }
  
  let filename = `${req.body.title}.docx`;

  fs.writeFileSync(`tmp/${filename}`, buffer);

  res.send({
    filename,
    url: `http://localhost:3000/${filename}`
  });
});

app.listen(3000);
