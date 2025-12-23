#!/usr/bin/env bash

log() 
{
    if [ "$2" = "-n" ]; then
	printf "[submit] %s" "$1"
    else
	printf "[submit] %s\n" "$1"
    fi
}

RED="\033[1;31m"
YELLOW="\033[1;33m"
RESET="\033[0m"

error() 
{
    printf "${RED}[submit] error: %s${RESET}\n" "$1" >&2
    exit 1
}

warning() 
{
    printf "${YELLOW}[submit] warning: %s${RESET}\n" "$1" >&2
}

[[ ! -x "$(command -v jq)" ]] && error "jq not found, please install it"
[[ ! -x "$(command -v zip)" ]] && error "zip not found, please install it"
[[ ! -x "$(command -v git)" ]] && error "git not found, please install it"

# Check if we are in a git repository
git ls-files > /dev/null || error "not in a git repository!"

TOP_LEVEL=$(git rev-parse --show-toplevel)
cd "$TOP_LEVEL" || exit 1

TARGET_FOLDER="submission"
SUBMISSION_FILE="submission.zip"

log "creating submission..."

[ -f $SUBMISSION_FILE ] && rm -f $SUBMISSION_FILE
[ -d $TARGET_FOLDER ] && rm -rf $TARGET_FOLDER
mkdir -p "$TARGET_FOLDER"

# Need to run this before generating the submission folder
git ls-files --others --exclude-standard | while IFS='' read -r file
do
    warning "file $file is not tracked by git and will not be part of the submission"
done

git ls-files | while IFS='' read -r file
do 
    mkdir -p $TARGET_FOLDER/"$(dirname "$file")"
    cp "$file" $TARGET_FOLDER/"$(dirname "$file")"
done

log "copied files to submission folder"

cd "$TARGET_FOLDER" && zip -r "$TOP_LEVEL"/"$SUBMISSION_FILE" . > /dev/null || exit 1
cd "$TOP_LEVEL" || exit 1

log "created submission: $SUBMISSION_FILE"

PACKAGE_JSONS="non-distribution/package.json package.json"
jq -r --argjson nullVal 999 --argjson dlocVal -99 '
  .report[] | 
  .milestone as $m | 
  ([
    if .hours == $nullVal then "hours" else empty end,
    if .loc == $nullVal then "loc" else empty end,
    if .dev["cpu-no"] == $nullVal then "dev.cpu-no" else empty end,
    if .dev["mem-gb"] == $nullVal then "dev.mem-gb" else empty end,
    if .dev["ssd-gb"] == $nullVal then "dev.ssd-gb" else empty end,
    if .dloc == $dlocVal then "dloc" else empty end
  ] | select(length > 0) | "\($m) missing " + join(", "))' $PACKAGE_JSONS | while read -r message; do
  warning "report (in package.json): $message"
done

[[ -d $TARGET_FOLDER ]] && rm -rf $TARGET_FOLDER
[[ -f "$SUBMISSION_FILE" ]] || exit 1

log "you can now upload $SUBMISSION_FILE to the autograder!"
