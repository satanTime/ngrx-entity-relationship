#!/bin/bash

export IE_BIN="/c/Program Files/Internet Explorer/iexplore.exe"
cd /c/ && rm -Rf ngrx-entity-relationship && mkdir ngrx-entity-relationship && cd ngrx-entity-relationship
find /z/ngrx-entity-relationship -maxdepth 1 -not -name ngrx-entity-relationship -not -name .git -not -name docs -not -name e2e -not -name node_modules -exec cp -r {} . \;
npm ci --no-optional --ignore-scripts
npm run nx test:ie ngrx-entity-relationship
