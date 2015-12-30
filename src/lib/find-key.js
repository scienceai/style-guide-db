export default function findKey(worksheet, name) {
  for (var key in worksheet) {
    if (worksheet[key].v === name) {
      break;
    }
  }
  return key;
}
