# style-guide-db

A database of style guides see http://styleguides.science.ai

## Setup

- Setup and start [CouchDB](http://couchdb.apache.org/) and [CouchDB lucene](https://github.com/rnewson/couchdb-lucene) (`brew install couchdb couchdb-lucene`) or [Cloudant](https://cloudant.com/).
- Define (and export) the following environment variables: `COUCH_PROTOCOL`, `COUCH_HOST`, `COUCH_PORT`, `COUCH_ADMIN_USERNAME`, `COUCH_ADMIN_PASSWORD` `COUCH_STYLE_GUIDE_DB`.
- Install dependencies: `npm install`.
- Download the data (list of publications): `npm run data`
- Scrap the styleguides and populate database: `npm run fetch`
- Build webapp `npm run build`
