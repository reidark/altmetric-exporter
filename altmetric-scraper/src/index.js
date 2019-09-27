const docx = require('docx');
const cheerio = require('cheerio');
const request = require('request-promise');

class AltmetricScraper {

  /**
   * Constructor
   */
  constructor() {
    this.store = [];
    this.options = {
      type: 'news',
      page: 1
    };
  };

  /**
   * Scrap data from Altmetric.
   *
   * @param {Object} options Options [url, type, page].
   * @param {Array} store Array to store all data scraped.
   *
   * @return {void}
   */
  async scrap(options = this.options, store = this.store) {
    let url = `https://www.altmetric.com/details/${options.id}/${options.type}/page:${options.page}`;

    await request(url)
      .then(async body => {
        let $ = cheerio.load(body);

        $('.post-list').find('.post').each(function () {
          let obj = {
            title: $(this).find('h3').text(),
            author: $(this).find('h4').text(),
            description: $(this).find('.summary').text(),
            link: $(this).find('.block_link').attr('href')
          };

          store.push(obj);
        });

        if ($('.post_pagination.top').find('a[rel="next"]').length) {
          let next = $('.post_pagination.top').find('a[rel="next"]').attr('href');
          let page = next.match(/(?:page:)(\d+)/)[1];

          await this.scrap({
            ...options,
            page
          }, store);
        }
      })
      .catch(err => new Error(err));
  };

  /**
   * Export.
   *
   * @param {Array} store Array to store all data scraped.
   *
   * @return {Buffer} Returns a buffer.
   */
  async export(store = this.store) {
    const { Document, Paragraph, HeadingLevel, TextRun, Packer } = docx;
    const doc = new Document();

    doc.addSection({
      properties: {},
      children: store
        .map(item => {
          return [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.title.replace(/(\r\n|\n|\r)/gm, ''),
                  bold: true,
                  color: '000000'
                })
              ],
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph(`Autor: ${item.author ? item.author.replace(/(\r\n|\n|\r)/gm, '') : 'Não possui.'}`),
            new Paragraph(`Link: ${item.link ? item.link : 'Não possui.'}`),
            new Paragraph(`Descrição: ${item.description ? item.description.replace(/(\r\n|\n|\r)/gm, '') : 'Não possui.'}`),
            new Paragraph('')
          ]
        }).reduce((prev, next) => prev.concat(next))
    });

    return Packer.toBuffer(doc).then(buffer => buffer);
  };

  /**
   * Exec.
   *
   * @param {Object} options Options [url, type, page].
   * @param {Array} store Array to store all data scraped.
   * 
   * @return {Buffer} Returns a buffer.
   */
  async exec(options = this.options, store = this.store) {
    let id = options.url.match(/(?:details\/)(\d+)/);

    if (id) {
      options.id = id[1];
    } else {
      return '';
    }

    await this.scrap(options, store);

    let file = this.export();
  
    return file;
  };
};

module.exports = AltmetricScraper;