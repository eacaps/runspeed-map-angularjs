import L from 'leaflet';
import Utils from './utils';

export default class SpeedMap {
  constructor() {
    this.map = L.map('mapid');
    const mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
    const accessToken = 'pk.eyJ1IjoiZWFjYXBzIiwiYSI6ImNqY3JtNW94bDAwdWgyd3VzMGV5eGNpdm4ifQ.7N54IDeHZs2NFmV6hKg5Dg';
    /*
    streets-v9
    satellite-streets-v9
    light-v9
    dark-v9
    outdoors-v9
    */
    const mapbox_layer = L.tileLayer(mapboxUrl, {id: 'outdoors-v9', attribution: '<a href=https://www.mapbox.com/>Mapbox</a>', maxZoom: 20, accessToken: accessToken});
    mapbox_layer.addTo(this.map);
    this.path = new L.FeatureGroup().addTo(this.map);
  }
  styleSpeed(metersps_speed) {
    const pace = Utils.MPS_TO_MPM / metersps_speed;
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
  createFeature(latlngs, style) {
    const line = new L.Polyline(latlngs, style);
    line.addTo(this.path);
  }
  clearFeatures() {
    this.path.clearLayers();
  }
  zoomToLayer() {
    this.map.fitBounds(this.path.getBounds(), {padding: [30, 30]});
  }
}
