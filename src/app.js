var parse = require('tcx');

var map, path;

document.getElementById('file').onchange = (event) => {
  const file_input = document.getElementById('file');
  const file = file_input.files[0];
  console.log('file selected');
  fr = new FileReader();
  fr.onload = () => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(fr.result, "text/xml");
    // a tcx file dom, via xmldom
    const geojson = parse(doc);
    console.log(geojson);
    addToMap(geojson);
  };
  fr.readAsText(file);
}


    const MPS_TO_MPM = 26.8224;
    const SCALE_RANGE = 15;
    const COLORS = [
      '#00FF00',
      '#11EE00',
      '#22DD00',
      '#33CC00',
      '#44BB00',
      '#55AA00',
      '#669900',
      '#778800',
      '#887700',
      '#996600',
      '#AA5500',
      '#BB4400',
      '#CC3300',
      '#DD2200',
      '#EE1100',
      '#FF0000',
    ];

    function linearScale(rawMin, rawRange, score) {
      if (rawRange < 1) return 0;
      let min = Math.min(rawMin + rawRange, score);
      return parseInt((Math.max(0, (min - rawMin)) * SCALE_RANGE) / rawRange, 10);
    }

    function distance_on_geoid(ilat1, ilon1, ilat2, ilon2) {

    	// Convert degrees to radians
    	let lat1 = ilat1 * Math.PI / 180.0;
    	let lon1 = ilon1 * Math.PI / 180.0;

    	let lat2 = ilat2 * Math.PI / 180.0;
    	let lon2 = ilon2 * Math.PI / 180.0;

    	// radius of earth in metres
    	let r = 6378100.0;

    	// P
    	let rho1 = r * Math.cos(lat1);
    	let z1 = r * Math.sin(lat1);
    	let x1 = rho1 * Math.cos(lon1);
    	let y1 = rho1 * Math.sin(lon1);

    	// Q
    	let rho2 = r * Math.cos(lat2);
    	let z2 = r * Math.sin(lat2);
    	let x2 = rho2 * Math.cos(lon2);
    	let y2 = rho2 * Math.sin(lon2);

    	// Dot product
    	let dot = (x1 * x2 + y1 * y2 + z1 * z2);
    	let cos_theta = dot / (r * r);

    	let theta = Math.acos(cos_theta);

    	// Distance in Metres
    	return r * theta;
    }

    function get_speed(p1, p2, time) {
      const dist = distance_on_geoid(p1.lat, p1.lng, p2.lat, p2.lng);
      const speed_mps = dist / time;
      return speed_mps;
    }

    function fetchLocal(url) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest
        xhr.onload = function() {
          resolve(xhr.responseText)
        }
        xhr.onerror = function() {
          reject(new TypeError('Local request failed'))
        }
        xhr.open('GET', url)
        xhr.send(null)
      })
    }

        map = L.map('mapid');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.on('pathadd', () => {
      console.log('path added');
    });
    path = new L.LayerGroup().addTo(map);
    fetchLocal('../data/activity_925308754.geojson').then((response) => {
      const geojson = JSON.parse(response);
      addToMap(geojson);
    });

function addToMap(geojson) {
  const style_function = (metersps_speed) => {
    // const max_segment_speed = feature.properties.MaximumSpeed;
    const pace = MPS_TO_MPM / metersps_speed;
    const scaled_value = linearScale(6, 3, pace);
    var style = {
        color: COLORS[scaled_value],
        weight: 3,
        opacity: 0.6
    };
    return style;
  };


  const json_layer = L.geoJson(geojson);
  const layers = json_layer.getLayers();
  for(let layer of layers) {
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

      const speed = get_speed(first, second, seconds_per_segment);
      console.log(speed);
      var style = style_function(speed);
      const line = new L.Polyline(latlngs, style);
      first = lat_lons[x];
      line.addTo(path);
    }
  }
  map.fitBounds(json_layer.getBounds(), json_layer);
}
