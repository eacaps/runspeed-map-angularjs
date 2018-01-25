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

const MIN = 6;
const MAX = 9;

const DistanceOnGeoid = (ilat1, ilon1, ilat2, ilon2) => {
  // Convert degrees to radians
  const lat1 = (ilat1 * Math.PI) / 180.0;
  const lon1 = (ilon1 * Math.PI) / 180.0;

  const lat2 = (ilat2 * Math.PI) / 180.0;
  const lon2 = (ilon2 * Math.PI) / 180.0;

  // radius of earth in metres
  const r = 6378100.0;

  // P
  const rho1 = r * Math.cos(lat1);
  const z1 = r * Math.sin(lat1);
  const x1 = rho1 * Math.cos(lon1);
  const y1 = rho1 * Math.sin(lon1);

  // Q
  const rho2 = r * Math.cos(lat2);
  const z2 = r * Math.sin(lat2);
  const x2 = rho2 * Math.cos(lon2);
  const y2 = rho2 * Math.sin(lon2);

  // Dot product
  const dot = (x1 * x2) + (y1 * y2) + (z1 * z2);
  const cos_theta = dot / (r * r);

  const theta = Math.acos(cos_theta);

  // Distance in Metres
  return r * theta;
};

export default {
  MPS_TO_MPM: 26.8224,
  linearScale: (rawMin, rawRange, score, scaleRange) => {
    if (rawRange < 1) return 0;
    const min = Math.min(rawMin + rawRange, score);
    return parseInt((Math.max(0, (min - rawMin)) * scaleRange) / rawRange, 10);
  },
  getSpeed: (lat1, lon1, lat2, lon2, time) => {
    const dist = DistanceOnGeoid(lat1, lon1, lat2, lon2);
    const speed_mps = dist / time;
    return speed_mps;
  },
  getColorScale: () => (COLORS),
  getSpeedRange: () => ({
    min: MIN,
    max: MAX,
  }),
};
