import { Color } from "@ngageoint/color-js";
import { Bounds, Labeler, PropertyConstants } from "@ngageoint/grid-js";
import { GridZone } from "../gzd/GridZone";
import { MGRSProperties } from "../property/MGRSProperties";
import { GridLabel } from "./GridLabel";
import { GridType } from "./GridType";

/**
 * Grid Labeler
 * 
 * @author osbornb
 */
export abstract class GridLabeler extends Labeler {

    /**
     * Default text size
     */
    public static readonly DEFAULT_TEXT_SIZE = MGRSProperties.getInstance()
        .getDoubleProperty(true, PropertyConstants.LABELER.toString(),
            PropertyConstants.TEXT_SIZE.toString());

    /**
     * Default buffer size
     */
    public static readonly DEFAULT_BUFFER = MGRSProperties.getInstance()
        .getDoubleProperty(true, PropertyConstants.LABELER.toString(),
            PropertyConstants.BUFFER.toString());

    constructor(enabled: boolean, minZoom = 0, maxZoom: number | undefined, color = Color.black(), textSize = GridLabeler.DEFAULT_TEXT_SIZE, buffer = GridLabeler.DEFAULT_BUFFER) {
        super(enabled, minZoom, maxZoom, color, textSize!, buffer!);
    }

    /**
     * Get labels for the bounds
     * 
     * @param gridType
     *            grid type
     * @param zone
     *            grid zone
     *  * @param tileBounds
     *            tile bounds
     * @return labels
     */
    public abstract getLabels(gridType: GridType, zone: GridZone, tileBounds?: Bounds): GridLabel[] | undefined;

}
