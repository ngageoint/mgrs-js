import { Point } from '@ngageoint/grid-js';

/**
 * Universal Polar Stereographic (UPS) on WGS84, used by MGRS north of 84 N
 * and south of 80 S (bands Y and Z in the north, A and B in the south).
 *
 * Polar stereographic with scale 0.994 at the pole and a false easting and
 * northing of 2,000,000 m (NGA.STND.0037). The forward and inverse use the
 * conformal latitude as in Karney (2011), "Transverse Mercator with an
 * accuracy of a few nanometers", so they agree to well below a millimeter.
 */
export class UPS {
  /**
   * Scale at the pole
   */
  public static readonly K0 = 0.994;

  /**
   * False easting and northing (meters)
   */
  public static readonly FALSE_EASTING_NORTHING = 2000000;

  /**
   * MGRS UPS band letters
   */
  public static readonly BAND_LETTERS = 'ABYZ';

  /**
   * 100km column letters for bands A, B, Y and Z
   */
  private static readonly columnLetters = ['JKLPQRSTUXYZ', 'ABCFGHJKLPQR', 'RSTUXYZ', 'ABCFGHJ'];

  /**
   * 100km row letters for the south (A, B) and north (Y, Z)
   */
  private static readonly rowLetters = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'ABCDEFGHJKLMNP'];

  /**
   * First 100km column index (easting / 100km) of bands A, B, Y and Z
   */
  private static readonly columnStart = [8, 20, 13, 20];

  /**
   * First 100km row index (northing / 100km) in the south and north
   */
  private static readonly rowStart = [8, 13];

  private static readonly a = 6378137.0;
  private static readonly f = 1 / 298.257223563;
  private static readonly e = Math.sqrt(UPS.f * (2 - UPS.f));
  private static readonly c = Math.sqrt(Math.pow(1 + UPS.e, 1 + UPS.e) * Math.pow(1 - UPS.e, 1 - UPS.e));

  /**
   * Check if a latitude is covered by UPS in MGRS (at or north of 84 N, or
   * south of 80 S)
   *
   * @param latitude
   *            latitude in degrees
   * @return true if UPS
   */
  public static isPolar(latitude: number): boolean {
    return latitude >= 84 || latitude < -80;
  }

  /**
   * Check if a band letter is a UPS band (A, B, Y or Z)
   *
   * @param band
   *            band letter
   * @return true if UPS
   */
  public static isBand(band: string): boolean {
    return band.length === 1 && UPS.BAND_LETTERS.indexOf(band.toUpperCase()) >= 0;
  }

  /**
   * Convert latitude and longitude to UPS easting and northing
   *
   * @param latitude
   *            latitude in degrees
   * @param longitude
   *            longitude in degrees
   * @return [easting, northing, north]
   */
  public static forward(latitude: number, longitude: number): [number, number, boolean] {
    const north = latitude >= 0;
    const phi = (Math.abs(latitude) * Math.PI) / 180;
    const lam = (longitude * Math.PI) / 180;
    // tangent of the conformal colatitude over 2, from the conformal latitude
    const tau = Math.tan(phi);
    const tauPrime = UPS.conformalTau(tau);
    // t = tan(pi/4 - chi/2) = sqrt(1 + tau'^2) - tau', written to avoid cancellation
    const t = Number.isFinite(tauPrime) ? 1 / (Math.sqrt(1 + tauPrime * tauPrime) + tauPrime) : 0;
    const rho = (2 * UPS.a * UPS.K0 * t) / UPS.c;
    const easting = UPS.FALSE_EASTING_NORTHING + rho * Math.sin(lam);
    const northing = north
      ? UPS.FALSE_EASTING_NORTHING - rho * Math.cos(lam)
      : UPS.FALSE_EASTING_NORTHING + rho * Math.cos(lam);
    return [easting, northing, north];
  }

  /**
   * Convert UPS easting and northing to a point
   *
   * @param north
   *            true for the north polar region
   * @param easting
   *            easting in meters
   * @param northing
   *            northing in meters
   * @return point in degrees
   */
  public static inverse(north: boolean, easting: number, northing: number): Point {
    const x = easting - UPS.FALSE_EASTING_NORTHING;
    const y = north ? UPS.FALSE_EASTING_NORTHING - northing : northing - UPS.FALSE_EASTING_NORTHING;
    const rho = Math.hypot(x, y);
    const t = (rho * UPS.c) / (2 * UPS.a * UPS.K0);
    // tau' = tan(chi) = (1 - t^2) / (2 t)
    const tauPrime = rho > 0 ? (1 - t * t) / (2 * t) : Infinity;
    const tau = UPS.tauFromConformal(tauPrime);
    let latitude = rho > 0 ? (Math.atan(tau) * 180) / Math.PI : 90;
    const longitude = rho > 0 ? (Math.atan2(x, y) * 180) / Math.PI : 0;
    if (!north) {
      latitude = -latitude;
    }
    return Point.degrees(longitude, latitude);
  }

  /**
   * Get the MGRS band, 100km column and row letters and the easting and
   * northing within the 100km square (truncated to meters)
   *
   * @param latitude
   *            latitude in degrees
   * @param longitude
   *            longitude in degrees
   * @return [band, column, row, easting, northing]
   */
  public static toMGRS(latitude: number, longitude: number): [string, string, string, number, number] {
    const [x, y, north] = UPS.forward(latitude, longitude);
    // round to 1 micrometer so exact grid values survive a round trip
    const easting = Math.round(x * 1e6) / 1e6;
    const northing = Math.round(y * 1e6) / 1e6;
    const east = easting >= UPS.FALSE_EASTING_NORTHING;
    const bandIndex = (north ? 2 : 0) + (east ? 1 : 0);
    const columnIndex = Math.floor(easting / 100000);
    const rowIndex = Math.floor(northing / 100000);
    const columns = UPS.columnLetters[bandIndex];
    const rows = UPS.rowLetters[north ? 1 : 0];
    const column = columns.charAt(Math.max(0, Math.min(columns.length - 1, columnIndex - UPS.columnStart[bandIndex])));
    const row = rows.charAt(Math.max(0, Math.min(rows.length - 1, rowIndex - UPS.rowStart[north ? 1 : 0])));
    return [
      UPS.BAND_LETTERS.charAt(bandIndex),
      column,
      row,
      Math.floor(easting - columnIndex * 100000),
      Math.floor(northing - rowIndex * 100000),
    ];
  }

  /**
   * Check the 100km column and row letters are used in the UPS band
   *
   * @param band
   *            band letter (A, B, Y or Z)
   * @param column
   *            column letter
   * @param row
   *            row letter
   * @return true if valid
   */
  public static isColumnRow(band: string, column: string, row: string): boolean {
    const bandIndex = UPS.BAND_LETTERS.indexOf(band);
    if (bandIndex < 0) {
      return false;
    }
    return (
      UPS.columnLetters[bandIndex].indexOf(column) >= 0 && UPS.rowLetters[bandIndex >= 2 ? 1 : 0].indexOf(row) >= 0
    );
  }

  /**
   * Get the point at the south west corner of a MGRS UPS location
   *
   * @param band
   *            band letter (A, B, Y or Z)
   * @param column
   *            column letter
   * @param row
   *            row letter
   * @param easting
   *            easting within the 100km square
   * @param northing
   *            northing within the 100km square
   * @return point in degrees
   */
  public static toPoint(band: string, column: string, row: string, easting: number, northing: number): Point {
    const bandIndex = UPS.BAND_LETTERS.indexOf(band);
    const north = bandIndex >= 2;
    const columnIndex = UPS.columnLetters[bandIndex].indexOf(column) + UPS.columnStart[bandIndex];
    const rowIndex = UPS.rowLetters[north ? 1 : 0].indexOf(row) + UPS.rowStart[north ? 1 : 0];
    return UPS.inverse(north, columnIndex * 100000 + easting, rowIndex * 100000 + northing);
  }

  /**
   * Tangent of the conformal latitude, Karney (2011) eqs 7 and 9
   */
  private static conformalTau(tau: number): number {
    if (!Number.isFinite(tau)) {
      return tau;
    }
    const sigma = Math.sinh(UPS.e * Math.atanh((UPS.e * tau) / Math.sqrt(1 + tau * tau)));
    return tau * Math.sqrt(1 + sigma * sigma) - sigma * Math.sqrt(1 + tau * tau);
  }

  /**
   * Tangent of the latitude from the tangent of the conformal latitude
   * (Newton iteration, Karney 2011 eqs 19-21)
   */
  private static tauFromConformal(tauPrime: number): number {
    if (!Number.isFinite(tauPrime)) {
      return tauPrime;
    }
    const e2 = UPS.e * UPS.e;
    let tau = tauPrime / (1 - e2);
    for (let i = 0; i < 10; i++) {
      const tauI = UPS.conformalTau(tau);
      const delta =
        (((tauPrime - tauI) / Math.sqrt(1 + tauI * tauI)) * (1 + (1 - e2) * tau * tau)) /
        ((1 - e2) * Math.sqrt(1 + tau * tau));
      tau += delta;
      if (!(Math.abs(delta) > 1e-12 * Math.max(1, Math.abs(tau)))) {
        break;
      }
    }
    return tau;
  }
}
