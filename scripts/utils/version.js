const fs = require('fs');
const path = require('path');

const versionReg = /\-[a-zA-Z]+\.[0-9]+$/;

function getPackageJson(packagePath) {
  const package = require(path.join(packagePath, 'package.json'));
  return package;
}

module.exports = function getPackageBumpVersion(rootPath) {
  const dirs = fs.readdirSync(path.join(rootPath, 'packages'));
  let bumpVersion = '';
  if (dirs.length) {
    for (let index = 0; index < dirs.length; index++) {
      const packageJson = getPackageJson(
        path.join(rootPath, 'packages', dirs[index]),
      );
      if (
        packageJson &&
        packageJson.version &&
        versionReg.test(packageJson.version)
      ) {
        bumpVersion = packageJson.version.match(/[a-zA-Z]+/)[0];
        break;
      }
    }
  }
  return bumpVersion;
};
