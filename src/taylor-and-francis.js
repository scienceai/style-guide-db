import fs from 'fs';
import csvParser from 'csv-parser';
import xlsx from 'xlsx';
import path from 'path';
import findKey from './lib/find-key';
import fetch from './lib/fetch';
import getScopusAbout from './lib/get-scopus-about';

let scopusWorkbook = xlsx.readFile(path.resolve(__dirname, '../data/scopus.xlsx'));
let data = [];

fs.createReadStream(path.resolve(__dirname, '../data/taylor-and-francis.tsv'))
  .pipe(csvParser({separator:'\t'}))
  .on('error', (err) => {
    console.error(err);
  })
  .on('data', (row) => {
    let entry = {
      url: `http://www.tandfonline.com/action/authorSubmission?journalCode=${row.title_id}&page=instructions`,
      publisher: 'Taylor & Francis',
      title: row.publication_title
    };

    let about = getScopusAbout(scopusWorkbook, row.online_identifier, row.print_identifier);
    if (about && about.length) {
      entry.about = about;
    }

    data.push(entry);
  })
  .on('end', () => {
    // T&F block IP if more than 100 actions are done in 60 seconds
    fetch(data, {limit: 90, timeout: 61000, jar: true}, (err) => {
      if (err) console.error(err);
    });
  });
