import TcxParser from 'tcx';
import Utils from './utils';
import SpeedMap from './speedmap';

const map = new SpeedMap();

document.getElementById('file').onchange = (event) => {
  const file_input = document.getElementById('file');
  const file = file_input.files[0];
  const fr = new FileReader();
  fr.onload = () => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(fr.result, "text/xml");
    // a tcx file dom, via xmldom
    const geojson = TcxParser(doc);
    console.log(geojson);
    map.processGeojson(geojson);
  };
  fr.readAsText(file);
}

// fetch charleston data
fetch('../data/activity_925308754.geojson').then((response) => {
  return response.text();
}).then((text) => {
  const geojson = JSON.parse(text);
  map.processGeojson(geojson);
});

import angular from 'angular';

let app = () => {
  return {
    template: `<span>hi</span>`,
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor() {
    this.url = 'https://github.com/preboot/angular-webpack';
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;
