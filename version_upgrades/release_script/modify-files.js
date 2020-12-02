const editJsonFile = require('edit-json-file');
const regexReplace = require('regex-replace');

const WORKDIR = `${__dirname}/../..`;

const OLD_VERSION = (function(){
  const file = editJsonFile(`${WORKDIR}/client/package.json`);
  return file.get('version');
})();
const NEW_VERSION = process.env.VERSION;


function updateJSONVersion(filePath) {
  const file = editJsonFile(filePath);
  file.set('version', NEW_VERSION);
  file.save();  
}

// Update json versions
updateJSONVersion(`${WORKDIR}/client/package.json`);
updateJSONVersion(`${WORKDIR}/client/package-lock.json`);
updateJSONVersion(`${WORKDIR}/server/apidoc.json`);

// Replace in places
regexReplace(
  `opensupports_version = '${OLD_VERSION}';`,
  `opensupports_version = '${NEW_VERSION}';`,
  `${WORKDIR}/client/src/config.js`
);
regexReplace(
  `opensupports_version = '${OLD_VERSION}';`,
  `opensupports_version = '${NEW_VERSION}';`,
  `${WORKDIR}/client/src/index.php`
);
regexReplace(
  `* @apiVersion ${OLD_VERSION}`,
  `* @apiVersion ${NEW_VERSION}`,
  `${WORKDIR}/server`
);
regexReplace(
  `v${OLD_VERSION}`,
  `v${NEW_VERSION}`,
  `${WORKDIR}/README.md`
);
