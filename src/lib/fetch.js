import request from 'request';
import { jsdom } from 'jsdom';
import async from 'async';
import sanitizeHtml from 'sanitize-html';
import slug from 'slug';

export default function fetch(data, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  let jar = opts.jar ? request.jar() : undefined;
  let limit = opts.limit || 10;
  let timeout = opts.timeout || 0;

  let buckets = [];
  if (timeout) {
    // divide in bucket and process each bucket sequentially with a delay of `timeout` ms in between each bucket
    let n = Math.ceil(data.length / limit);
    for (let i = 0; i < n; i++) {
      buckets.push(data.slice(i*limit, (i+1)*limit));
    }
  } else {
    buckets.push(data);
  }

  async.eachSeries(buckets, (bucket, cb) => {
    async.eachLimit(bucket, limit, (data, cb) => {
      request({
        url: data.url,
        jar: jar
      }, (err, resp, body) => {
        if (err) {
          console.error(err, data.url);
          return cb(null);
        }
        if (resp.statusCode >= 400) {
          console.error(resp.statusCode, data.url);
          return cb(null);
        }

        console.log(resp.statusCode, data.url);

        let html = sanitizeHtml(body, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat('body', 'h1', 'h2')
        });

        let document = jsdom(html).defaultView.document;

        let id = slug(`${data.publisher}-${data.title}`);

        request.put({
          url: `${process.env.COUCH_PROTOCOL}//${process.env.COUCH_ADMIN_USERNAME}:${process.env.COUCH_ADMIN_PASSWORD}@${process.env.COUCH_HOST}:${process.env.COUCH_PORT}/${process.env.COUCH_STYLE_GUIDE_DB}/${id}`,
          json: Object.assign({
            _id: id,
            text: document.body.textContent
          }, data)
        }, (err, resp, body) => {
          if (err) {
            console.error(err, data.url);
            return cb(null);
          }
          if (resp.statusCode >= 400) {
            console.error(resp.statusCode, data.url);
            return cb(null);
          }
          cb(null);
        });
      });

    }, (err) => {
      if (err) console.error(err);
      if (timeout) {
        setTimeout(cb, timeout);
      } else {
        cb(null);
      }
    });
  }, callback);

}
