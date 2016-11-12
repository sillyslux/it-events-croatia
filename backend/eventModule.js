const path = require('path');

const { getDirs, readDir, readJSON, writeJSON, writeFile, isdir, mkdir } = require('./promisedFs');
const feedGenerator = require('./feed');
const validate = require('./validate');

const dataDir = path.resolve('gh-pages/data');
const feedDir = path.resolve('gh-pages/feed');

const getCities = () => getDirs(dataDir);
const getMonths = city => readDir(path.resolve(dataDir, city));

const createEvent = (reqBody) => {
  const newEvent = reqBody;
  const templateMain = { availableCities: {}, majorEvents: [] };
  const templateCity = [];

  // 1. validate data
  // return filename e.g. '2016-10'
  newEvent.created = newEvent.modified = new Date().toISOString();
  isdir(path.join(__dirname, '/../gh-pages/data/', newEvent.city)).then(x => console.log(x)); // eslint-disable-line no-console
  return validate(newEvent)

  // 2. create datadir if necessary /gh-pages/data/[city]/
  // return filename e.g. '2016-10'
  .then(filename =>
    isdir(path.join(__dirname, '/../gh-pages/data', newEvent.city))
    .then(x => console.log(x, filename)) // eslint-disable-line no-console
    .then(() => filename))
  .catch(filename =>
    mkdir(path.join(__dirname, '/../gh-pages/data', newEvent.city))
    .then(() => filename)
  )

  // 3. return
  // filename,
  // contents /data/main.json,
  // contents /data/[city]/2016-10.json,
  // availableCities with month names
  .then(filename => Promise.all(
    [
      readJSON(path.join(__dirname, '/../gh-pages/data/main.json')).catch(() => templateMain),
      readJSON(path.join(__dirname, '/../gh-pages/data/', newEvent.city, `${filename}.json`)).catch(() => templateCity),
      getCities().then(
        cityList => Promise.all(
          cityList.map(city =>
            getMonths(city).then(cityFiles => ({ [city]: cityFiles.filter(file => /\.json$/.test(file)).map(file => file.replace(/\.json$/, '')) }))
          )
        ).then(data => data.reduce((prev, curr) => Object.assign(prev, curr), {}))
      ),
    ]).then(data => [...data, filename])
  )

  // 3. return
  // filename,
  // contents /data/main.json,
  // contents /data/[city]/2016-10.json,
  // availableCities with month names
  .then((data) => {
    const [mainData, cityData, availableCities, filename] = data;
    mainData.availableCities = availableCities;
    newEvent.begin = Date.parse(newEvent.begin);
    if (newEvent.end) {
      newEvent.end = Date.parse(newEvent.end);
      const duration = (newEvent.end - newEvent.begin) / 60000;
      newEvent.duration = duration < 120 ? Math.round(duration) + ' min' : duration > 419 ? (duration / 60 / 24 % 1 > 0.25 ? Math.round(duration / 60 / 24) + 1 : Math.round(duration / 60 / 24)) + ' day' : Math.round(duration / 60) + ' hr';
      if (parseInt(newEvent.duration, 10) !== 1) newEvent.duration += 's';
    }
    if (newEvent.majorEvent) mainData.majorEvents.push(newEvent);

    mainData.majorEvents = mainData.majorEvents.filter(ev =>
      ev.begin > Date.now()
    ).sort((a, b) =>
      a.begin > b.begin
    );

    if (!mainData.availableCities[newEvent.city].includes(filename)) {
      mainData.availableCities[newEvent.city].push(filename);
      mainData.availableCities[newEvent.city].sort();
    }
    cityData.push(newEvent);
    cityData.sort((a, b) => a.begin > b.begin);
    return Promise.all([
      writeJSON(path.join(__dirname, '/../gh-pages/data/', newEvent.city, `${filename}.json`), cityData),
      writeJSON(path.join(__dirname, '/../gh-pages/data/main.json'), mainData),
    ]).then(() => filename);
  })
  .then(filename =>
    feedGenerator([newEvent.city, filename])
  )
  .then((feedXML) => {
    isdir(path.join(__dirname, '/../gh-pages/feed/', newEvent.city))
    .catch(() => mkdir(path.join(__dirname, '/../gh-pages/feed/', newEvent.city)))
    .then(() => writeFile(path.join(__dirname, '/../gh-pages/feed/', newEvent.city, '/atom.xml'), feedXML[0]));
    isdir(path.join(__dirname, '/../gh-pages/feed/', newEvent.city))
    .catch(() => mkdir(path.join(__dirname, '/../gh-pages/feed/', newEvent.city)))
    .then(() => writeFile(path.join(__dirname, '/../gh-pages/feed/', newEvent.city, '/rss.xml'), feedXML[1]));
  });
};

module.exports = { createEvent, getCities, getMonths };
