const docx = require('docx');
const cheerio = require('cheerio');
const request = require('request-promise');

const documentType = require('./documentType');

const DEFAULT_TYPE = 'news';
const ALTMETRIC_URL = 'https://www.altmetric.com/details';

class AltmetricScraper {
  /**
   * Constructor
   */
  constructor() {}

  /**
   * Config parameters.
   *
   * @param {object} options Options { id, url, type }.
   *
   * @return {object}
   */
  _config(options = {}) {
    let { id, url, type } = options;

    if (!id && !url) {
      return new Error('Please provide a ID or URL from Altmetric');
    }

    if (!id) {
      let getPageId = this.getPageId(url);

      if (getPageId instanceof Error) {
        return getPageId;
      }

      id = getPageId;
    }

    return {
      id,
      type: type || DEFAULT_TYPE,
    };
  }

  /**
   * Create a altmetric URL
   *
   * @param {object} options Options { id, type, page }.
   *
   * @return {string}
   */
  _createAltmetricUrl(options = {}) {
    let { id, type, page } = options;

    return `${ALTMETRIC_URL}/${id}/${type}/page:${page}`;
  }

  /**
   * Set new value to some option.
   *
   * @param {string} url URL to extract id.
   *
   * @return {string}
   */
  getPageId(url) {
    let id = url.match(/(?:details\/)(\d+)/);

    if (!id) {
      return new Error('Provide a valid URL');
    }

    return id[1];
  }

  /**
   * Get total pages to scrap.
   *
   * @param {object} options Options { id, url, type }.
   *
   * @return {Promise<number>}
   */
  async scrapTotalPages(options = {}) {
    return new Promise(async (resolve, reject) => {
      let config = this._config(options);

      if (config instanceof Error === false) {
        let { id, type } = config;
        let url = this._createAltmetricUrl({ id, type, page: 1 });

        await request(url)
          .then((body) => {
            let $ = cheerio.load(body);

            if ($('.post_pagination.top').length) {
              let last = $('.post_pagination.top').find('a[rel="next"]').prev('a').attr('href');
              let page = last.match(/(?:page:)(\d+)/)[1];

              resolve(page);
            }

            resolve(1);
          })
          .catch(() => reject(new Error(`Error to scrap total pages from ${url}`)));
      }

      reject(config);
    });
  }

  /**
   * Scrap data from elements for specific type.
   *
   * @param {string} type The type "news|blogs|twitter|facebook".
   * @param {any} element The cheerio instance for this element.
   *
   * @return {Promise<object>}
   */
  async scrapType(type, element) {
    return new Promise((resolve) => {
      let data = {};

      if (type === 'news') {
        data.title = element.find('h3').text();
        data.author = element.find('h4').text();
        data.description = element.find('.summary').text();
        data.link = element.find('.block_link').attr('href');
      }

      if (type === 'blogs') {
        data.title = element.find('h3').text();
        data.author = element.find('h4').text();
        data.description = element.find('.summary').text();
        data.link = element.find('.block_link').attr('href');
      }

      if (type === 'twitter') {
        data.author = element.find('.author').find('.name').text();
        data.handle = element.find('.author').find('.handle').text();
        data.summary = element.find('.summary').text();
        data.published = element.find('time').attr('datetime');
        data.followers = element.find('.follower_count').find('span').text();
      }

      if (type === 'facebook') {
        data.author = element.find('h4').text().replace(/,\s\d{2}\s.+/, '');
        data.published = element.find('h4').find('time').attr('datetime');
        data.summary = element.find('.summary').text();
      }

      resolve(data);
    });
  }

  /**
   * Scrap data from Altmetric for specific page.
   *
   * @param {object} options Options { id, url, type }.
   * @param {number} page The specific page to scrap.
   *
   * @return {void}
   */
  async scrapPage(options = {}, page = 1) {
    return new Promise(async (resolve, reject) => {
      const scrapType = this.scrapType.bind();

      let config = await this._config(options);

      if (config instanceof Error === false) {
        let { id, type } = config;
        let url = this._createAltmetricUrl({ id, type, page });

        await request(url)
          .then(async (body) => {
            let $ = cheerio.load(body);
            let elements = [];

            $('.post-list').find('.post').each(async function () {
              let element = scrapType(type, $(this)).then((response) => response);

              elements.push(element);
            });

            let scrapedPage = await Promise.all(elements).then((response) => response);

            resolve(scrapedPage);
          })
          .catch(() => reject(new Error(`Failed to scrap data from ${url}`)));
      }

      reject(config);
    });
  }

  /**
   * Scrap all data from Altmetric from specific type.
   *
   * @param {object} options Options { id, url, type }.
   * @param {number} totalPages Total pages for scrap.
   *
   * @return {void}
   */
  async scrapAllPages(options = {}, totalPages) {
    return new Promise(async (resolve, reject) => {
      let pages = [];
      let typeTotalPages = await this.scrapTotalPages(options).then((response) => response).catch((err) => reject(err));

      if (!totalPages || totalPages <= 0 || totalPages > typeTotalPages) {
        totalPages = typeTotalPages;
      }

      for (let page = 1; page <= totalPages; page++) {
        let scrapedPage = this.scrapPage(options, page).then((response) => response).catch((err) => reject(err));

        pages.push(scrapedPage);
      }

      let scrapedPages = await Promise.all(pages).then((response) => response).catch((err) => reject(err));

      scrapedPages = [].concat(...scrapedPages);

      resolve(scrapedPages);
    });
  }

  /**
   * Export a Docx based on data
   *
   * @param {array} data Items to write in the Docx.
   * @param {string} type Template for docs based on type "news|blogs|twitter|facebook".
   *
   * @return {Buffer}.
   */
  async export(data = [], type = DEFAULT_TYPE) {
    let { Packer } = docx;
    let doc = await documentType(docx, data, type).then((response) => response);
    let buffer = Packer.toBuffer(doc);

    return buffer;
  }
}

module.exports = AltmetricScraper;
