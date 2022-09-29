import { Color } from "@ngageoint/color-js";
import { Bounds } from "@ngageoint/grid-js";
import { GridZone } from "../gzd/GridZone";
import { MGRS } from "../MGRS";
import { UTM } from "../utm/UTM";
import { GridLabel } from "./GridLabel";
import { GridLabeler } from "./GridLabeler";
import { GridType } from "./GridType";

/**
 * MGRS grid labeler
 * 
 * @author osbornb
 */
export class MGRSLabeler extends GridLabeler {

    constructor(enabled: boolean, minZoom = 0, maxZoom?: number, color?: Color, textSize?: number, buffer?: number) {
        super(enabled, minZoom, maxZoom, color, textSize, buffer);
    }

    /**
     * {@inheritDoc}
     */
    public getLabels(gridType: GridType, zone: GridZone, tileBounds?: Bounds): GridLabel[] | undefined {

        let labels: GridLabel[] | undefined;

        if (tileBounds) {
            const drawBounds = zone.getDrawBounds(tileBounds, gridType);

            if (drawBounds) {

                labels = [];

                const precision = gridType;

                for (let easting = drawBounds
                    .getMinLongitude(); easting <= drawBounds
                        .getMaxLongitude(); easting += precision) {
                    for (let northing = drawBounds
                        .getMinLatitude(); northing <= drawBounds
                            .getMaxLatitude(); northing += precision) {

                        const label = this.getLabel(gridType, zone, easting,
                            northing);
                        if (label) {
                            labels.push(label);
                        }

                    }
                }

            }
        }

        return labels;
    }

    /**
     * Get the grid zone label
     * 
     * @param gridType
     *            grid type
     * @param easting
     *            easting
     * @param northing
     *            northing
     * @return labels
     */
    private getLabel(gridType: GridType, zone: GridZone, easting: number,
        northing: number): GridLabel | undefined {

        let label: GridLabel | undefined;

        const precision = gridType;
        const bounds = zone.getBounds();
        const zoneNumber = zone.getNumber();
        const hemisphere = zone.getHemisphere();

        const northwest = UTM.point(zoneNumber, hemisphere, easting,
            northing + precision);
        const southwest = UTM.point(zoneNumber, hemisphere, easting, northing);
        const southeast = UTM.point(zoneNumber, hemisphere, easting + precision,
            northing);
        const northeast = UTM.point(zoneNumber, hemisphere, easting + precision,
            northing + precision);

        let minLatitude = Math.max(southwest.getLatitude(),
            southeast.getLatitude());
        minLatitude = Math.max(minLatitude, bounds.getMinLatitude());
        let maxLatitude = Math.min(northwest.getLatitude(),
            northeast.getLatitude());
        maxLatitude = Math.min(maxLatitude, bounds.getMaxLatitude());

        let minLongitude = Math.max(southwest.getLongitude(),
            northwest.getLongitude());
        minLongitude = Math.max(minLongitude, bounds.getMinLongitude());
        let maxLongitude = Math.min(southeast.getLongitude(),
            northeast.getLongitude());
        maxLongitude = Math.min(maxLongitude, bounds.getMaxLongitude());

        if (minLongitude <= maxLongitude && minLatitude <= maxLatitude) {

            const labelBounds = Bounds.degrees(minLongitude, minLatitude,
                maxLongitude, maxLatitude);
            const center = labelBounds.getCentroid();

            const mgrs = MGRS.from(center);
            let id: string;
            if (gridType === GridType.HUNDRED_KILOMETER) {
                id = mgrs.getColumnRowId();
            } else {
                id = mgrs.getEastingAndNorthing(gridType);
            }

            label = new GridLabel(id, center, labelBounds, gridType, mgrs);
        }

        return label;
    }

}
