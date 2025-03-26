import { Direction } from "@minecraft/server";

const isInRange = (value, min, max) => value >= min && value <= max;

export default class FaceSelectionPlains {
    /**
     * Allows you to define 2D areas on a block's face and get the selected plain.
     *
     * @param {Object[]} plains Spread array defining the 2D areas on a block's face which may be selected.
     * @param {[number, number]} plains[].origin [U, V] array defining the offset of the plain from the top left of the block face in pixels.
     * @param {[number, number]} plains[].size [U, V] array defining the size of the plain, extending from the top left in pixels.
     * @param {string} [plains[].name] Custom name to easily identify this plain when it is selected.
     */
    constructor(...plains) {
        this.plains = plains;
    }
    /**
     * @param {Object} selection
     * @param {Direction} selection.face
     * @param {import("@minecraft/server").Vector3} selection.faceLocation
     *
     * @param {Object} [options]
     * @param {boolean} [options.invertU] Horizontal axis extends `right -> left` rather than `left -> right` if true.
     * @param {boolean} [options.invertV] Vertical axis extends `bottom -> top` rather than `top -> bottom` if true.
     *
     * @returns Selected plain ID, or plain index if an ID is not provided. If no plains apply to the selection, `undefined` is returned.
     */
    getSelected(selection, options) {
        const { face, faceLocation } = selection;

        // Create a new object so the original is not mutated
        let location = { ...faceLocation };

        const horizontalAxis = face === Direction.East || face === Direction.West ? "z" : "x";
        const verticalAxis = face === Direction.Up || face === Direction.Down ? "z" : "y";

        if (face !== Direction.Down) location[verticalAxis] = 1 - location[verticalAxis];
        if (face !== Direction.South && face !== Direction.West)
            location[horizontalAxis] = 1 - location[horizontalAxis];

        if (options?.invertU) location[horizontalAxis] = 1 - location[horizontalAxis];
        if (options?.invertV) location[verticalAxis] = 1 - location[verticalAxis];

        for (let i = 0; i < this.plains.length; i++) {
            const plain = this.plains[i];

            const inHorizontalRange = isInRange(
                location[horizontalAxis],
                plain.origin[0] / 16,
                (plain.origin[0] + plain.size[0]) / 16
            );
            const inVerticalRange = isInRange(
                location[verticalAxis],
                plain.origin[1] / 16,
                (plain.origin[1] + plain.size[1]) / 16
            );

            if (inHorizontalRange && inVerticalRange) return plain.name ?? i;
        }
    }
}
