import L from 'leaflet';
import Utils from './utils';

const MPS_TO_MPM = 26.8224;

export default class SpeedMap {
  constructor() {
    this.map = L.map('mapid');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.path = new L.FeatureGroup().addTo(this.map);
  }
  styleSpeed(metersps_speed) {
    const pace = MPS_TO_MPM / metersps_speed;
    const scale = Utils.getColorScale();
    const scale_range = scale.length - 1;
    const speed_range = Utils.getSpeedRange();
    const scaled_value = Utils.linearScale(speed_range.min, (speed_range.max - speed_range.min), pace, scale_range);
    var style = {
        color: scale[scaled_value],
        weight: 3,
        opacity: 0.6
    };
    return style;
  }
  processFeature(feature) {
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
      var style = this.styleSpeed(speed);
      const line = new L.Polyline(latlngs, style);
      // undo reverse
      first = lat_lons[x].reverse();
      line.addTo(this.path);
    }
  }
  processGeojson(geojson) {
    this.path.clearLayers();
    for(let feature of geojson.features) {
      this.processFeature(feature);
    }
    this.map.fitBounds(this.path.getBounds(), this.path);
  }
}
