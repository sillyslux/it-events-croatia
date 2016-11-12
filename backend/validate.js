module.exports = newEvent => new Promise((resolve, reject) => {
  let filename;
  let reason;
  const expect = ['title', 'city', 'begin', 'link', 'description'];

  // check Date
  try {
    filename = new Date(newEvent.begin).toISOString().substr(0, 7);
  } catch (ex) {
    reject(`Invalid Value Date Begin\n${ex}`);
  }

  // check if required fields are provided
  if (!expect.every(field => newEvent[field] || ((reason = `Missing Required Value: ${field}`) && false))) {
    reject(reason);
  } else {
    resolve(filename);
  }
});
