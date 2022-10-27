import { Bounds } from '@ngageoint/grid-js';
import { MGRSUtils } from '../MGRSUtils';
import { BandLetterRange } from './BandLetterRange';
import { GridZone } from './GridZone';
import { GridZones } from './GridZones';
import { ZoneNumberRange } from './ZoneNumberRange';

/**
 * Grid Range
 */
export class GridRange implements IterableIterator<GridZone> {
  /**
   * Zone Number Range
   */
  private zoneNumberRange: ZoneNumberRange;

  /**
   * Band Letter Range
   */
  private bandLetterRange: BandLetterRange;

  /**
   * Minimum zone number
   */
  private readonly minZoneNumber: number;

  /**
   * Maximum zone number
   */
  private readonly maxZoneNumber: number;

  /**
   * Minimum band letter
   */
  private readonly minBandLetter: string;

  /**
   * Minimum band letter
   */
  private readonly maxBandLetter: string;

  /**
   * Zone number
   */
  private zoneNumber: number;

  /**
   * Band letter
   */
  private bandLetter: string;

  /**
   * Grid zone
   */
  private gridZone?: GridZone;

  /**
   * Additional special case grid zones
   */
  private additional: GridZone[] = [];

  /**
   * Constructor
   *
   * @param zoneNumberRange
   *            zone number range
   * @param bandLetterRange
   *            band letter range
   */
  constructor(zoneNumberRange = new ZoneNumberRange(), bandLetterRange = new BandLetterRange()) {
    this.zoneNumberRange = zoneNumberRange;
    this.bandLetterRange = bandLetterRange;

    this.minZoneNumber = zoneNumberRange.getWest();
    this.maxZoneNumber = zoneNumberRange.getEast();
    this.minBandLetter = bandLetterRange.getSouth();
    this.maxBandLetter = bandLetterRange.getNorth();
    this.zoneNumber = this.minZoneNumber;
    this.bandLetter = this.minBandLetter;
  }

  /**
   * Get the zone number range
   *
   * @return zone number range
   */
  public getZoneNumberRange(): ZoneNumberRange {
    return this.zoneNumberRange;
  }

  /**
   * Set the zone number range
   *
   * @param zoneNumberRange
   *            zone number range
   */
  public setZoneNumberRange(zoneNumberRange: ZoneNumberRange): void {
    this.zoneNumberRange = zoneNumberRange;
  }

  /**
   * Get the band letter range
   *
   * @return band letter range
   */
  public getBandLetterRange(): BandLetterRange {
    return this.bandLetterRange;
  }

  /**
   * Set the band letter range
   *
   * @param bandLetterRange
   *            band letter range
   */
  public setBandLetterRange(bandLetterRange: BandLetterRange): void {
    this.bandLetterRange = bandLetterRange;
  }

  /**
   * Get the grid range bounds
   *
   * @return bounds
   */
  public getBounds(): Bounds {
    const west = this.zoneNumberRange.getWestLongitude();
    const south = this.bandLetterRange.getSouthLatitude();
    const east = this.zoneNumberRange.getEastLongitude();
    const north = this.bandLetterRange.getNorthLatitude();

    return Bounds.degrees(west, south, east, north);
  }

  public next(): IteratorResult<GridZone> {
    while (!this.gridZone && this.zoneNumber <= this.maxZoneNumber) {
      this.gridZone = GridZones.getGridZone(this.zoneNumber, this.bandLetter);

      // Handle special case grid gaps (Svalbard)
      if (!this.gridZone) {
        // Retrieve the western grid if on the left edge
        if (this.zoneNumber === this.minZoneNumber) {
          this.additional.push(GridZones.getGridZone(this.zoneNumber - 1, this.bandLetter));
        }

        // Expand to the eastern grid if on the right edge
        if (this.zoneNumber === this.maxZoneNumber) {
          this.additional.push(GridZones.getGridZone(this.zoneNumber + 1, this.bandLetter));
        }
      } else {
        // Handle special case grid zone expansions (Norway)
        const expand = this.gridZone.getStripExpand();
        if (expand !== 0) {
          if (expand > 0) {
            for (let expandZone = this.zoneNumber + expand; expandZone > this.zoneNumber; expandZone--) {
              if (expandZone > this.maxZoneNumber) {
                this.additional.push(GridZones.getGridZone(expandZone, this.bandLetter));
              } else {
                break;
              }
            }
          } else {
            for (let expandZone = this.zoneNumber + expand; expandZone < this.zoneNumber; expandZone++) {
              if (expandZone < this.minZoneNumber) {
                this.additional.push(GridZones.getGridZone(expandZone, this.bandLetter));
              } else {
                break;
              }
            }
          }
        }
      }

      this.bandLetter = MGRSUtils.nextBandLetter(this.bandLetter);
      if (this.bandLetter > this.maxBandLetter) {
        this.zoneNumber++;
        this.bandLetter = this.minBandLetter;
      }
    }

    if (!this.gridZone && this.additional.length > 0) {
      this.gridZone = this.additional.shift();
    }

    if (this.gridZone) {
      const result = this.gridZone;
      this.gridZone = undefined;
      return {
        done: false,
        value: result,
      };
    } else
      return {
        done: true,
        value: null,
      };
  }

  public reset(): void {
    this.zoneNumber = this.minZoneNumber;
    this.bandLetter = this.minBandLetter;
  }

  [Symbol.iterator](): IterableIterator<GridZone> {
    return this;
  }
}
