# Style guide source information

### Wiley
- Journal titles (xls): http://wileyonlinelibrary.com/journals-list

#### Style guide URL pattern
``http://onlinelibrary.wiley.com/journal/<DOI>/homepage/ForAuthors.html``

e.g., ``http://onlinelibrary.wiley.com/journal/10.1002/(ISSN)1099-1158/homepage/ForAuthors.html``

#### Instructions
Using the first tab of the Wiley [Journal Titles list](http://wileyonlinelibrary.com/journals-list), create the URL by:

- remove/ignore first 4 rows of the spreadsheet
- concatenate: ``WOL URL``, '/homepage/ForAuthors.html'

### Scopus
All title lists: https://www.elsevier.com/solutions/scopus/content

Scopus Journal Title List (xlsx): https://www.elsevier.com/__data/assets/excel_doc/0015/91122/title_list.xlsx


### Elsevier
All Title lists: https://www.elsevier.com/solutions/sciencedirect/content/journal-title-lists

Active titles (xls):http://info.sciencedirect.com/techsupport/journals/jnlactive.xls

#### Style guide URL pattern
``https://www.elsevier.com/journals/<source-title>/<print-issn>/guide-for-authors``

- source-title: full journal name, with hyphen-separated words
- print-issn: the print ISSN number (with ``-`` inserted between the first 4 digits and the last 4 digits)

e.g., ``https://www.elsevier.com/journals/clinical-imaging/0899-7071/guide-for-authors``

#### Instructions
Using the first tab of the [Scopus title list](https://www.elsevier.com/__data/assets/excel_doc/0015/91122/title_list.xlsx), create the URL pattern by:

- filtering for: ``Publisher imprints grouped to main Publisher`` = Elsevier
- add hyphen (``-``) between first 4 digits and last 4 digits in ``Print-ISSN`` field
- replace spaces with hyphens (``-``) in ``Source Title (Medline-sourced journals are indicated in Green)`` field
- concatenate: ``https://www.elsevier.com/journals/``, hyphenated ``Source Title``, '/', hyphenated ``Print-ISSN``, '/guide-for-authors'

### SAGE
All title lists: https://us.sagepub.com/en-us/nam/title-lists

SAGE premier title list 2016 (xlsx): https://us.sagepub.com/sites/default/files/premier_2016_1.xlsx

#### Style guide URL pattern
``https://us.sagepub.com/en-us/nam/journal/<journal-name>#submission-guidelines``

e.g., ``https://us.sagepub.com/en-us/nam/journal/clinical-ethics#submission-guidelines``

However, the URL sometimes includes a custom journal id not available from the title list:

e.g., ``https://us.sagepub.com/en-us/nam/american-sociological-review/journal201969#submission-guidelines``

#### Instructions
Using the [SAGE premier title list](https://us.sagepub.com/sites/default/files/premier_2016_1.xlsx):
- follow the URL in the ``URL`` field for each title (where available)
- follow the URL of the ``<a>`` tag for the text 'Submit a Manuscript' or 'Manuscript submission' (the URL should end in ``#submission-guidelines``)

### Taylor & Francis
All titles: http://www.tandfonline.com/page/title-lists

Current content access (txt - can open in Excel and auto-convert to columns): http://www.tandfonline.com/action/contentHoldings?code=JCTCPF_N_2013_016

#### Style guide URL pattern

``http://www.tandfonline.com/action/authorSubmission?journalCode=<title_id>&page=instructions``

- where ``title_id`` is the short name of the journal title

e.g., ``http://www.tandfonline.com/action/authorSubmission?journalCode=rajt20&page=instructions``

#### Instructions
Using the T&F [current content access](http://www.tandfonline.com/action/contentHoldings?code=JCTCPF_N_2013_016):

Web option
- follow the URL in the ``title_url`` field for each journal title
- click 'submit' to unfold the menu and go to ``Instructions for authors`` (the URL should contain 'page=instructions', e.g., ``http://www.tandfonline.com/action/authorSubmission?journalCode=rwrd20&page=instructions``)

Spreadsheet option
- concatenate: 'http://www.tandfonline.com/action/authorSubmission?journalCode=', ``title_id`` field, '&page=instructions'

### Hindawi
A to Z list of titles: http://www.hindawi.com/journals/

#### Style guide URL pattern
``http://www.hindawi.com/journals/<journal short name>/guidelines/``

- journal short name: publisher generated journal abbreviation (it's basically the first word of each word in the title, excluding things like 'in', 'of', etc)

#### Instructions
- for each journal in the [online list](http://www.hindawi.com/journals/), get the URL of the journal (this is the only way to get the short name of the journal).
- append 'guidelines/' to the journal URL.

### Biomedcentral (BMC)
styleguide for all BMC journals: http://www.biomedcentral.com/submissions/preparing-your-manuscript-and-supporting-information

- for each journal in the [online list](http://www.biomedcentral.com/journals), get the URL of the journal (this is the only way to get the short name of the journal)
- append '/submission-guidelines' to the journal URL.

### Springer (manual)
All titles: http://www.springer.com/gp/librarians/journal-price-list

2016 Journals: http://resource-cms.springer.com/springer-cms/rest/v1/content/719916/data/v5/2016+Springer+Journals+List

#### Style guide URL pattern
general journal home page: http://www.springer.com/<general subject>/<primary subject>/journal/<journal number>

- journal subjects and general subjects are not in the title list (or predictable)
- style guides are overlays or PDFs (e.g., http://www.springer.com/cda/content/document/cda_downloaddocument/10114_IFA.pdf?SGWID=0-0-45-95453-p1135685)
