import xlsx from 'xlsx';
import path from 'path';
import async from 'async';
import request from 'request';
import slug from 'slug';
import { jsdom } from 'jsdom';
import isUrl from 'is-url';
import url from 'url';
import sanitizeHtml from 'sanitize-html';
import fetch from './lib/fetch';

let workbook = xlsx.readFile(path.resolve(__dirname, '../data/sage.xlsx'));
let worksheet = workbook.Sheets[workbook.SheetNames[0]];

const range = xlsx.utils.decode_range(worksheet['!ref']);

const urlCell = xlsx.utils.decode_cell('D1');
const titleCell = xlsx.utils.decode_cell('A1');
const about1Cell = xlsx.utils.decode_cell('E1');
const about2Cell = xlsx.utils.decode_cell('F1');

let data = [];
for (let i = (urlCell.r + 1); i < range.e.r; i++) {
  let ucell = worksheet[xlsx.utils.encode_cell({c: urlCell.c, r: i})];
  if (ucell && ucell.v && isUrl(ucell.v)) {
    let entry = {
      url: ucell.v,
      publisher: 'Sage'
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

async.filterLimit(data, 10, (entry, cb) => {
  request(entry.url, (err, resp, body) => {
    if (err) {
      console.error(err, entry.url);
      return cb(null);
    }
    if (resp.statusCode >= 400) {
      console.error(resp.statusCode, entry.url);
      return cb(null);
    }

    // find styleguide URL
    let html = sanitizeHtml(body, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat('body', 'h1', 'h2')
    });
    let document = jsdom(html).defaultView.document;
    let re = /submission-guidelines$|manuscriptSubmission$|manuscript-submission$/i;
    let $a = Array.from(document.getElementsByTagName('a')).filter($a => re.test($a.href))[0];

    if ($a) {
      entry.url = isUrl($a.href) ? $a.href : url.resolve(entry.url, $a.href);
      cb(true);
    } else {
      cb(false);
    }
  });
}, (data) => {
  fetch(data, (err) => {
    if (err) console.error(err);
  });
});
