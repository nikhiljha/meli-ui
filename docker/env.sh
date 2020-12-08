#!/usr/bin/env sh

[[ "$1" == "" ]] && echo 'missing env prefix ($1)' && exit 1;
APP_ENV_PREFIX="$1"

[[ "$2" == "" ]] && echo 'missing env prefix ($2)' && exit 1;
APP_ENV_DIRECTORY="$2"

mkdir -p $APP_ENV_DIRECTORY

OUTPUT_PATH="$APP_ENV_DIRECTORY/env.txt"

echo "Writing env file to $OUTPUT_PATH"

printenv | grep "^$APP_ENV_PREFIX" > $OUTPUT_PATH

cat $OUTPUT_PATH
