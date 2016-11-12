/* eslint-disable
  no-confusing-arrow,
  no-console */

const moment = require('moment');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');
const { readDir, readJSON } = require('./promisedFs');
const md5 = require('md5');

const env = new nunjucks.Environment();
env.addFilter('uriencode', str => encodeURI(str));

const atom = nunjucks.compile(fs.readFileSync('backend/feed.tpl/atom.xml', 'utf8'), env);
const rss = nunjucks.compile(fs.readFileSync('backend/feed.tpl/rss2.xml', 'utf8'), env);

const config = require('../config');

// var atomTmplSrc = pathFn.join(__dirname, '../atom.xml');
// var atomTmpl = nunjucks.compile(fs.readFileSync(atomTmplSrc, 'utf8'), env);
// var rss2TmplSrc = pathFn.join(__dirname, '../rss2.xml');
// var rss2Tmpl = nunjucks.compile(fs.readFileSync(rss2TmplSrc, 'utf8'), env);

//   getCities: () => getDirs(__dirname + '/../gh-pages/data/'),
//   getMonths: city => readDir(__dirname + '/../gh-pages/data/' + city)
// getCities().then(
//   cityList => Promise.all(
//     cityList.map( city =>
//       getMonths(city).then( cityFiles =>
 // ({[city]:cityFiles.filter(filename=>
 // /\.json$/.test(filename)).map(filename=>filename.replace(/\.json$/,''))}) )
//     )
//   )
// ).then( data => console.log(data) );

module.exports = (data) => {
  console.log(data);
  const [city] = data; // [city, filename]
  return readDir(path.join(__dirname, '/../gh-pages/data/', city))
  .then(cityFiles =>
    cityFiles.filter(filename => /\.json$/.test(filename))
  )
  .then(months => Promise.all(
    months.map(month => readJSON(path.join(__dirname, '/../gh-pages/data/', city, month)))
  ))
  .then(datb =>
    ({
      config: config.feed,
      genUuid: key => `urn:uuid:${/(\S{8})(\S{4})(\S{4})(\S{4})(\S{12})/.exec(md5(key)).slice(1).join('-')}`,
      toISOString: val => val ? new Date(val).toISOString() : new Date().toISOString(),
      toGMTString: val => val ? new Date(val).toGMTString() : new Date().toGMTString(),
      feedData: datb.reduce((p, c) => [...p, ...c], []),
      city,
      moment,
    })
  )
  .then(eventData => [
    atom.render(eventData),
    rss.render(eventData),
  ]);

  // var config = this.config;
  // var feedConfig = config.feed;
  // var template = feedConfig.type === 'rss2' ? rss2Tmpl : atomTmpl;
  //
  // var posts = locals.posts.sort('-date');
  // if (feedConfig.limit) posts = posts.limit(feedConfig.limit);
  //
  // var url = config.url;
  // if (url[url.length - 1] !== '/') url += '/';
  //
  // var xml = template.render({
  //   config: config,
  //   url: url,
  //   posts: posts,
  //   feed_url: config.root + feedConfig.path
  // });
  //
  // return {
  //   path: feedConfig.path,
  //   data: xml
  // };
};
