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

let MIN = 6;
let MAX = 9;

export default {
  linearScale: (rawMin, rawRange, score, scaleRange) => {
    if (rawRange < 1) return 0;
    let min = Math.min(rawMin + rawRange, score);
    return parseInt((Math.max(0, (min - rawMin)) * scaleRange) / rawRange, 10);
  },
  getSpeed: (p1, p2, time) => {
    const dist = DistanceOnGeoid(p1.lat, p1.lng, p2.lat, p2.lng);
    const speed_mps = dist / time;
    return speed_mps;
  },
  getColorScale: () => {
    return COLORS;
  },
  getSpeedRange: () => {
    return {
      min: MIN,
      max: MAX
    };
  }
};

const DistanceOnGeoid = (ilat1, ilon1, ilat2, ilon2) => {
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
