module.exports = {
  _id: '_design/styleguides',

  views: {
    byPublisher: {
      map: function(doc) {
        if (doc.publisher) {
          emit(doc.publisher, null);
        }
      },
      reduce: '_count'
    },

    floppyVsHyperlink: {
      map: function(doc) {
        if (doc.text) {
          if (/floppy|diskette|disk|ZIP-disk/i.test(doc.text)) {
            emit('floppy', null);
          }
          if (/hyperlink/i.test(doc.text)) {
            emit('hyperlink', null);
          }
        }
      },
      reduce: '_count'
    },

    styles: {
      map: function(doc) {
        if (doc.text) {
          if (/MLA|M.L.A./i.test(doc.text)) {
            emit('MLA', null);
          }
          if (/APA|A.P.A./i.test(doc.text)) {
            emit('APA', null);
          }
          if (/Chicago|CMS|CMOS/i.test(doc.text)) {
            emit('Chicago', null);
          }
          if (/Harvard/i.test(doc.text)) {
            emit('Harvard', null);
          }
          if (/Vancouver/i.test(doc.text)) {
            emit('Vancouver', null);
          }
        }
      },
      reduce: '_count'
    },

    input: {
      map: function(doc) {
        if (doc.text) {
          if (/Word|WORD|\.doc|\.docx|\.DOC|\.DOCX/.test(doc.text)) {
            emit('word', null);
          }
          if (/latex|\.tex/i.test(doc.text)) {
            emit('latex', null);
          }
        }
      },
      reduce: '_count'
    }

  },

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
