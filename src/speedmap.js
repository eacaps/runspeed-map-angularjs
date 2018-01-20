import L from 'leaflet';
import Utils from './utils';

const MPS_TO_MPM = 26.8224;

export default class SpeedMap {
  constructor() {
    this.map = L.map('mapid');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.path = new L.LayerGroup().addTo(this.map);
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
  processLayer(layer) {
    const lat_lons = layer.getLatLngs();
    const total_seconds = layer.feature.properties.TotalTimeSeconds;
    const seconds_per_segment = total_seconds / lat_lons.length;
    let first = lat_lons[0];
    let coloring = 0;
    for(let x = 1;x< lat_lons.length;x++) {
      if(coloring > 15) {
        coloring = 0;
      }
      const second = lat_lons[x];
      const latlngs = [first, second];

      const speed = Utils.getSpeed(first, second, seconds_per_segment);
      // console.log(speed);
      var style = this.styleSpeed(speed);
      const line = new L.Polyline(latlngs, style);
      first = lat_lons[x];
      line.addTo(this.path);
    }
  }
  processGeojson(geojson) {
    this.path.clearLayers();
    const json_layer = L.geoJson(geojson);
    const layers = json_layer.getLayers();
    for(let layer of layers) {
      this.processLayer(layer);
    }
    this.map.fitBounds(json_layer.getBounds(), json_layer);
  }
}
