const editJsonFile = require('edit-json-file');
const replace = require('replace-in-file');

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
replace({
  files: `${WORKDIR}/client/src/config.js`,
  from: `opensupports_version = '${OLD_VERSION}';`,
  to: `opensupports_version = '${NEW_VERSION}';`
});
replace({
  files: `${WORKDIR}/client/src/index.php`,
  from: `opensupports_version = '${OLD_VERSION}';`,
  to: `opensupports_version = '${NEW_VERSION}';`
});
replace({
  files: `${WORKDIR}/server/**/*.php`,
  from: `* @apiVersion ${OLD_VERSION}`,
  to: `* @apiVersion ${NEW_VERSION}`
});
replace({
  files: `${WORKDIR}/client/src/config.js`,
  from: `v${OLD_VERSION}`,
  to: `v${NEW_VERSION}`
});
replace({
  files: `${WORKDIR}/README.md`,
  from: `v${OLD_VERSION}`,
  to: `v${NEW_VERSION}`
});
