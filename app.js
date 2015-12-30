document.addEventListener('DOMContentLoaded', function() {
  let $form = document.querySelector('form');
  $form.addEventListener('submit', function(e){
    e.preventDefault();
    let $input = $form.querySelector('input');
    if ($input.value) {

      let searchPath = (~process.env.COUCH_HOST.indexOf('cloudant')) ? `${process.env.COUCH_STYLE_GUIDE_DB}/_design/${process.env.COUCH_STYLE_GUIDE_DB}/_search/${process.env.COUCH_STYLE_GUIDE_DB}` : `_fti/local/${process.env.COUCH_STYLE_GUIDE_DB}/_design/${process.env.COUCH_STYLE_GUIDE_DB}/${process.env.COUCH_STYLE_GUIDE_DB}`;

      let url = `${process.env.COUCH_PROTOCOL}//${process.env.COUCH_HOST}:${process.env.COUCH_PORT}/${searchPath}`;

      let q = $input.value.trim();
      let xhr = new XMLHttpRequest();
      xhr.onload = e => {
        if (e.target.status >= 400) {
          return console.error(JSON.parse(e.target.responseText));
        }

        let data = JSON.parse(e.target.responseText);
        let $ul = document.getElementById('results');

        if (data.rows && data.rows.length) {
          $ul.innerHTML = data.rows.map(row => {
            console.log(row);
            return (
              `<li>
                 <h2><a href="${row.fields.url}">${row.fields.title}</a></h2>
                 <span>${row.fields.publisher} - score: ${row.score || row.order[0]}</span>
                 <p>${row.fields.about}</p>
               </li>`
            );
          }).join('');
        } else {
          $ul.innerHTML = '<li>no results found</li>';
        }
      };
      xhr.onabort = e => { console.error('xhr aborted') };
      xhr.onerror = e => { console.error('xhr error') };
      xhr.open('GET', url + `?q=${q}&limit=100`);
      xhr.send();
    }
  });
});
