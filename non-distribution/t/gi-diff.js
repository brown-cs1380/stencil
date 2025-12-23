#!/usr/bin/env node

/* Global Index Diff Checker */

const fs = require('fs');
const {exit} = require('process');

const identical = (l1, l2) => {
  const term1 = l1.split(/\|/)[0].trim();
  const term2 = l2.split(/\|/)[0].trim();

  if (term1 !== term2) {
    return false;
  }

  const fullLine1 = l1.split(/\|/)[1].trim();
  const fullLine2 = l2.split(/\|/)[1].trim();

  const line1 = fullLine1.split(/\s+/);
  const line2 = fullLine2.split(/\s+/);

  if (line1.length !== line2.length) {
    return false;
  }

  const length = line1.length;

  const pairs1 = [];
  const pairs2 = [];
  for (let i = 0; i < length - 1; i += 2) {
    pairs1.push({url: line1[i].trim(), count: parseInt(line1[i + 1])});
    pairs2.push({url: line2[i].trim(), count: parseInt(line2[i + 1])});
  }

  if (pairs1.length !== pairs2.length) {
    return false;
  }

  const pairsLength = pairs1.length;

  for (let i = 0; i < pairsLength - 1; i += 2) {
    if (pairs1[i].count < pairs1[i + 1].count) {
      return false;
    }
  }

  for (let i = 0; i < pairsLength - 1; i += 2) {
    if (pairs2[i].count < pairs2[i + 1].count) {
      return false;
    }
  }

  const sets1 = {};
  const sets2 = {};

  for (const pair of pairs1) {
    if (sets1[pair.count] === undefined) {
      sets1[pair.count] = {};
      sets1[pair.count][pair.url] = true;
    } else {
      sets1[pair.count][pair.url] = true;
    }
  }

  for (const pair of pairs2) {
    if (sets2[pair.count] === undefined) {
      sets2[pair.count] = {};
      sets2[pair.count][pair.url] = true;
    } else {
      sets2[pair.count][pair.url] = true;
    }
  }

  const counts1 = Object.keys(sets1).sort();
  const counts2 = Object.keys(sets2).sort();

  if (counts1.length !== counts2.length) {
    return false;
  }

  const countsLength = counts1.length;

  for (let i = 0; i < countsLength; i++) {
    if (counts1[i] !== counts2[i]) {
      return false;
    }
  }

  for (const count in sets1) {
    const s1 = sets1[count];
    const s2 = sets2[count];

    const a1 = [...Object.keys(s1)];
    const a2 = [...Object.keys(s2)];

    const sorted1 = a1.sort();
    const sorted2 = a2.sort();

    if (sorted1.length !== sorted2.length) {
      return false;
    }

    const length = sorted1.length;

    for (let i = 0; i < length; i++) {
      if (sorted1[i] !== sorted2[i]) {
        return false;
      }
    }
  }

  return true;
};

try {
  let wrong = 0;
  let total = 0;
  const slack = parseInt(process.env['DIFF_PERCENT'], 10); // percentage
  if (isNaN(slack)) {
    console.error('environment variable DIFF_PERCENT is not defined');
    exit(1);
  }

  const file1 = fs.readFileSync(process.argv[2], 'utf8');
  const file2 = fs.readFileSync(process.argv[3], 'utf8');

  const lines1 = file1.split('\n').filter((line) => line.trim().length !== 0);
  const lines2 = file2.split('\n').filter((line) => line.trim().length !== 0);

  if (lines1.length !== lines2.length) {
    exit(1);
  }

  const length = lines1.length;
  const wrongLines = [];

  for (let i = 0; i < length; i++) {
    if (!identical(lines1[i], lines2[i])) {
      wrongLines.push({actual: lines1[i], expected: lines2[i]});
      wrong++;
    }
    total++;
  }

  if (100 * wrong / total <= slack) {
    exit(0);
  } else {
    for (const line of wrongLines) {
      console.log(`< ${line.actual}`);
      console.log(`> ${line.expected}`);
    }
    exit(1);
  }
} catch (err) {
  console.error(err);
}
