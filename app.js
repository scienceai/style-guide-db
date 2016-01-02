import { createHistory, useQueries } from 'history';

let history = useQueries(createHistory)();

document.addEventListener('DOMContentLoaded', function() {
  let searchPath = (~process.env.COUCH_HOST.indexOf('cloudant')) ? `${process.env.COUCH_STYLE_GUIDE_DB}/_design/${process.env.COUCH_STYLE_GUIDE_DB}/_search/${process.env.COUCH_STYLE_GUIDE_DB}` : `_fti/local/${process.env.COUCH_STYLE_GUIDE_DB}/_design/${process.env.COUCH_STYLE_GUIDE_DB}/${process.env.COUCH_STYLE_GUIDE_DB}`;
  let url = `${process.env.COUCH_PROTOCOL}//${process.env.COUCH_HOST}:${process.env.COUCH_PORT}/${searchPath}`;

  let active;

  let unlisten = history.listen(location => {
    if (location.query.q) {
      if (active) {
        active.abort();
      }
      let xhr = new XMLHttpRequest();
      xhr.onload = e => {
        active = undefined;
        if (e.target.status >= 400) {
          return console.error(JSON.parse(e.target.responseText));
        }

        let data = JSON.parse(e.target.responseText);
        let $ul = document.getElementById('results');
        let $p = document.getElementById('next');

        if (data.rows && data.rows.length) {
          $ul.innerHTML = data.rows.map(row => {
            return (
              `<li>
                <h2><a href="${row.fields.url}">${row.fields.title}</a></h2>
                <span>${row.fields.publisher} - score: ${row.score || row.order[0]}</span>
                <p>${row.fields.about}</p>
               </li>`
            );
          }).join('');

          if (
            (data.bookmark != null && data.bookmark !== location.query.bookmark) ||
            (data.skip != null && (data.skip + data.limit) < data.total_rows)
          ) {
            let skip;
            if (data.bookmark != null) {
              skip = `bookmark=${data.bookmark}`;
            } else {
              skip = `skip=${data.skip+data.limit}`;
            }
            $p.innerHTML = `<a href="/?q=${location.query.q}&limit=${location.query.limit}&${skip}">next</a>`;
          } else {
            $p.innerHTML = '';
          }
        } else {
          $ul.innerHTML = '<li>no results found</li>';
          $p.innerHTML = '';
        }
      };
      xhr.onabort = e => { console.error('xhr aborted') };
      xhr.onerror = e => { console.error('xhr error') };
      let qs = `?q=${location.query.q}&limit=${location.query.limit}`;
      if (location.query.skip) {
        qs += `&skip=${location.query.skip}`;
      }
      if (location.query.bookmark) {
        qs += `&bookmark=${location.query.bookmark}`;
      }
      xhr.open('GET', url + qs);
      xhr.send();
      active = xhr;
    }
  });

  let $form = document.querySelector('form');
  $form.addEventListener('submit', function(e){
    e.preventDefault();

    let $input = $form.querySelector('input');
    if ($input.value) {
      history.push({
        query: {q: $input.value.trim(), limit: 25}
      });
    }

  });
});
