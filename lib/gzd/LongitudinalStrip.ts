/**
 * Longitudinal (vertical) strip
 */
export class LongitudinalStrip {
  /**
   * Zone number
   */
  private zoneNumber: number;

  /**
   * Western longitude
   */
  private west: number;

  /**
   * Eastern longitude
   */
  private east: number;

  /**
   * Expansion for range iterations over neighboring strips
   */
  private expand: number;

  /**
   * Constructor
   *
   * @param zoneNumber
   *            zone number
   * @param west
   *            western longitude
   * @param east
   *            eastern longitude
   * @param expand
   *            expansion for range iterations over neighboring strips
   */
  constructor(zoneNumber: number, west: number, east: number, expand = 0) {
    this.zoneNumber = zoneNumber;
    this.west = west;
    this.east = east;
    this.expand = expand;
  }

  /**
   * Get the zone number
   *
   * @return zone number
   */
  public getNumber(): number {
    return this.zoneNumber;
  }

  /**
   * Set the zone number
   *
   * @param zoneNumber
   *            zone number
   */
  public setNumber(zoneNumber: number): void {
    this.zoneNumber = zoneNumber;
  }

  /**
   * Get the western longitude
   *
   * @return western longitude
   */
  public getWest(): number {
    return this.west;
  }

  /**
   * Set the western longitude
   *
   * @param west
   *            western longitude
   */
  public setWest(west: number): void {
    this.west = west;
  }

  /**
   * Get the eastern longitude
   *
   * @return eastern longitude
   */
  public getEast(): number {
    return this.east;
  }

  /**
   * Set the eastern longitude
   *
   * @param east
   *            eastern longitude
   */
  public setEast(east: number): void {
    this.east = east;
  }

  /**
   * Get expand, number of additional neighbors to iterate over in combination
   * with this strip
   *
   * @return neighbor iteration expansion
   */
  public getExpand(): number {
    return this.expand;
  }

  /**
   * Set the expand, number of additional neighbors to iterate over in
   * combination with this strip
   *
   * @param expand
   *            neighbor iteration expansion
   */
  public setExpand(expand: number): void {
    this.expand = expand;
  }
}
