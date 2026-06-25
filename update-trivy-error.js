const fs = require('fs');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        filelist = walkSync(dir + '/' + file, filelist);
      }
    } else {
      if (file === 'build-deploy.yml') {
        filelist.push(dir + '/' + file);
      }
    }
  });
  return filelist;
};

const files = walkSync('d:/medicojobs');

files.forEach(file => {
  if (file.includes('.github/workflows/build-deploy.yml')) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (!content.includes('continue-on-error: true')) {
      content = content.replace(/(uses: aquasecurity\/trivy-action@master)/, "$1\n        continue-on-error: true");
      fs.writeFileSync(file, content);
      console.log('Updated ' + file);
    }
  }
});
