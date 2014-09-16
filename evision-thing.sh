#!/bin/bash

PATH=$PATH:./node_modules/.bin/

USERNAME=$1
PASSWORD=$2
EMAIL=$3

if [[ $USERNAME = '' || $PASSWORD = '' || $EMAIL = '' ]]; then
    echo "Please supply a username, password and email address"
    exit 1
fi

casperjs evision-thing.js --username="$USERNAME" --password="$PASSWORD" > output-latest.txt


if [ -a output-previous.txt ]; then
    DIFF=`diff -U 4 output-previous.txt output-latest.txt`
    if [ ${PIPESTATUS[0]} -eq 1 ]; then
        echo "Changes found, emailing"
        echo "${DIFF}" | mail -s "Exam update!" $EMAIL
        cp output-latest.txt output-previous.txt
    fi
else
    cp output-latest.txt output-previous.txt
fi
