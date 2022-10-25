import { Grid } from './Grid';
import { GridType } from './GridType';

export class GridTypeUtils {
  /**
   * Get the Grid Type accuracy number of digits in the easting and northing
   * values
   *
   * @return accuracy digits
   */
  public static getAccuracy(gridType: GridType): number {
    return Math.max(GridTypeUtils.ordinal(gridType) - 1, 0);
  }

  /**
   * Get the Grid Type with the accuracy number of digits in the easting and
   * northing values. Accuracy must be inclusively between 0
   * ({@link GridType#HUNDRED_KILOMETER}) and 5 ({@link GridType#METER}).
   *
   * @param accuracy
   *            accuracy digits between 0 (inclusive) and 5 (inclusive)
   * @return grid type
   */
  public static withAccuracy(accuracy: number): GridType {
    if (accuracy < 0 || accuracy > 5) {
      throw new Error('Grid Type accuracy digits must be >= 0 and <= 5. accuracy digits: ' + accuracy);
    }
    return GridTypeUtils.values()[accuracy + 1];
  }

  /**
   * Get the precision of the value in meters based upon trailing 0's
   *
   * @param value
   *            value in meters
   * @return precision grid type
   */
  public static getPrecision(value: number): GridType {
    let precision: GridType;
    if (value % GridType.HUNDRED_KILOMETER === 0) {
      precision = GridType.HUNDRED_KILOMETER;
    } else if (value % GridType.TEN_KILOMETER === 0) {
      precision = GridType.TEN_KILOMETER;
    } else if (value % GridType.KILOMETER === 0) {
      precision = GridType.KILOMETER;
    } else if (value % GridType.HUNDRED_METER === 0) {
      precision = GridType.HUNDRED_METER;
    } else if (value % GridType.TEN_METER === 0) {
      precision = GridType.TEN_METER;
    } else {
      precision = GridType.METER;
    }
    return precision;
  }

  public static values(): GridType[] {
    const gridTypes: GridType[] = [];
    const values = Object.keys(GridType).map((key: any) => GridType[key]);
    for (const type of values) {
      if (Number.isInteger(type)) {
        gridTypes.push(type as unknown as number);
      }
    }
    return gridTypes;
  }

  public static ordinal(type: GridType): number {
    const types: string[] = Object.keys(GridType);

    let ordinal = 0;
    for (let i = 0; i < types.length; i++) {
      if (isNaN(Number(types[i]))) {
        if (types[i] === GridType[type]) {
          break;
        }
        ordinal++;
      }
    }

    return ordinal;
  }

  public static hashCode(type: GridType): number {
    let h: number = 0;
    const str = type.toString();
    for (let i = 0; i < str.length; i++) {
      h = 31 * h + str.charCodeAt(i);
    }
    return h & 0xffffffff;
  }
}
