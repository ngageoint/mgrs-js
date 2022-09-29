import { Color } from "@ngageoint/color-js";
import { BaseGrid, Bounds, GridStyle, GridTile, PropertyConstants } from "@ngageoint/grid-js";
import { GridLine } from "../features/GridLine";
import { GridZone } from "../gzd/GridZone";
import { MGRSProperties } from "../property/MGRSProperties";
import { GridLabel } from "./GridLabel";
import { GridLabeler } from "./GridLabeler";
import { GridType } from "./GridType";

/**
 * Grid
 * 
 * @author wnewman
 * @author osbornb
 */
export class Grid extends BaseGrid {

    /**
     * Default line width
     */
    public static readonly DEFAULT_WIDTH = MGRSProperties.getInstance()
        .getDoubleProperty(true, PropertyConstants.GRID.toString(), PropertyConstants.WIDTH.toString());

    /**
     * Grid type
     */
    private readonly type: GridType;

    /**
     * Grid line styles
     */
    private styles = new Map<GridType, GridStyle>();

    /**
     * Constructor
     * 
     * @param type
     *            grid type
     */
    constructor(type: GridType) {
        super();
        this.type = type;
    }

    /**
     * Get the grid type
     * 
     * @return grid type
     */
    public getType(): GridType {
        return this.type;
    }

    /**
     * Is the provided grid type
     * 
     * @param type
     *            grid type
     * @return true if the type
     */
    public isType(type: GridType): boolean {
        return this.type === type;
    }

    /**
     * Get the precision in meters
     * 
     * @return precision meters
     */
    public getPrecision(): number {
        return this.type;
    }

    /**
     * Get the grid type precision line style for the grid type
     * 
     * @param gridType
     *            grid type
     * @return grid type line style
     */
    public getStyleFromGridType(gridType: GridType): GridStyle {
        let style: GridStyle | undefined;
        if (gridType === this.type) {
            style = this.getStyle();
        } else {
            style = this.styles.get(gridType);
        }
        return style!;
    }

    /**
     * Get the grid type line style for the grid type or create it
     * 
     * @param gridType
     *            grid type
     * @return grid type line style
     */
    private getOrCreateStyle(gridType: GridType): GridStyle {
        let style = this.getStyleFromGridType(gridType);
        if (!style) {
            style = new GridStyle(undefined, 0);
            this.setStyleWithGridType(gridType, style);
        }
        return style;
    }

    /**
     * Set the grid type precision line style
     * 
     * @param gridType
     *            grid type
     * @param style
     *            grid line style
     */
    public setStyleWithGridType(gridType: GridType, style: GridStyle): void {
        if (gridType < this.getPrecision()) {
            throw new Error(
                "Grid can not define a style for a higher precision grid type. Type: "
                + this.type + ", Style Type: " + gridType);
        }
        if (gridType === this.type) {
            this.setStyle(style);
        } else {
            this.styles.set(gridType, style != null ? style : new GridStyle(undefined, 0));
        }
    }

    /**
     * Clear the propagated grid type precision styles
     */
    public clearPrecisionStyles(): void {
        this.styles.clear();
    }

    /**
     * Get the grid type precision line color
     * 
     * @param gridType
     *            grid type
     * @return grid type line color
     */
    public getColorFromGridType(gridType: GridType): Color {
        let color: Color | undefined;
        let style = this.getStyleFromGridType(gridType);
        if (style) {
            color = style.getColor();
        }
        if (!color) {
            color = this.getColor();
        }
        return color!;
    }

    /**
     * Set the grid type precision line color
     * 
     * @param gridType
     *            grid type
     * @param color
     *            grid line color
     */
    public setColorWithGridType(gridType: GridType, color: Color): void {
        this.getOrCreateStyle(gridType).setColor(color);
    }

    /**
     * Get the grid type precision line width
     * 
     * @param gridType
     *            grid type
     * @return grid type line width
     */
    public getWidthFromGridType(gridType: GridType): number {
        let width = 0;
        let style = this.getStyleFromGridType(gridType);
        if (style) {
            width = style.getWidth();
        }
        if (width === 0) {
            width = this.getWidth();
        }
        return width;
    }

    /**
     * Set the grid type precision line width
     * 
     * @param gridType
     *            grid type
     * @param width
     *            grid line width
     */
    public setWidthWithGridType(gridType: GridType, width: number): void {
        this.getOrCreateStyle(gridType).setWidth(width);
    }

    /**
     * Get the grid labeler
     * 
     * @return grid labeler
     */
    public getLabeler(): GridLabeler {
        return super.getLabeler() as GridLabeler;
    }

    /**
     * Set the grid labeler
     * 
     * @param labeler
     *            grid labeler
     */
    public setLabeler(labeler: GridLabeler): void {
        super.setLabeler(labeler);
    }

    /**
     * Get the lines for the tile and zone
     * 
     * @param tile
     *            tile
     * @param zone
     *            grid zone
     * @return lines
     */
    public getLinesFromGridTile(tile: GridTile, zone: GridZone): GridLine[] | undefined {
        return this.getLines(tile.getZoom(), zone, tile.getBounds());
    }

    /**
     * Get the lines for the zoom, tile bounds, and zone
     * 
     * @param zoom
     *            zoom level
     * @param tileBounds
     *            tile bounds
     * @param zone
     *            grid zone
     * @return lines
     */
    public getLines(zoom: number,  zone: GridZone, tileBounds?: Bounds): GridLine[] | undefined {
        let lines: GridLine[] | undefined;
        if (tileBounds && this.isLinesWithin(zoom)) {
            lines = this.getLinesFromBounds(tileBounds, zone);
        }
        return lines;
    }

    /**
     * Get the lines for the tile bounds and zone
     * 
     * @param tileBounds
     *            tile bounds
     * @param zone
     *            grid zone
     * @return lines
     */
    public getLinesFromBounds(tileBounds: Bounds, zone: GridZone): GridLine[] | undefined {
        return zone.getLines(tileBounds, this.type);
    }

    /**
     * Get the labels for the tile and zone
     * 
     * @param tile
     *            tile
     * @param zone
     *            grid zone
     * @return labels
     */
    public getLabelsFromGridTile(tile: GridTile, zone: GridZone): GridLabel[] | undefined {
        return this.getLabels(tile.getZoom(), zone, tile.getBounds());
    }

    /**
     * Get the labels for the zoom, tile bounds, and zone
     * 
     * @param zoom
     *            zoom level
     * @param tileBounds
     *            tile bounds
     * @param zone
     *            grid zone
     * @return labels
     */
    public getLabels(zoom: number,
        zone: GridZone, tileBounds?: Bounds): GridLabel[] | undefined {
        let labels: GridLabel[] | undefined;
        if (this.isLabelerWithin(zoom)) {
            labels = this.getLabeler().getLabels(this.type, zone, tileBounds);
        }
        return labels;
    }

    /**
     * {@inheritDoc}
     */
    public compareTo(other: Grid): number {
        return this.getPrecisionCompare() - other.getPrecisionCompare();
    }

    /**
     * Get the precision in meters
     * 
     * @return precision meters
     */
    public getPrecisionCompare(): number {
        let precision = this.getPrecision();
        if (precision <= GridType.GZD) {
            precision = Number.MAX_SAFE_INTEGER;
        }
        return precision;
    }

    /**
     * {@inheritDoc}
     */
    public equals(obj: any): boolean {
        if (this === obj)
            return true;
        if (!obj)
            return false;
        if (typeof this !== typeof obj)
            return false;
        const other = obj as Grid;
        if (this.type !== other.type)
            return false;
        return true;
    }

}
