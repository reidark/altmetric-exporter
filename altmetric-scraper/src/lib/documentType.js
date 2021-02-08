const DATE_LOCALE = 'pt-BR';
const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

/**
 * Document Type
 *
 * @param {any} docx Instace from docx.
 * @param {array} data Items to write in the Docx.
 * @param {string} type Template for docs based on type "news|blogs|twitter|facebook".
 *
 * @return {Promise<any>}
 */
const documentType = (docx, data = [], type) => {
  return new Promise((resolve) => {
    let { Document, Paragraph, TextRun } = docx;
    let doc = new Document();

    doc.Styles
      .createParagraphStyle('headingCustom', 'Heading Style')
      .basedOn('Normal')
      .next('Normal')
      .size(24)
      .font('Arial')
      .bold()
      .color('000000');

    doc.Styles
      .createParagraphStyle('paragraphCustom', 'Paragraph Style')
      .basedOn('Normal')
      .next('Normal')
      .size(20)
      .font('Arial');

    if (type === 'news') {
      doc.addSection({
        properties: {},
        children: data
          .map((item) => {
            return [
              new Paragraph({
                text: item.title.replace(/(\r\n|\n|\r)/gm, ''),
                style: 'headingCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Autor: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.author ? item.author.replace(/(\r\n|\n|\r)/gm, '') : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Link: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.link ? item.link : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Descrição: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.description ? item.description.replace(/(\r\n|\n|\r)/gm, '') : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph(''),
            ];
          })
          .reduce((prev, next) => prev.concat(next)),
      });
    }

    if (type === 'blogs') {
      doc.addSection({
        properties: {},
        children: data
          .map((item) => {
            return [
              new Paragraph({
                text: item.title.replace(/(\r\n|\n|\r)/gm, ''),
                style: 'headingCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Autor: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.author ? item.author.replace(/(\r\n|\n|\r)/gm, '') : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Link: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.link ? item.link : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Descrição: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.description ? item.description.replace(/(\r\n|\n|\r)/gm, '') : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph(''),
            ];
          })
          .reduce((prev, next) => prev.concat(next)),
      });
    }

    if (type === 'twitter') {
      doc.addSection({
        properties: {},
        children: data
          .map((item) => {
            return [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Autor: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.author ? item.author.replace(/(\r\n|\n|\r)/gm, '') : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Usuário: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.handle ? item.handle : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Tweet: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.summary ? item.summary.replace(/(\r\n|\n|\r)/gm, '') : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Data de publicação: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.published ? new Date(item.published).toLocaleDateString(DATE_LOCALE, DATE_OPTIONS) : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Seguidores: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.followers ? item.followers : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph(''),
            ];
          })
          .reduce((prev, next) => prev.concat(next)),
      });
    }

    if (type === 'facebook') {
      doc.addSection({
        properties: {},
        children: data
          .map((item) => {
            return [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Autor: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.author ? item.author.replace(/(\r\n|\n|\r)/gm, '') : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Resumo: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.summary ? item.summary.replace(/(\r\n|\n|\r)/gm, '') : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Data de publicação: ',
                    bold: true,
                  }),
                  new TextRun({
                    text: item.published ? new Date(item.published).toLocaleDateString(DATE_LOCALE, DATE_OPTIONS) : 'Não possui.',
                  }),
                ],
                style: 'paragraphCustom',
              }),
              new Paragraph(''),
            ];
          })
          .reduce((prev, next) => prev.concat(next)),
      });
    }

    resolve(doc);
  });
};

module.exports = documentType;
