module.exports = {
  _id: '_design/styleguides',

  // couchdb-lucene
  fulltext: {
    styleguides: {
      index: function(doc) {
        if (!doc.text) {
          return null;
        }

        var ret = new Document();
        ret.add(doc.text);

        [ 'title', 'about', 'url', 'publisher' ].forEach(function(p) {
          if (doc[p]) {
            ret.add(Array.isArray(doc[p]) ? doc[p].join(', ') : doc[p], { field: p, store: 'yes', index: (p === 'about') ? 'analyzed': 'no' });
          }
        });

        return ret;
      }
    }
  },

  // cloudant
  indexes: {
    styleguides: {
      index: function(doc) {
        if (doc.text) {
          index("default", doc.text);
          [ 'title', 'about', 'url', 'publisher' ].forEach(function(p) {
            if (doc[p]) {
              index(p, Array.isArray(doc[p]) ? doc[p].join(', ') : doc[p], { store: true, index: p === 'about' });
            }
          });
        }
      }
    }
  },

  language: 'javascript'
};
