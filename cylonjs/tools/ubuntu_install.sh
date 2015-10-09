#!/bin/bash

## Install dependencies
apt-get install nodejs npm build-essential nodejs-legacy

## Install application
DIR="$(dirname $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd ))"

## Copy source files to bin folder
cp -r "$DIR/src" "$DIR/bin/"

##npm install
cd "$DIR/bin/"
npm install
