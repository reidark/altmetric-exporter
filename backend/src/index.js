const fs = require('fs');
const AS = require('altmetric-scraper');
const Express = require('express');

const scraper = new AS();

const app = Express();

app
  .use(Express.json())
  .use(Express.static('tmp'))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
  });

app.post('/export', async (req, res) => {
  try {
    let { url, type, title } = req.body;
    let filename = `${title}.docx`;

    let data = await scraper.scrapAllPages({ url, type })
      .then((response) => response)
      .catch(({ message }) => {
        throw new Error(message);
      });

    let buffer = await scraper.export(data, type)
      .then((buffer) => buffer)
      .catch((err) => {
        throw new Error(err);
      });

    fs.writeFileSync(`tmp/${filename}`, buffer);

    res.send({
      filename,
      url: `${process.env.API_URL}/${filename}`,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message || 'Error to export',
    });
  }
});

app.listen(process.env.PORT || 5000)
