import xlsx from 'xlsx';
import request from 'request';
import { jsdom } from 'jsdom';
import path from 'path';
import doiRegex from 'doi-regex';
import async from 'async';
import sanitizeHtml from 'sanitize-html';
import findKey from './lib/find-key';
import slug from 'slug';

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
      url: `http://onlinelibrary.wiley.com/journal/${dcell.v}/homepage/ForAuthors.html`
    };

    let tcell = worksheet[xlsx.utils.encode_cell({c: titleCell.c, r: i})];
    if (tcell) {
      entry.title = tcell.v;
    }

    let a1cell = worksheet[xlsx.utils.encode_cell({c: about1Cell.c, r: i})];
    if (a1cell) {
      entry.about = [a1cell.v];
    }

    let a2cell = worksheet[xlsx.utils.encode_cell({c: about2Cell.c, r: i})];
    if (a2cell) {
      entry.about = entry.about ? entry.about.concat(a2cell.v) : [a2cell.v];
    }

    data.push(entry);
  }
}

async.eachLimit(data, 10, (entry, cb) => {
  request(entry.url, (err, resp, body) => {
    if (err) {
      console.error(err, entry.url);
      return cb(null);
    }
    if (resp.statusCode >= 400) {
      console.error(resp.statusCode, entry.url);
      return cb(null);
    }

    let html = sanitizeHtml(body, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat('body', 'h1', 'h2')
    });

    let document = jsdom(html).defaultView.document;

    let id = slug('wiley-' + entry.title);

    request.put({
      url: `${process.env.COUCH_PROTOCOL}//${process.env.COUCH_ADMIN_USERNAME}:${process.env.COUCH_ADMIN_PASSWORD}@${process.env.COUCH_HOST}:${process.env.COUCH_PORT}/${process.env.COUCH_STYLE_GUIDE_DB}/${id}`,
      json: Object.assign({
        _id: id,
        text: document.body.textContent,
        publisher: 'wiley'
      }, entry)
    }, (err, resp, body) => {
      if (err) {
        console.error(err, entry.url);
        return cb(null);
      }
      if (resp.statusCode >= 400) {
        console.error(resp.statusCode, entry.url);
        return cb(null);
      }
      cb(null);
    });
  });
}, (err) => {
  if (err) console.error(err);
});
