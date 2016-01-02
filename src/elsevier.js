import xlsx from 'xlsx';
import path from 'path';
import findKey from './lib/find-key';
import fetch from './lib/fetch';
import getScopusAbout from './lib/get-scopus-about';
import slug from 'slug';

let workbook = xlsx.readFile(path.resolve(__dirname, '../data/elsevier.xls'));
let worksheet = workbook.Sheets[workbook.SheetNames[0]];

let scopusWorkbook = xlsx.readFile(path.resolve(__dirname, '../data/scopus.xlsx'));

const range = xlsx.utils.decode_range(worksheet['!ref']);

const titleCell = xlsx.utils.decode_cell(findKey(worksheet, 'Full Title'));
const issnCell = xlsx.utils.decode_cell(findKey(worksheet, 'ISSN'));

let data = [];
for (let i = range.s.r; i < range.e.r; i++) {
  let title, issn;
  let tcell = worksheet[xlsx.utils.encode_cell({c: titleCell.c, r: i})];
  if (tcell && tcell.v) {
    title = tcell.v;
  }
  let icell = worksheet[xlsx.utils.encode_cell({c: issnCell.c, r: i})];
  if (icell && icell.v) {
    issn = icell.v;
  }

  if (title && issn) {
    if (title && issn) {
      let entry = {
        url: `https://www.elsevier.com/journals/${slug(title).toLowerCase()}/${issn}/guide-for-authors`,
        publisher: 'Elsevier',
        title: title
      };

      let about = getScopusAbout(scopusWorkbook, null, null, issn);

      if (about && about.length) {
        entry.about = about;
      }

      data.push(entry);
    }
  }

}

fetch(data, (err) => {
  if (err) console.error(err);
});
