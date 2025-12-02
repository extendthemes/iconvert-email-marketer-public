#!/bin/bash

echo "1:$1"

# cd "$1"
echo "build script: build"
export NODE_ENV=development
npm install --legacy-peer-deps --verbose --prefix "$1"
export NODE_ENV=production
npm run "build" --prefix "$1"
