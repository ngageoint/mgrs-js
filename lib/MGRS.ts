import { Hemisphere, Line, Point } from '@ngageoint/grid-js';
import { GridType } from './grid/GridType';
import * as sprintf from 'sprintf-js';
import { GridTypeUtils } from './grid/GridTypeUtils';
import { GridZone } from './gzd/GridZone';
import { UTM } from './utm/UTM';
import { GridZones } from './gzd/GridZones';
import { MGRSUtils } from './MGRSUtils';

/**
 * Military Grid Reference System Coordinate
 *
 * @author wnewman
 * @author osbornb
 */
export class MGRS {
  /**
   * 100km grid square column (‘e’) letters repeat every third zone
   */
  private static readonly columnLetters = ['ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ'];

  /**
   * 100km grid square row (‘n’) letters repeat every other zone
   */
  private static readonly rowLetters = ['ABCDEFGHJKLMNPQRSTUV', 'FGHJKLMNPQRSTUVABCDE'];

  /**
   * MGRS string pattern
   */
  private static readonly mgrsPattern = new RegExp(
    '^(\\d{1,2})([C-HJ-NP-X])(?:([A-HJ-NP-Z][A-HJ-NP-V])((\\d{2}){0,5}))?$',
    'i',
  );

  /**
   * MGRS invalid string pattern (Svalbard)
   */
  private static readonly mgrsInvalidPattern = new RegExp('^3[246]X.*$', 'i');

  /**
   * Zone number
   */
  private readonly zone: number;

  /**
   * Band letter
   */
  private readonly band: string;

  /**
   * Column letter
   */
  private readonly column: string;

  /**
   * Row letter
   */
  private readonly row: string;

  /**
   * Easting
   */
  private readonly easting: number;

  /**
   * Northing
   */
  private readonly northing: number;

  /**
   * Create
   *
   * @param zone
   *            zone number
   * @param band
   *            band letter
   * @param easting
   *            easting
   * @param northing
   *            northing
   * @return MGRS
   */
  public static create(
    zone: number,
    band: string,
    easting: number,
    northing: number,
    column?: string,
    row?: string,
  ): MGRS {
    if (!column) {
      column = this.getColumnLetter(zone, easting);
    }
    if (!row) {
      row = this.getRowLetter(zone, northing);
    }

    return new MGRS(zone, band, row, column, easting, northing);
  }

  /**
   * Constructor
   *
   * @param zone
   *            zone number
   * @param band
   *            band letter
   * @param column
   *            column letter
   * @param row
   *            row letter
   * @param easting
   *            easting
   * @param northing
   *            northing
   */
  constructor(zone: number, band: string, column: string, row: string, easting: number, northing: number) {
    this.zone = zone;
    this.band = band;
    this.column = column;
    this.row = row;
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
   * Get the band letter
   *
   * @return band letter
   */
  public getBand(): string {
    return this.band;
  }

  /**
   * Get the column letter
   *
   * @return column letter
   */
  public getColumn(): string {
    return this.column;
  }

  /**
   * Get the row letter
   *
   * @return row letter
   */
  public getRow(): string {
    return this.row;
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
   * Get the hemisphere
   *
   * @return hemisphere
   */
  public getHemisphere(): Hemisphere {
    return MGRSUtils.getHemisphere(this.band);
  }

  /**
   * Get the MGRS coordinate with specified grid precision
   *
   * @param type
   *            grid type precision
   * @return MGRS coordinate
   */
  public coordinate(type?: GridType): string {
    let mgrs = '';

    if (type) {
      mgrs += this.zone;
      mgrs += this.band;

      if (type.valueOf() !== GridType.GZD.valueOf()) {
        mgrs += this.column;
        mgrs += this.row;

        if (type !== GridType.HUNDRED_KILOMETER) {
          mgrs += this.getEastingAndNorthing(type);
        }
      }
    }

    return mgrs.toString();
  }

  /**
   * Get the easting and northing concatenated value in the grid type
   * precision
   *
   * @param type
   *            grid type precision
   * @return easting and northing value
   */
  public getEastingAndNorthing(type: GridType): string {
    const accuracy = 5 - ~~Math.log10(type);

    // TODO apply locale
    const easting = sprintf.sprintf('%05d', this.easting);
    const northing = sprintf.sprintf('%05d', this.northing);

    return easting.substring(0, accuracy) + northing.substring(0, accuracy);
  }

  /**
   * Get the MGRS coordinate with the accuracy number of digits in the easting
   * and northing values. Accuracy must be inclusively between 0
   * ({@link GridType#HUNDRED_KILOMETER}) and 5 ({@link GridType#METER}).
   *
   * @param accuracy
   *            accuracy digits between 0 (inclusive) and 5 (inclusive)
   * @return MGRS coordinate
   */
  public coordinateFromAccuracy(accuracy: number): string {
    return this.coordinate(GridTypeUtils.withAccuracy(accuracy));
  }

  /**
   * Get the MGRS coordinate grid precision
   *
   * @return grid type precision
   */
  public precision(): GridType {
    return GridTypeUtils.withAccuracy(this.accuracy());
  }

  /**
   * Get the MGRS coordinate accuracy number of digits
   *
   * @return accuracy digits
   */
  public accuracy(): number {
    let accuracy = 5;

    for (let accuracyLevel = 10; accuracyLevel <= 100000; accuracyLevel *= 10) {
      if (this.easting % accuracyLevel !== 0 || this.northing % accuracyLevel !== 0) {
        break;
      }
      accuracy--;
    }

    return accuracy;
  }

  /**
   * Get the two letter column and row 100k designator
   *
   * @return the two letter column and row 100k designator
   */
  public getColumnRowId(): string {
    return this.column + this.row;
  }

  /**
   * Get the GZD grid zone
   *
   * @return GZD grid zone
   */
  public getGridZone(): GridZone {
    return GridZones.getGridZoneFromMGRS(this);
  }

  /**
   * Convert to a point
   *
   * @return point
   */
  public toPoint(): Point {
    return this.toUTM().toPoint();
  }

  /**
   * Convert to UTM coordinate
   *
   * @return UTM
   */
  public toUTM(): UTM {
    const easting = this.getUTMEasting();
    const northing = this.getUTMNorthing();
    const hemisphere = this.getHemisphere();

    return UTM.create(this.zone, hemisphere, easting, northing);
  }

  /**
   * Get the UTM easting
   *
   * @return UTM easting
   */
  public getUTMEasting(): number {
    // get easting specified by e100k
    const columnLetters = MGRS.getColumnLetters(this.zone);
    const columnIndex = columnLetters.indexOf(this.column) + 1;
    // index+1 since A (index 0) -> 1*100e3, B (index 1) -> 2*100e3, etc.
    const e100kNum = columnIndex * 100000.0; // e100k in meters

    return e100kNum + this.easting;
  }

  /**
   * Get the UTM northing
   *
   * @return UTM northing
   */
  public getUTMNorthing(): number {
    // get northing specified by n100k
    const rowLetters = MGRS.getRowLetters(this.zone);
    const rowIndex = rowLetters.indexOf(this.row);
    const n100kNum = rowIndex * 100000.0; // n100k in meters

    // get latitude of (bottom of) band
    const latBand = GridZones.getSouthLatitude(this.band);

    // northing of bottom of band, extended to include entirety of
    // bottommost 100km square
    // (100km square boundaries are aligned with 100km UTM northing
    // intervals)

    const latBandNorthing = UTM.from(Point.degrees(0, latBand)).getNorthing();
    const nBand = Math.floor(latBandNorthing / 100000) * 100000;

    // 100km grid square row letters repeat every 2,000km north; add enough
    // 2,000km blocks to get
    // into required band
    let n2M = 0; // northing of 2,000km block
    while (n2M + n100kNum + this.northing < nBand) {
      n2M += 2000000;
    }

    return n2M + n100kNum + this.northing;
  }

  /**
   * {@inheritDoc}
   */
  public toString(): string {
    return this.coordinate();
  }

  /**
   * Return whether the given string is valid MGRS string
   *
   * @param mgrs
   *            potential MGRS string
   * @return true if MGRS string is valid, false otherwise
   */
  public static isMGRS(mgrs: string): boolean {
    mgrs = MGRS.removeSpaces(mgrs);
    return MGRS.mgrsPattern.test(mgrs) && !MGRS.mgrsInvalidPattern.test(mgrs);
  }

  /**
   * Removed spaces from the value
   *
   * @param value
   *            value string
   * @return value without spaces
   */
  private static removeSpaces(value: string): string {
    return value.replace('\\s', '');
  }

  /**
   * Encodes a point as a MGRS string
   *
   * @param point
   *            point
   * @return MGRS
   */
  public static from(point: Point): MGRS {
    point = point.toDegrees();

    const utm = UTM.from(point);

    const bandLetter = GridZones.getBandLetterFromLatitude(point.getLatitude());

    const columnLetter = MGRS.getColumnLetterFromUTM(utm);

    const rowLetter = MGRS.getRowLetterFromUTM(utm);

    // truncate easting/northing to within 100km grid square
    const easting = utm.getEasting() % 100000;
    const northing = utm.getNorthing() % 100000;

    return MGRS.create(utm.getZone(), bandLetter, easting, northing, columnLetter, rowLetter);
  }

  /**
   * Parse a MGRS string
   *
   * @param mgrs
   *            MGRS string
   * @return MGRS
   * @throws ParseException
   *             upon failure to parse the MGRS string
   */
  public static parse(mgrs: string): MGRS {
    if (!MGRS.mgrsPattern.test(MGRS.removeSpaces(mgrs))) {
      throw new Error('Invalid MGRS: ' + mgrs);
    }

    const matches = MGRS.removeSpaces(mgrs).match(MGRS.mgrsPattern);

    const zone = Number.parseInt(matches![1], 10);
    const band = matches![2].toUpperCase().charAt(0);

    const gridZone = GridZones.getGridZone(zone, band);
    if (gridZone == null) {
      throw new Error('Invalid MGRS: ' + mgrs);
    }

    let mgrsValue: MGRS | undefined;

    let columnRow = matches![3];
    if (columnRow) {
      columnRow = columnRow.toUpperCase();
      const column = columnRow.charAt(0);
      const row = columnRow.charAt(1);

      // parse easting & northing
      let easting = 0;
      let northing = 0;
      const location = matches![4];
      if (location.length > 0) {
        const precision = location.length / 2;
        const multiplier = Math.pow(10.0, 5 - precision);
        easting = +location.substring(0, precision) * multiplier;
        northing = +location.substring(precision) * multiplier;
      }

      mgrsValue = MGRS.create(zone, band, easting, northing, column, row);

      if (location.length === 0) {
        const point = mgrsValue.toPoint().toDegrees();
        const gridBounds = gridZone.getBounds();
        const gridSouthwest = gridBounds.getSouthwest().toDegrees();

        const westBounds = point.getLongitude() < gridSouthwest.getLongitude();
        const southBounds = point.getLatitude() < gridSouthwest.getLatitude();

        if (westBounds || southBounds) {
          if (westBounds && southBounds) {
            const northeast = MGRS.create(
              zone,
              band,
              GridType.HUNDRED_KILOMETER,
              GridType.HUNDRED_KILOMETER,
              column,
              row,
            ).toPoint();
            if (gridBounds.containsPoint(northeast)) {
              mgrsValue = MGRS.from(Point.degrees(gridSouthwest.getLongitude(), gridSouthwest.getLatitude()));
            }
          } else if (westBounds) {
            const east = MGRS.create(zone, band, GridType.HUNDRED_KILOMETER, northing, column, row).toPoint();
            if (gridBounds.containsPoint(east)) {
              const intersection = MGRS.getWesternBoundsPoint(gridZone, point, east);
              mgrsValue = MGRS.from(intersection);
            }
          } else if (southBounds) {
            const north = MGRS.create(zone, band, easting, GridType.HUNDRED_KILOMETER, column, row).toPoint();
            if (gridBounds.containsPoint(north)) {
              const intersection = MGRS.getSouthernBoundsPoint(gridZone, point, north);
              mgrsValue = MGRS.from(intersection);
            }
          }
        }
      }
    } else {
      mgrsValue = MGRS.from(gridZone.getBounds().getSouthwest());
    }

    return mgrsValue;
  }

  /**
   * Get the point on the western grid zone bounds point between the western
   * and eastern points
   *
   * @param gridZone
   *            grid zone
   * @param west
   *            western point
   * @param east
   *            eastern point
   * @return western grid bounds point
   */
  private static getWesternBoundsPoint(gridZone: GridZone, west: Point, east: Point): Point {
    const eastUTM = UTM.from(east);
    const northing = eastUTM.getNorthing();

    const zoneNumber = gridZone.getNumber();
    const hemisphere = gridZone.getHemisphere();

    const line = Line.line(west, east);
    const boundsLine = gridZone.getBounds().getWestLine();

    const intersection = line.intersection(boundsLine);

    // Intersection easting
    const intersectionUTM = UTM.from(intersection!, zoneNumber, hemisphere);
    const intersectionEasting = intersectionUTM.getEasting();

    // One meter precision just inside the bounds
    const boundsEasting = Math.ceil(intersectionEasting);

    // Higher precision point just inside of the bounds
    const boundsPoint = UTM.point(zoneNumber, hemisphere, boundsEasting, northing);

    boundsPoint.setLongitude(boundsLine.getPoint1().getLongitude());

    return boundsPoint;
  }

  /**
   * Get the point on the southern grid zone bounds point between the southern
   * and northern points
   *
   * @param gridZone
   *            grid zone
   * @param south
   *            southern point
   * @param north
   *            northern point
   * @return southern grid bounds point
   */
  private static getSouthernBoundsPoint(gridZone: GridZone, south: Point, north: Point): Point {
    const northUTM = UTM.from(north);
    const easting = northUTM.getEasting();

    const zoneNumber = gridZone.getNumber();
    const hemisphere = gridZone.getHemisphere();

    const line = Line.line(south, north);
    const boundsLine = gridZone.getBounds().getSouthLine();

    const intersection = line.intersection(boundsLine);

    // Intersection northing
    const intersectionUTM = UTM.from(intersection!, zoneNumber, hemisphere);
    const intersectionNorthing = intersectionUTM.getNorthing();

    // One meter precision just inside the bounds
    const boundsNorthing = Math.ceil(intersectionNorthing);

    // Higher precision point just inside of the bounds
    const boundsPoint = UTM.point(zoneNumber, hemisphere, easting, boundsNorthing);

    boundsPoint.setLatitude(boundsLine.getPoint1().getLatitude());

    return boundsPoint;
  }

  /**
   * Parse the MGRS string for the precision
   *
   * @param mgrs
   *            MGRS string
   * @return grid type precision
   * @throws ParseException
   *             upon failure to parse the MGRS string
   */
  public static precision(mgrs: string): GridType {
    if (!MGRS.mgrsPattern.test(MGRS.removeSpaces(mgrs))) {
      throw new Error('Invalid MGRS: ' + mgrs);
    }

    const matches = MGRS.removeSpaces(mgrs).match(MGRS.mgrsPattern);

    let precision: GridType | undefined;

    if (matches![3]) {
      const location = matches![4];
      if (location.length > 0) {
        precision = GridTypeUtils.withAccuracy(location.length / 2);
      } else {
        precision = GridType.HUNDRED_KILOMETER;
      }
    } else {
      precision = GridType.GZD;
    }

    return precision;
  }

  /**
   * Get the MGRS coordinate accuracy number of digits
   *
   * @param mgrs
   *            MGRS string
   * @return accuracy digits
   * @throws ParseException
   *             upon failure to parse the MGRS string
   */
  public static accuracy(mgrs: string): number {
    return GridTypeUtils.getAccuracy(MGRS.precision(mgrs));
  }

  /**
   * Get the two letter column and row 100k designator for a given UTM
   * easting, northing and zone number value
   *
   * @param easting
   *            easting
   * @param northing
   *            northing
   * @param zoneNumber
   *            zone number
   * @return the two letter column and row 100k designator
   */
  public static getColumnRowId(easting: number, northing: number, zoneNumber: number): string {
    const columnLetter = MGRS.getColumnLetter(zoneNumber, easting);

    const rowLetter = MGRS.getRowLetter(zoneNumber, northing);

    return columnLetter + rowLetter;
  }

  /**
   * Get the column letter from the UTM
   *
   * @param utm
   *            UTM
   * @return column letter
   */
  public static getColumnLetterFromUTM(utm: UTM): string {
    return MGRS.getColumnLetter(utm.getZone(), utm.getEasting());
  }

  /**
   * Get the column letter from the zone number and easting
   *
   * @param zoneNumber
   *            zone number
   * @param easting
   *            easting
   * @return column letter
   */
  public static getColumnLetter(zoneNumber: number, easting: number): string {
    // columns in zone 1 are A-H, zone 2 J-R, zone 3 S-Z, then repeating
    // every 3rd zone
    const column = ~~Math.floor(easting / 100000);
    const columnLetters = MGRS.getColumnLetters(zoneNumber);
    return columnLetters.charAt(column - 1);
  }

  /**
   * Get the row letter from the UTM
   *
   * @param utm
   *            UTM
   * @return row letter
   */
  public static getRowLetterFromUTM(utm: UTM): string {
    return MGRS.getRowLetter(utm.getZone(), utm.getNorthing());
  }

  /**
   * Get the row letter from the zone number and northing
   *
   * @param zoneNumber
   *            zone number
   * @param northing
   *            northing
   * @return row letter
   */
  public static getRowLetter(zoneNumber: number, northing: number): string {
    // rows in even zones are A-V, in odd zones are F-E
    const row = ~~Math.floor(northing / 100000) % 20;
    const rowLetters = MGRS.getRowLetters(zoneNumber);
    return rowLetters.charAt(row);
  }

  /**
   * Get the column letters for the zone number
   *
   * @param zoneNumber
   *            zone number
   * @return column letters
   */
  private static getColumnLetters(zoneNumber: number): string {
    return MGRS.columnLetters[(zoneNumber - 1) % 3];
  }

  /**
   * Get the row letters for the zone number
   *
   * @param zoneNumber
   *            zone number
   * @return row letters
   */
  private static getRowLetters(zoneNumber: number): string {
    return MGRS.rowLetters[(zoneNumber - 1) % 2];
  }
}
