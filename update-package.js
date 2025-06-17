const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');

fs.readFile(packageJsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading package.json:', err);
    return;
  }

  try {
    // Parse the package.json data
    const packageJson = JSON.parse(data);

    // Add a buildDate field with the current date
    packageJson.buildDate = new Date().toISOString();

    // Convert the updated package.json back to a string
    const updatedPackageJson = JSON.stringify(packageJson, null, 2);

    // Write the updated package.json back to the file
    fs.writeFile(packageJsonPath, updatedPackageJson, 'utf8', (err) => {
      if (err) {
        console.error('Error writing package.json:', err);
      } else {
        console.log('buildDate added to package.json');
      }
    });
  } catch (parseError) {
    console.error('Error parsing package.json:', parseError);
  }
});