#!/usr/bin/env node
import fs from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const curDate = new Date();
let filterDate = curDate.getFullYear().toString();
let month = `0${curDate.getMonth()}`.substr(-2);
if (curDate.getDate() > 10) {
  month = `0${curDate.getMonth() + 1}`.substr(-2);
}
filterDate += `-${month}`;

if (process.argv[2]) {
  filterDate = process.argv[2];
}

const dirs = fs.readdirSync('.');
/**
 * @param {string} source
 */
const isDirectory = source => fs.statSync(source).isDirectory();

const filteredDirs = dirs.filter(dir => {
  try {
    return isDirectory(dir) && isDirectory(join(dir, '.git'));
  } catch (err) {} // eslint-disable-line
  return false;
});
filteredDirs.sort();

for (let dir of filteredDirs) {
  const results = execSync(
    `cd ${dir} && git hist|grep -i ${filterDate}|awk '{$1="";$2="";$4="";print $0}'|sed 's/(HEAD.*//g'|sed 's/(origin.*)//g'|sed 's/\\[MrEfrem.*//g'`
  ).toString();
  if (results) {
    console.log(dir);
    console.log(results);
  }
}
