import { GridProperties } from '@ngageoint/grid-js';

/**
 * MGRS property loader
 *
 *
 */
export class MGRSProperties extends GridProperties {
  /**
   * Property file name
   */
  public static readonly PROPERTIES_FILE = './resources/mgrs.properties';

  /**
   * Singleton instance
   */
  public static instance = new MGRSProperties();

  /**
   * Get the singleton instance
   *
   * @return instance
   */
  public static getInstance(): MGRSProperties {
    return MGRSProperties.instance;
  }

  /**
   * {@inheritDoc}
   */
  public getFile(): string {
    return MGRSProperties.PROPERTIES_FILE;
  }
}
