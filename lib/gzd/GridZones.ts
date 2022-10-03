import { Bounds, Point } from '@ngageoint/grid-js';
import { MGRS } from '../MGRS';
import { MGRSConstants } from '../MGRSConstants';
import { MGRSUtils } from '../MGRSUtils';
import { BandLetterRange } from './BandLetterRange';
import { GridRange } from './GridRange';
import { GridZone } from './GridZone';
import { LatitudeBand } from './LatitudeBand';
import { LongitudinalStrip } from './LongitudinalStrip';
import { ZoneNumberRange } from './ZoneNumberRange';

/**
 * Grid Zones, Longitudinal Strips, and Latitude Bands
 *
 * @author wnewman
 * @author osbornb
 */
export class GridZones {
  /**
   * Longitudinal Strips
   */
  public static readonly strips = new Map<number, LongitudinalStrip>();

  /**
   * Latitude Bands
   */
  public static readonly bands = new Map<string, LatitudeBand>();

  /**
   * Grid Zones
   */
  public static readonly gridZones = new Map<number, Map<string, GridZone>>();

  static {
    // Create longitudinal strips
    const numberRange = new ZoneNumberRange();
    for (const zoneNumber of numberRange) {
      const longitude = MGRSConstants.MIN_LON + (zoneNumber - 1) * MGRSConstants.ZONE_WIDTH;
      const strip = new LongitudinalStrip(zoneNumber, longitude, longitude + MGRSConstants.ZONE_WIDTH);
      this.strips.set(strip.getNumber(), strip);
    }

    // Create latitude bands
    let latitude = MGRSConstants.MIN_LAT;
    const letterRange = new BandLetterRange();
    for (const bandLetter of letterRange) {
      const min = latitude;
      if (bandLetter === MGRSConstants.MAX_BAND_LETTER) {
        latitude += MGRSConstants.MAX_BAND_HEIGHT;
      } else {
        latitude += MGRSConstants.BAND_HEIGHT;
      }
      this.bands.set(bandLetter, new LatitudeBand(bandLetter, min, latitude));
    }

    // Create grid zones
    for (const strip of GridZones.strips.values()) {
      const zoneNumber = strip.getNumber();

      const stripGridZones = new Map<string, GridZone>();
      for (const band of GridZones.bands.values()) {
        const bandLetter = band.getLetter();

        let gridZoneStrip = strip;

        if (this.isSvalbard(zoneNumber, bandLetter)) {
          gridZoneStrip = this.getSvalbardStrip(strip)!;
        } else if (this.isNorway(zoneNumber, bandLetter)) {
          gridZoneStrip = this.getNorwayStrip(strip);
        }

        if (gridZoneStrip) {
          stripGridZones.set(bandLetter, new GridZone(gridZoneStrip, band));
        }
      }
      this.gridZones.set(zoneNumber, stripGridZones);
    }
  }

  /**
   * Get the longitudinal strip by zone number
   *
   * @param zoneNumber
   *            zone number
   * @return longitudinal strip
   */
  public static getLongitudinalStrip(zoneNumber: number): LongitudinalStrip {
    MGRSUtils.validateZoneNumber(zoneNumber);
    return this.strips.get(zoneNumber)!;
  }

  /**
   * Get the west longitude in degrees of the zone number
   *
   * @param zoneNumber
   *            zone number
   * @return longitude in degrees
   */
  public static getWestLongitude(zoneNumber: number): number {
    return this.getLongitudinalStrip(zoneNumber).getWest();
  }

  /**
   * Get the east longitude in degrees of the zone number
   *
   * @param zoneNumber
   *            zone number
   * @return longitude in degrees
   */
  public static getEastLongitude(zoneNumber: number): number {
    return this.getLongitudinalStrip(zoneNumber).getEast();
  }

  /**
   * Get the latitude band by band letter
   *
   * @param bandLetter
   *            band letter
   * @return latitude band
   */
  public static getLatitudeBand(bandLetter: string): LatitudeBand {
    MGRSUtils.validateBandLetter(bandLetter);
    return this.bands.get(bandLetter)!;
  }

  /**
   * Get the south latitude in degrees of the band letter
   *
   * @param bandLetter
   *            band letter
   * @return latitude in degrees
   */
  public static getSouthLatitude(bandLetter: string): number {
    return this.getLatitudeBand(bandLetter).getSouth();
  }

  /**
   * Get the north latitude in degrees of the band letter
   *
   * @param bandLetter
   *            band letter
   * @return latitude in degrees
   */
  public static getNorthLatitude(bandLetter: string): number {
    return this.getLatitudeBand(bandLetter).getNorth();
  }

  /**
   * Get the zones within the bounds
   *
   * @param bounds
   *            bounds
   * @return grid zones
   */
  public static getZones(bounds: Bounds): GridZone[] {
    const zones: GridZone[] = [];

    const gridRange = this.getGridRange(bounds);
    for (const zone of gridRange) {
      zones.push(zone);
    }

    return zones;
  }

  /**
   * Get the grid zone by zone number and band letter
   *
   * @param zoneNumber
   *            zone number
   * @param bandLetter
   *            band letter
   * @return grid zone
   */
  public static getGridZone(zoneNumber: number, bandLetter: string): GridZone {
    MGRSUtils.validateZoneNumber(zoneNumber);
    MGRSUtils.validateBandLetter(bandLetter);
    return this.gridZones.get(zoneNumber)!.get(bandLetter)!;
  }

  /**
   * Get the grid zone by MGRS
   *
   * @param mgrs
   *            mgrs coordinate
   * @return grid zone
   */
  public static getGridZoneFromMGRS(mgrs: MGRS): GridZone {
    return this.getGridZone(mgrs.getZone(), mgrs.getBand());
  }

  /**
   * Get a grid range from the bounds
   *
   * @param bounds
   *            bounds
   * @return grid range
   */
  public static getGridRange(bounds: Bounds): GridRange {
    bounds = bounds.toDegrees();
    const zoneNumberRange = this.getZoneNumberRangeFromBounds(bounds);
    const bandLetterRange = this.getBandLetterRangeFromBounds(bounds);
    return new GridRange(zoneNumberRange, bandLetterRange);
  }

  /**
   * Get a zone number range between the western and eastern bounds
   *
   * @param bounds
   *            bounds
   * @return zone number range
   */
  public static getZoneNumberRangeFromBounds(bounds: Bounds): ZoneNumberRange {
    bounds = bounds.toDegrees();
    return this.getZoneNumberRange(bounds.getWest(), bounds.getEast());
  }

  /**
   * Get a zone number range between the western and eastern longitudes
   *
   * @param west
   *            western longitude in degrees
   * @param east
   *            eastern longitude in degrees
   * @return zone number range
   */
  public static getZoneNumberRange(west: number, east: number): ZoneNumberRange {
    const westZone = this.getZoneNumberFromLongitude(west, false);
    const eastZone = this.getZoneNumberFromLongitude(east, true);
    return new ZoneNumberRange(westZone, eastZone);
  }

  /**
   * Get the zone number of the point
   *
   * @param point
   *            point
   * @return zone number
   */
  public static getZoneNumberFromPoint(point: Point): number {
    point = point.toDegrees();
    return this.getZoneNumber(point.getLongitude(), point.getLatitude());
  }

  /**
   * Get the zone number of the longitude and latitude
   *
   * @param longitude
   *            longitude
   * @param latitude
   *            latitude
   * @return zone number
   */
  public static getZoneNumber(longitude: number, latitude: number): number {
    let zoneNumber = this.getZoneNumberFromLongitude(longitude);
    const svalbardZone = this.isSvalbardZone(zoneNumber);
    const norwayZone = this.isNorwayZone(zoneNumber);
    if (svalbardZone || norwayZone) {
      const bandLetter = this.getBandLetterFromLatitude(latitude);
      if (svalbardZone && this.isSvalbardLetter(bandLetter)) {
        zoneNumber = this.getSvalbardZone(longitude);
      } else if (norwayZone && this.isNorwayLetter(bandLetter)) {
        zoneNumber = this.getNorwayZone(longitude);
      }
    }
    return zoneNumber;
  }

  /**
   * Get the zone number of the longitude (degrees between
   * {@link MGRSConstants#MIN_LON} and {@link MGRSConstants#MAX_LON})
   *
   * @param longitude
   *            longitude in degrees
   * @param eastern
   *            true for eastern number on edges, false for western
   * @return zone number
   */
  public static getZoneNumberFromLongitude(longitude: number, eastern = true): number {
    // Normalize the longitude if needed
    if (longitude < MGRSConstants.MIN_LON || longitude > MGRSConstants.MAX_LON) {
      longitude = ((longitude - MGRSConstants.MIN_LON) % (2 * MGRSConstants.MAX_LON)) + MGRSConstants.MIN_LON;
    }

    // Determine the zone
    const zoneValue = (longitude - MGRSConstants.MIN_LON) / MGRSConstants.ZONE_WIDTH;
    let zoneNumber = 1 + ~~zoneValue;

    // Handle western edge cases and 180.0
    if (!eastern) {
      if (zoneNumber > 1 && zoneValue % 1.0 === 0.0) {
        zoneNumber--;
      }
    } else if (zoneNumber > MGRSConstants.MAX_ZONE_NUMBER) {
      zoneNumber--;
    }

    return zoneNumber;
  }

  /**
   * Get a band letter range between the southern and northern bounds
   *
   * @param bounds
   *            bounds
   * @return band letter range
   */
  public static getBandLetterRangeFromBounds(bounds: Bounds): BandLetterRange {
    bounds = bounds.toDegrees();
    return this.getBandLetterRange(bounds.getSouth(), bounds.getNorth());
  }

  /**
   * Get a band letter range between the southern and northern latitudes in
   * degrees
   *
   * @param south
   *            southern latitude in degrees
   * @param north
   *            northern latitude in degrees
   * @return band letter range
   */
  public static getBandLetterRange(south: number, north: number): BandLetterRange {
    const southLetter = this.getBandLetterFromLatitude(south, false);
    const northLetter = this.getBandLetterFromLatitude(north, true);
    return new BandLetterRange(southLetter, northLetter);
  }

  /**
   * Get the band letter of the latitude (degrees between
   * {@link MGRSConstants#MIN_LAT} and {@link MGRSConstants#MAX_LAT})
   *
   * @param latitude
   *            latitude in degrees
   * @param northern
   *            true for northern band on edges, false for southern
   * @return band letter
   */
  public static getBandLetterFromLatitude(latitude: number, northern = true): string {
    // Bound the latitude if needed
    if (latitude < MGRSConstants.MIN_LAT) {
      latitude = MGRSConstants.MIN_LAT;
    } else if (latitude > MGRSConstants.MAX_LAT) {
      latitude = MGRSConstants.MAX_LAT;
    }

    const bandValue = (latitude - MGRSConstants.MIN_LAT) / MGRSConstants.BAND_HEIGHT;
    let bands = ~~bandValue;

    // Handle 80.0 to 84.0 and southern edge cases
    if (bands >= MGRSConstants.NUM_BANDS) {
      bands--;
    } else if (!northern && bands > 0 && bandValue % 1.0 === 0.0) {
      bands--;
    }

    // Handle skipped 'I' and 'O' letters
    if (bands > 10) {
      bands += 2;
    } else if (bands > 5) {
      bands++;
    }

    let letter = MGRSConstants.MIN_BAND_LETTER.codePointAt(0);
    if (letter) {
      letter += bands;
    }
    return String.fromCharCode(letter!);
  }

  /**
   * Is the zone number and band letter a Svalbard GZD (31X - 37X)
   *
   * @param zoneNumber
   *            zone number
   * @param bandLetter
   *            band letter
   * @return true if a Svalbard GZD
   */
  public static isSvalbard(zoneNumber: number, bandLetter: string): boolean {
    return this.isSvalbardLetter(bandLetter) && this.isSvalbardZone(zoneNumber);
  }

  /**
   * Is the band letter a Svalbard GZD (X)
   *
   * @param bandLetter
   *            band letter
   * @return true if a Svalbard GZD
   */
  public static isSvalbardLetter(bandLetter: string): boolean {
    return bandLetter === MGRSConstants.SVALBARD_BAND_LETTER;
  }

  /**
   * Is the zone number a Svalbard GZD (31 - 37)
   *
   * @param zoneNumber
   *            zone number
   * @return true if a Svalbard GZD
   */
  public static isSvalbardZone(zoneNumber: number): boolean {
    return zoneNumber >= MGRSConstants.MIN_SVALBARD_ZONE_NUMBER && zoneNumber <= MGRSConstants.MAX_SVALBARD_ZONE_NUMBER;
  }

  /**
   * Get the Svalbard longitudinal strip from the strip
   *
   * @param strip
   *            longitudinal strip
   * @return Svalbard strip or null for empty strips
   */
  private static getSvalbardStrip(strip: LongitudinalStrip): LongitudinalStrip | undefined {
    let svalbardStrip: LongitudinalStrip | undefined;

    const stripNumber = strip.getNumber();
    if (stripNumber % 2 === 1) {
      let west = strip.getWest();
      let east = strip.getEast();
      const halfWidth = (east - west) / 2.0;
      if (stripNumber > 31) {
        west -= halfWidth;
      }
      if (stripNumber < 37) {
        east += halfWidth;
      }
      svalbardStrip = new LongitudinalStrip(stripNumber, west, east);
    }

    return svalbardStrip;
  }

  /**
   * Get the Svalbard zone number from the longitude
   *
   * @param longitude
   *            longitude
   * @return zone number
   */
  private static getSvalbardZone(longitude: number): number {
    const minimumLongitude = this.getWestLongitude(MGRSConstants.MIN_SVALBARD_ZONE_NUMBER);
    const zoneValue =
      MGRSConstants.MIN_SVALBARD_ZONE_NUMBER + (longitude - minimumLongitude) / MGRSConstants.ZONE_WIDTH;
    let zone = ~~Math.round(zoneValue);
    if (zone % 2 === 0) {
      zone--;
    }
    return zone;
  }

  /**
   * Is the zone number and band letter a Norway GZD (31V or 32V)
   *
   * @param zoneNumber
   *            zone number
   * @param bandLetter
   *            band letter
   * @return true if a Norway GZD
   */
  private static isNorway(zoneNumber: number, bandLetter: string): boolean {
    return this.isNorwayLetter(bandLetter) && this.isNorwayZone(zoneNumber);
  }

  /**
   * Is the band letter a Norway GZD (V)
   *
   * @param bandLetter
   *            band letter
   * @return true if a Norway GZD band letter
   */
  private static isNorwayLetter(bandLetter: string): boolean {
    return bandLetter === MGRSConstants.NORWAY_BAND_LETTER;
  }

  /**
   * Is the zone number a Norway GZD (31 or 32)
   *
   * @param zoneNumber
   *            zone number
   * @return true if a Norway GZD zone number
   */
  private static isNorwayZone(zoneNumber: number): boolean {
    return zoneNumber >= MGRSConstants.MIN_NORWAY_ZONE_NUMBER && zoneNumber <= MGRSConstants.MAX_NORWAY_ZONE_NUMBER;
  }

  /**
   * Get the Norway longitudinal strip from the strip
   *
   * @param strip
   *            longitudinal strip
   * @return Norway strip
   */
  private static getNorwayStrip(strip: LongitudinalStrip): LongitudinalStrip {
    const stripNumber = strip.getNumber();
    let west = strip.getWest();
    let east = strip.getEast();
    const halfWidth = (east - west) / 2.0;

    let expand = 0;
    if (stripNumber === MGRSConstants.MIN_NORWAY_ZONE_NUMBER) {
      east -= halfWidth;
      expand++;
    } else if (stripNumber === MGRSConstants.MAX_NORWAY_ZONE_NUMBER) {
      west -= halfWidth;
    }

    return new LongitudinalStrip(stripNumber, west, east, expand);
  }

  /**
   * Get the Norway zone number from the longitude
   *
   * @param longitude
   *            longitude
   * @return zone number
   */
  private static getNorwayZone(longitude: number): number {
    const minimumLongitude = this.getWestLongitude(MGRSConstants.MIN_NORWAY_ZONE_NUMBER);
    let zone = MGRSConstants.MIN_NORWAY_ZONE_NUMBER;
    if (longitude >= minimumLongitude + MGRSConstants.ZONE_WIDTH / 2.0) {
      zone++;
    }
    return zone;
  }
}
