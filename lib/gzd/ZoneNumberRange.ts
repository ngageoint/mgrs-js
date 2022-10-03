import { MGRSConstants } from '../MGRSConstants';
import { GridZones } from './GridZones';

/**
 * Zone Number Range
 *
 * @author osbornb
 */
export class ZoneNumberRange implements IterableIterator<number> {
  /**
   * Western zone number
   */
  private west: number;

  /**
   * Eastern zone number
   */
  private east: number;

  /**
   * Zone number
   */
  private zoneNumber: number;

  /**
   * Constructor
   *
   * @param west
   *            western zone number
   * @param east
   *            eastern zone number
   */
  constructor(west = MGRSConstants.MIN_ZONE_NUMBER, east = MGRSConstants.MAX_ZONE_NUMBER) {
    this.west = west;
    this.east = east;
    this.zoneNumber = west;
  }

  /**
   * Get the western zone number
   *
   * @return western zone number
   */
  public getWest(): number {
    return this.west;
  }

  /**
   * Set the western zone number
   *
   * @param west
   *            western zone number
   */
  public setWest(west: number): void {
    this.west = west;
  }

  /**
   * Get the eastern zone number
   *
   * @return eastern zone number
   */
  public getEast(): number {
    return this.east;
  }

  /**
   * Set the eastern zone number
   *
   * @param east
   *            eastern zone number
   */
  public setEast(east: number): void {
    this.east = east;
  }

  /**
   * Get the western longitude
   *
   * @return longitude
   */
  public getWestLongitude(): number {
    return GridZones.getLongitudinalStrip(this.west).getWest();
  }

  /**
   * Get the eastern longitude
   *
   * @return longitude
   */
  public getEastLongitude(): number {
    return GridZones.getLongitudinalStrip(this.east).getEast();
  }

  public next(): IteratorResult<number> {
    if (this.zoneNumber <= this.east) {
      const currentZoneNumber = this.zoneNumber;
      this.zoneNumber++;
      return {
        done: false,
        value: currentZoneNumber,
      };
    } else {
      return {
        done: true,
        value: null,
      };
    }
  }

  public reset(): void {
    this.zoneNumber = this.west;
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this;
  }
}
