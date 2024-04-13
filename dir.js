'use strict';

const fs = require("fs");
const path = require("path");

function mkdir(dir) {
  if (fs.existsSync(dir)) {
    return true;
  } else {
    if (mkdir(path.dirname(dir))) {
      fs.mkdirSync(dir);
      return true;
    }
  }
}

function rmdir(dir) {
  let arr = [dir];
  let current = null;
  let index = 0;

  while ((current = arr[index++])) {
    let stat = fs.statSync(current);

    if (stat.isDirectory()) {
      let files = fs.readdirSync(current);

      arr = [...arr, ...files.map((file) => path.join(current, file))];
    }
  }

  for (var i = arr.length - 1; i >= 0; i--) {
    let stat = fs.statSync(arr[i]);

    if (stat.isDirectory()) {
      fs.rmdirSync(arr[i]);
    } else {
      fs.unlinkSync(arr[i]);
    }
  }
}

module.exports = {
  mkdir,
  rmdir,
};
