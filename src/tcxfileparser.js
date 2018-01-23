import TcxParser from 'tcx';
import Utils from './utils';

export default class TcxFileParser {
  constructor() {
  }
  addToMap(file, map) {
    const geojson = this.parseFile(file);
    this.processFeatures(geojson, map);
  }
  parseFile(file) {
    const geojson = TcxParser(doc);
    return geojson;
  }
  processFeatures(geojson, map) {
    map.clearFeatures();
    for(let feature of geojson.features) {
      this.processFeature(feature, map);
    }
    map.zoomToLayer();
  }
  processFeature(feature, map) {
    const lat_lons = feature.geometry.coordinates
    const total_seconds = feature.properties.TotalTimeSeconds;
    const seconds_per_segment = total_seconds / lat_lons.length;
    let first = lat_lons[0];
    let coloring = 0;
    for(let x = 1;x< lat_lons.length;x++) {
      if(coloring > 15) {
        coloring = 0;
      }
      const second = lat_lons[x];
      // reverse reverses in place
      const latlngs = [first.reverse(), second.reverse()];

      const speed = Utils.getSpeed(first[0], first[1], second[0], second[1], seconds_per_segment);
      var style = map.styleSpeed(speed);
      map.createFeature(latlngs, style);
      // undo reverse
      first = lat_lons[x].reverse();
    }
  }
}
