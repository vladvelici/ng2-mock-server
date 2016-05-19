(function(global) {
  // map tells the System loader where to look for things
  var map = {
    'app':                        '.', // 'dist',
    'rxjs':                       '../node_modules/rxjs',
    '@angular':                   '../node_modules/@angular',
    'ng2-mock-server':            '../node_modules/ng2-mock-server',
    'symbol-observable':          '../node_modules/symbol-observable'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'ng2-mock-server':            { defaultExtension: 'js' },
    'symbol-observable':          { defaultExtension: 'js', main: 'index.js' }
  };
  var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/router-deprecated',
    '@angular/testing',
    '@angular/upgrade',
  ];
  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });
  var config = {
    map: map,
    packages: packages
  }
  System.config(config);
})(this);
