const fs = require('fs');
const path = require('path');
const colors = require('colors');

const symlinkPath = path.resolve(__dirname, '../node_modules/app')

if (!fs.existsSync(symlinkPath)) {
  try {
    fs.symlinkSync(path.resolve(__dirname, '../app'), symlinkPath, 'file');
    console.log(colors.green('✓ Symlink created for app folder.'));
  } catch(error) {
    console.warn(
      colors.red('✗ Could\'t create symlink to app folder, please do it manually. Errors to resolve the problem:'),
      colors.red(error)
    );
  }
}
else {
  console.log(colors.green('✓ Symlink to app folder already exists.'));
}
