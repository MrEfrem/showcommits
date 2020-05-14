#!/usr/bin/env node
import fs from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const ARG_DATE = '--date';

const cliArgs = process.argv.slice(2);
/** @type {string=} */
let dateArg;
for (let arg of cliArgs) {
  if (arg.slice(0, 2) === '--' || arg[0] === '-') {
    switch (arg.split('=')[0]) {
      case ARG_DATE:
        dateArg = arg.split('=')[1];
        break;
      default:
        throw new Error(`Unknown argument ${arg}`);
    }
  }
}

const curDate = new Date();
let filterDate = dateArg;
if (!filterDate) {
  let year = curDate.getFullYear();
  let month = `0${curDate.getMonth()}`.substr(-2);
  if (curDate.getDate() > 10) {
    month = `0${curDate.getMonth() + 1}`.substr(-2);
  }
  if (month === '00') {
    month = '01';
    year--;
  }
  filterDate = `${year}-${month}`;
}

const dirs = fs.readdirSync('.');
/**
 * @param {string} source
 */
const isDirectory = (source) => fs.statSync(source).isDirectory();

const filteredDirs = dirs.filter((dir) => {
  try {
    return isDirectory(dir) && isDirectory(join(dir, '.git'));
  } catch (err) {} // eslint-disable-line
  return false;
});
filteredDirs.sort();

let resultHtml = '';
for (let dir of filteredDirs) {
  const results = execSync(
    `cd ${dir} && git hist|grep -i ${filterDate}|awk '{$1="";$2="";$4="";print $0}'|sed 's/(HEAD.*//g'|sed 's/(origin.*)//g'|sed 's/\\[MrEfrem.*//g'`
  ).toString();
  if (results) {
    //eslint-disable-next-line
    results.split('\n').forEach((str) => {
      const trimmedStr = str.trim();
      if (trimmedStr) {
        let [date, ...rest] = trimmedStr.split(' ');
        if (/\[[^\s\]]+\]/.test(rest.slice(-1)[0])) {
          rest = rest.slice(0, rest.length - 1);
        }
        const curDay = Number(date.split('-')[2]);
        if (
          dateArg ||
          (curDate.getDate() > 10 && curDate.getDate() < 25 && curDay < 16) ||
          (curDate.getDate() <= 10 && curDay > 15)
        ) {
          const str = `${dir}: ${rest.join(' ').trim()}`;
          console.log(`${date} ${str}`);
          resultHtml = `${resultHtml}<tr><td>${str}</td></tr>`;
        }
      }
    });
  }
}

if (resultHtml.length) {
  resultHtml = `
<html>
  <head>
    <meta content="text/html; charset=UTF-8"http-equiv=content-type />
    <style>
      th, td {
        padding:0;
      }
      td {
        border-right-style: solid;
        border-bottom-color: #c2c2c2;
        border-top-width: 0;
        border-right-width: 0;
        border-left-color: #000;
        vertical-align: middle;
        border-right-color: #000;
        border-left-width: 0;
        border-top-style: solid;
        border-left-style: solid;
        border-bottom-width: 1.5pt;
        width: 407.2pt;
        border-top-color: #c2c2c2;
        border-bottom-style: solid;
      }
    </style>
  </head>
  <body>
    <table>${resultHtml}</table>
  </body>
</html>
`;
  fs.writeFileSync(`commits_${filterDate.replace(/-/g, '_')}.html`, resultHtml);
}
