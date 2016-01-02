import xlsx from 'xlsx';

const startAboutCell = xlsx.utils.decode_cell('AE1');
const printIssnCell = xlsx.utils.decode_cell('C1');
const eIssnCell = xlsx.utils.decode_cell('D1');

export default function getScopusAbout(workbook, eissn, pissn, issn) {
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = xlsx.utils.decode_range(worksheet['!ref']);

  if (eissn) {
    eissn = eissn.replace('-', '');
  }
  if (pissn) {
    pissn = pissn.replace('-', '');
  }
  if (issn) {
    issn = issn.replace('-', '');
  }

  // find correct row
  for (var i = range.s.r; i < range.e.r; i++) {
    let _eissn, _pissn;
    let eicell = worksheet[xlsx.utils.encode_cell({c: eIssnCell.c, r: i})];
    if (eicell && eicell.v) {
      _eissn = eicell.v;
    }

    let picell = worksheet[xlsx.utils.encode_cell({c: printIssnCell.c, r: i})];
    if (picell && picell.v) {
      _pissn = picell.v;
    }

    if (
      (eissn && eissn === _eissn) ||
      (pissn && pissn === _pissn) ||
      (issn && (issn === _eissn || issn === _pissn))
    ) {
      break;
    }
  }

  let about = [];
  for (let j = startAboutCell.c; j < range.e.c; j++) {
    let cell = worksheet[xlsx.utils.encode_cell({c: j, r: i})];
    if (cell && cell.v) {
      about.push(cell.v);
    }
  }

  return about;
}
