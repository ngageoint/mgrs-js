import { MGRSConstants } from '../MGRSConstants';
import { MGRSUtils } from '../MGRSUtils';
import { GridZones } from './GridZones';

/**
 * Band Letter Range
 *
 * @author osbornb
 */
export class BandLetterRange implements IterableIterator<string> {
  /**
   * Southern band letter
   */
  private south: string;

  /**
   * Northern band letter
   */
  private north: string;

  private letter: string;

  /**
   * Constructor
   *
   * @param south
   *            southern band letter
   * @param north
   *            northern band letter
   */
  constructor(south = MGRSConstants.MIN_BAND_LETTER, north = MGRSConstants.MAX_BAND_LETTER) {
    this.south = south;
    this.north = north;

    this.letter = south;
  }

  /**
   * Get the southern band letter
   *
   * @return southern band letter
   */
  public getSouth(): string {
    return this.south;
  }

  /**
   * Set the southern band letter
   *
   * @param south
   *            southern band letter
   */
  public setSouth(south: string): void {
    this.south = south;
  }

  /**
   * Get the northern band letter
   *
   * @return northern band letter
   */
  public getNorth(): string {
    return this.north;
  }

  /**
   * Set the northern band letter
   *
   * @param north
   *            northern band letter
   */
  public setNorth(north: string): void {
    this.north = north;
  }

  /**
   * Get the southern latitude
   *
   * @return latitude
   */
  public getSouthLatitude(): number {
    return GridZones.getLatitudeBand(this.south).getSouth();
  }

  /**
   * Get the northern latitude
   *
   * @return latitude
   */
  public getNorthLatitude(): number {
    return GridZones.getLatitudeBand(this.north).getNorth();
  }

  public next(): IteratorResult<string> {
    if (this.letter <= this.north) {
      const currentLetter = this.letter;
      this.letter = MGRSUtils.nextBandLetter(this.letter);
      return {
        done: false,
        value: currentLetter,
      };
    } else {
      return {
        done: true,
        value: null,
      };
    }
  }

  public reset(): void {
    this.letter = this.south;
  }

  [Symbol.iterator](): IterableIterator<string> {
    return this;
  }
}
