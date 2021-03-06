#!/bin/bash

## Install dependencies
apt-get update
apt-get install nodejs npm build-essential nodejs-legacy

## Install application
DIR="$(dirname $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd ))"

## Make bin dir if not  exist
mkdir -p "$DIR/bin/"

## Copy source files to bin folder
cp "$DIR/src/"* "$DIR/bin/"

##npm install
cd "$DIR/bin/"
npm install
