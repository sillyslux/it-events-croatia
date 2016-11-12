const fs = require('fs');
const nodePath = require('path');

const readDir = path => new Promise((resolve, reject) =>
  fs.readdir(path, (err, res) => {
    if (err) reject(err);
    else resolve(res);
  })
);

const readFile = (filename, enc = 'utf-8') => new Promise((resolve, reject) =>
  fs.readFile(filename, enc, (err, res) => {
    if (err) reject(err);
    else resolve(res);
  })
);


const readJSON = filename => new Promise((resolve, reject) =>
  readFile(filename, 'utf8').then((res) => {
    try {
      resolve(JSON.parse(res));
    } catch (ex) {
      reject(ex);
    }
  }, reject)
);

const isdir = path => new Promise((resolve, reject) => {
  fs.stat(path, (err, stats) => {
    console.log(path, err, stats);
    if (err) reject('some err... maybe directory for %city% not found');
    else resolve(stats.isDirectory());
  });
});


const mkdir = path => new Promise((resolve, reject) => {
  fs.mkdir(path, (err) => {
    if (err) reject(`can&apos;t create directory ${path}`);
    else resolve();
  });
});

const writeJSON = (path, data) => new Promise((resolve, reject) => {
  fs.writeFile(path, JSON.stringify(data, null, '  '), (err) => {
    if (err) reject('couldn\'t write', path);
    else resolve();
  });
});

const writeFile = (path, data) => new Promise((resolve, reject) => {
  fs.writeFile(path, data, (err) => {
    if (err) reject('couldn&apos;t write', path);
    else resolve();
  });
});

const getDirs = path =>
  readDir(path)
  .then(dirList =>
    Promise.all(dirList.map(nodeName =>
      isdir(nodePath.resolve(path, nodeName)).then((res) => {
        if (res) return nodeName;
        return null;
      })
    ))
  ).then(dirsOnly =>
    dirsOnly.filter(dir => dir)
  );

module.exports = { getDirs, readDir, readFile, readJSON, writeJSON, writeFile, isdir, mkdir };
