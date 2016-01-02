import xlsx from 'xlsx';
import path from 'path';
import doiRegex from 'doi-regex';
import findKey from './lib/find-key';
import fetch from './lib/fetch';

let workbook = xlsx.readFile(path.resolve(__dirname, '../data/wiley.xls'));
let worksheet = workbook.Sheets[workbook.SheetNames[0]];

const range = xlsx.utils.decode_range(worksheet['!ref']);

const doiCell = xlsx.utils.decode_cell(findKey(worksheet, 'Journal DOI'));
const titleCell = xlsx.utils.decode_cell(findKey(worksheet, 'Title'));
const about1Cell = xlsx.utils.decode_cell(findKey(worksheet, 'Primary Subject Area'));
const about2Cell = xlsx.utils.decode_cell(findKey(worksheet, 'General Subject Category'));

let data = [];
for (let i = (doiCell.r + 1); i < range.e.r; i++) {
  let dcell = worksheet[xlsx.utils.encode_cell({c: doiCell.c, r: i})];
  if (dcell && dcell.v && doiRegex({exact: true}).test(dcell.v)) {
    let entry = {
      url: `http://onlinelibrary.wiley.com/journal/${dcell.v}/homepage/ForAuthors.html`,
      publisher: 'Wiley'
    };

    let tcell = worksheet[xlsx.utils.encode_cell({c: titleCell.c, r: i})];
    if (tcell) {
      entry.title = tcell.v;
    }

    let a1cell = worksheet[xlsx.utils.encode_cell({c: about1Cell.c, r: i})];
    if (a1cell && a1cell.v) {
      entry.about = [a1cell.v];
    }

    let a2cell = worksheet[xlsx.utils.encode_cell({c: about2Cell.c, r: i})];
    if (a2cell && a2cell.v) {
      entry.about = entry.about ? entry.about.concat(a2cell.v) : [a2cell.v];
    }

    data.push(entry);
  }
}


fetch(data, (err) => {
  if (err) console.error(err);
});
