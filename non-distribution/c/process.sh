#!/bin/bash

# Convert input to a stream of non-stopword terms
# Usage: input > ./process.sh > output

# Convert each line to one word per line, **remove non-letter characters**, make lowercase, convert to ASCII; then remove stopwords (inside d/stopwords.txt)
# Commands that will be useful: tr, iconv, grep

tr -cs A-Za-z '\n' | 
	iconv -c -t ascii//TRANSLIT | 
	tr '[:upper:]' '[:lower:]' | 
	grep -vwFf d/stopwords.txt || true
