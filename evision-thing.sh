#!/bin/bash

PATH=$PATH:./node_modules/.bin/

USERNAME=$1
PASSWORD=$2
EMAIL=$3

if [[ $USERNAME = '' || $PASSWORD = '' || $EMAIL = '' ]]; then
    echo 'Please supply a username, password and email address.'
    exit 1
fi

OUTPUT=`casperjs evision-thing.js --username="$USERNAME" --password="$PASSWORD"`
echo $OUTPUT;


if [[ $OUTPUT == 'null' ]]; then
   echo 'There was a problem. Perhaps you are running this thing too frequently.'
   exit 1
elif [ -a output-latest.txt ]; then # script has been run before
    DIFF=`diff -U 4 output-latest.txt <(echo "${OUTPUT}")`
    if [ ${PIPESTATUS[0]} -eq 1 ]; then
        echo 'Changes found, emailing'
        echo "${DIFF}" | mail -s 'Exam update!' $EMAIL
    fi
fi

echo "${OUTPUT}" > output-latest.txt
