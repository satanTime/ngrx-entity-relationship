#!/usr/bin/env bash

set -e

npm run build
npm run lint
npm run test -- --single-run --no-progress --coverage
