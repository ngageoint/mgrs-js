import { GridType } from "./GridType";

export class GridTypeUtils {

    /**
     * Get the Grid Type accuracy number of digits in the easting and northing
     * values
     * 
     * @return accuracy digits
     */
    public static getAccuracy(gridType: GridType): number {
        return Math.max(gridType.ordinal() - 1, 0);
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
            throw new Error(
                "Grid Type accuracy digits must be >= 0 and <= 5. accuracy digits: "
                + accuracy);
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

    /**
    * Get the less precise (larger precision value) grid types
    *
    * @param type
    *            grid type
    * @return grid types less precise
    */
    public static lessPrecise(type: GridType): Set<GridType> {
        const values = GridTypeUtils.values();
        const ordinal = Object.keys(GridType).indexOf(type.toString());

        const types = new Set<GridType>();
        for (let i = 0; i < ordinal; i++) {
            types.add(values[i]);
        }

        return types;
    }

    /**
     * Get the more precise (smaller precision value) grid types
     *
     * @param type
     *            grid type
     * @return grid types more precise
     */
    public static morePrecise(type: GridType): Set<GridType> {
        const values = GridTypeUtils.values();
        const ordinal = Object.keys(GridType).indexOf(type.toString());

        const types = new Set<GridType>();
        for (let i = ordinal; i < values.length; i++) {
            types.add(values[i]);
        }
        return types;
    }

    public static values(): GridType[] {
        const gridTypes: GridType[] = [];
        for (const type of Object.keys(GridType)) {
            gridTypes.push(GridType[type as keyof typeof GridType]);
        }
        return gridTypes;
    }

}