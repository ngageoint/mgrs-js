import { GridConstants, Hemisphere, HemisphereUtils, Point } from '@ngageoint/grid-js';
import * as sprintf from 'sprintf-js';
import DecimalFormat from 'decimal-format';
import { GridZones } from '../gzd/GridZones';
import { MGRS } from '../MGRS';

/**
 * Universal Transverse Mercator Projection
 */
export class UTM {
  /**
   * Zone number
   */
  private readonly zone: number;

  /**
   * Hemisphere
   */
  private readonly hemisphere: Hemisphere;

  /**
   * Easting
   */
  private readonly easting: number;

  /**
   * Northing
   */
  private readonly northing: number;

  /**
   * UTM string pattern
   */
  private static readonly utmPattern = new RegExp('^(\\d{1,2})\\s*([N|S])\\s*(\\d+\\.?\\d*)\\s*(\\d+\\.?\\d*)$', 'i');

  /**
   * Create
   *
   * @param zone
   *            zone number
   * @param hemisphere
   *            hemisphere
   * @param easting
   *            easting
   * @param northing
   *            northing
   * @return UTM
   */
  public static create(zone: number, hemisphere: Hemisphere, easting: number, northing: number): UTM {
    return new UTM(zone, hemisphere, easting, northing);
  }

  /**
   * Create a point from the UTM attributes
   *
   * @param zone
   *            zone number
   * @param hemisphere
   *            hemisphere
   * @param easting
   *            easting
   * @param northing
   *            northing
   * @return point
   */
  public static point(zone: number, hemisphere: Hemisphere, easting: number, northing: number): Point {
    return UTM.create(zone, hemisphere, easting, northing).toPoint();
  }

  /**
   * Constructor
   *
   * @param zone
   *            zone number
   * @param hemisphere
   *            hemisphere
   * @param easting
   *            easting
   * @param northing
   *            northing
   */
  constructor(zone: number, hemisphere: Hemisphere, easting: number, northing: number) {
    this.zone = zone;
    this.hemisphere = hemisphere;
    this.easting = easting;
    this.northing = northing;
  }

  /**
   * Get the zone number
   *
   * @return zone number
   */
  public getZone(): number {
    return this.zone;
  }

  /**
   * Get the hemisphere
   *
   * @return hemisphere
   */
  public getHemisphere(): Hemisphere {
    return this.hemisphere;
  }

  /**
   * Get the easting
   *
   * @return easting
   */
  public getEasting(): number {
    return this.easting;
  }

  /**
   * Get the northing
   *
   * @return northing
   */
  public getNorthing(): number {
    return this.northing;
  }

  /**
   * Convert to a point
   *
   * @return point
   */
  public toPoint(): Point {
    let north = this.northing;
    if (this.hemisphere === Hemisphere.SOUTH) {
      // Remove 10,000,000 meter offset used for southern hemisphere
      north -= 10000000.0;
    }

    // Karney (2011), "Transverse Mercator with an accuracy of a few
    // nanometers", eqs 15-22: Krueger series to order n^6
    const k = UTM.krueger();
    const eta = (this.easting - 500000) / (UTM.K0 * k.A);
    const xi = north / (UTM.K0 * k.A);

    const [dXi, dEta] = UTM.kruegerSum(k.beta, xi, eta);
    const xiPrime = xi - dXi;
    const etaPrime = eta - dEta;

    const sinhEtaPrime = Math.sinh(etaPrime);
    const sinXiPrime = Math.sin(xiPrime);
    const cosXiPrime = Math.cos(xiPrime);
    const tauPrime = sinXiPrime / Math.sqrt(sinhEtaPrime * sinhEtaPrime + cosXiPrime * cosXiPrime);

    // Newton iteration for tau = tan(latitude)
    let tau = tauPrime / (1 - k.e * k.e);
    for (let i = 0; i < 10; i++) {
      const tauIPrime = UTM.conformalTau(tau, k.e);
      const delta =
        (((tauPrime - tauIPrime) / Math.sqrt(1 + tauIPrime * tauIPrime)) * (1 + (1 - k.e * k.e) * tau * tau)) /
        ((1 - k.e * k.e) * Math.sqrt(1 + tau * tau));
      tau += delta;
      if (!(Math.abs(delta) > 1e-12 * Math.max(1, Math.abs(tau)))) {
        break;
      }
    }

    const latitude = (Math.atan(tau) * 180) / Math.PI;
    const longitude = (Math.atan2(sinhEtaPrime, cosXiPrime) * 180) / Math.PI + this.zone * 6 - 183;

    return Point.degrees(longitude, latitude);
  }

  /**
   * Convert to a MGRS coordinate
   *
   * @return MGRS
   */
  public toMGRS(): MGRS {
    return MGRS.from(this.toPoint());
  }

  /**
   * Format to a UTM string
   *
   * @return UTM string
   */
  public format(): string {
    let value = '';

    const formatter = new DecimalFormat('0.##');

    value += sprintf.sprintf('%02d', this.zone);
    value += ' ';
    value += this.hemisphere === Hemisphere.NORTH ? GridConstants.NORTH_CHAR : GridConstants.SOUTH_CHAR;
    value += ' ';
    value += formatter.format(this.easting);
    value += ' ';
    value += formatter.format(this.northing);

    return value.toString();
  }

  /**
   * {@inheritDoc}
   */
  public toString(): string {
    return this.format();
  }

  /**
   * Return whether the given string is valid UTM string
   *
   * @param utm
   *            potential UTM string
   * @return true if UTM string is valid, false otherwise
   */
  public static isUTM(utm: string): boolean {
    return this.utmPattern.test(utm);
  }

  /**
   * Parse a UTM value (Zone N|S Easting Northing)
   *
   * @param utm
   *            UTM value
   * @return UTM
   * @throws ParseException
   *             upon failure to parse UTM value
   */
  public static parse(utm: string): UTM {
    if (!this.utmPattern.test(utm)) {
      throw new Error('Invalid UTM: ' + utm);
    }

    const matches = utm.match(this.utmPattern);

    const zone = Number.parseInt(matches![1], 10);
    const hemisphere =
      matches![2].localeCompare(GridConstants.NORTH_CHAR, undefined, { sensitivity: 'base' }) === 0
        ? Hemisphere.NORTH
        : Hemisphere.SOUTH;
    const easting = +matches![3];
    const northing = +matches![4];

    return UTM.create(zone, hemisphere, easting, northing);
  }

  /**
   * Create from a coordinate, zone number, and hemisphere
   *
   * @param point
   *            coordinate
   * @param zone
   *            zone number
   * @param hemisphere
   *            hemisphere
   * @return UTM
   */
  public static from(point: Point, zone?: number, hemisphere?: Hemisphere): UTM {
    if (!zone) {
      zone = GridZones.getZoneNumberFromPoint(point);
    }
    if (!hemisphere) {
      hemisphere = HemisphereUtils.from(point);
    }

    point = point.toDegrees();

    const latitude = point.getLatitude();
    let lambda = point.getLongitude() - (zone * 6 - 183);
    if (lambda < -180 || lambda >= 180) {
      lambda = ((((lambda + 180) % 360) + 360) % 360) - 180;
    }

    // Karney (2011), "Transverse Mercator with an accuracy of a few
    // nanometers", eqs 7-14: Krueger series to order n^6
    const k = UTM.krueger();
    const phi = (latitude * Math.PI) / 180;
    const lam = (lambda * Math.PI) / 180;

    const tauPrime = UTM.conformalTau(Math.tan(phi), k.e);
    const cosLambda = Math.cos(lam);
    const xiPrime = Math.atan2(tauPrime, cosLambda);
    const etaPrime = Math.asinh(Math.sin(lam) / Math.sqrt(tauPrime * tauPrime + cosLambda * cosLambda));

    const [dXi, dEta] = UTM.kruegerSum(k.alpha, xiPrime, etaPrime);
    const xi = xiPrime + dXi;
    const eta = etaPrime + dEta;

    const easting = UTM.K0 * k.A * eta + 500000;
    let northing = UTM.K0 * k.A * xi;

    if (hemisphere === Hemisphere.SOUTH) {
      northing = northing + 10000000;
    }

    // Round to 1 micrometer so exact grid values survive a round trip
    // through latitude and longitude (floating point noise is ~1e-9 m)
    // before MGRS truncates them.
    return UTM.create(zone, hemisphere, UTM.roundMicrometer(easting), UTM.roundMicrometer(northing));
  }

  /**
   * Round a meter value to the nearest micrometer
   *
   * @param value
   *            meters
   * @return rounded meters
   */
  private static roundMicrometer(value: number): number {
    return Math.round(value * 1e6) / 1e6;
  }

  /**
   * UTM central meridian scale factor
   */
  private static readonly K0 = 0.9996;

  /**
   * Cached WGS84 Krueger series coefficients
   */
  private static kruegerCoefficients?: { e: number; A: number; alpha: number[]; beta: number[] };

  /**
   * WGS84 Krueger series coefficients, Karney (2011) eqs 14, 35 and 36
   *
   * @return eccentricity, rectifying radius and alpha, beta (one based)
   */
  private static krueger(): { e: number; A: number; alpha: number[]; beta: number[] } {
    if (!UTM.kruegerCoefficients) {
      const a = 6378137.0;
      const f = 1 / 298.257223563;
      const n = f / (2 - f);
      const n2 = n * n;
      const n3 = n * n2;
      const n4 = n * n3;
      const n5 = n * n4;
      const n6 = n * n5;
      UTM.kruegerCoefficients = {
        e: Math.sqrt(f * (2 - f)),
        A: (a / (1 + n)) * (1 + n2 / 4 + n4 / 64 + n6 / 256),
        alpha: [
          0,
          n / 2 - (2 / 3) * n2 + (5 / 16) * n3 + (41 / 180) * n4 - (127 / 288) * n5 + (7891 / 37800) * n6,
          (13 / 48) * n2 - (3 / 5) * n3 + (557 / 1440) * n4 + (281 / 630) * n5 - (1983433 / 1935360) * n6,
          (61 / 240) * n3 - (103 / 140) * n4 + (15061 / 26880) * n5 + (167603 / 181440) * n6,
          (49561 / 161280) * n4 - (179 / 168) * n5 + (6601661 / 7257600) * n6,
          (34729 / 80640) * n5 - (3418889 / 1995840) * n6,
          (212378941 / 319334400) * n6,
        ],
        beta: [
          0,
          n / 2 - (2 / 3) * n2 + (37 / 96) * n3 - (1 / 360) * n4 - (81 / 512) * n5 + (96199 / 604800) * n6,
          (1 / 48) * n2 + (1 / 15) * n3 - (437 / 1440) * n4 + (46 / 105) * n5 - (1118711 / 3870720) * n6,
          (17 / 480) * n3 - (37 / 840) * n4 - (209 / 4480) * n5 + (5569 / 90720) * n6,
          (4397 / 161280) * n4 - (11 / 504) * n5 - (830251 / 7257600) * n6,
          (4583 / 161280) * n5 - (108847 / 3991680) * n6,
          (20648693 / 638668800) * n6,
        ],
      };
    }
    return UTM.kruegerCoefficients;
  }

  /**
   * Sum of c[j] sin(2 j zeta) for j = 1..6, zeta = xi + i eta, by Clenshaw
   * summation (Karney 2011, section 8), so only one sin, cos, sinh and cosh
   * are evaluated
   *
   * @param c
   *            coefficients (one based)
   * @param xi
   *            real part
   * @param eta
   *            imaginary part
   * @return [sum of c[j] sin(2 j xi) cosh(2 j eta), sum of c[j] cos(2 j xi) sinh(2 j eta)]
   */
  private static kruegerSum(c: number[], xi: number, eta: number): [number, number] {
    const sin2 = Math.sin(2 * xi);
    const cos2 = Math.cos(2 * xi);
    const sinh2 = Math.sinh(2 * eta);
    const cosh2 = Math.cosh(2 * eta);
    // a = 2 cos(2 zeta)
    const ar = 2 * cos2 * cosh2;
    const ai = -2 * sin2 * sinh2;
    let y1r = 0;
    let y1i = 0;
    let y2r = 0;
    let y2i = 0;
    for (let j = c.length - 1; j >= 1; j--) {
      const y0r = ar * y1r - ai * y1i - y2r + c[j];
      const y0i = ar * y1i + ai * y1r - y2i;
      y2r = y1r;
      y2i = y1i;
      y1r = y0r;
      y1i = y0i;
    }
    // sum = y1 sin(2 zeta)
    const sr = sin2 * cosh2;
    const si = cos2 * sinh2;
    return [y1r * sr - y1i * si, y1r * si + y1i * sr];
  }

  /**
   * Tangent of the conformal latitude, Karney (2011) eqs 7 and 9
   *
   * @param tau
   *            tangent of the latitude
   * @param e
   *            eccentricity
   * @return tangent of the conformal latitude
   */
  private static conformalTau(tau: number, e: number): number {
    const sigma = Math.sinh(e * Math.atanh((e * tau) / Math.sqrt(1 + tau * tau)));
    return tau * Math.sqrt(1 + sigma * sigma) - sigma * Math.sqrt(1 + tau * tau);
  }
}
