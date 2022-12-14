const glob = require('glob');

glob(
  '/Users/theson/Documents/Stoplight Studio/**/v3/**/*.yaml',
  (err, matches) => {
    console.log(err);
    console.log(matches);
  }
);
