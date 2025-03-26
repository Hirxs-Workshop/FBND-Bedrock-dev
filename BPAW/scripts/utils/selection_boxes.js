const isInRange = (value, min, max) => value >= min && value <= max;

export default class SelectionBoxes {
    /**
     * Allows you to define 3D areas in a block and get the box which the face selection lies within.
     *
     * @param {Object[]} boxes Array defining the 3D areas within a block which may be selected.
     * @param {[number, number, number]} boxes[].origin [X, Y, Z] array defining the offset of the box from the block's horizontal middle and vertical bottom in pixels, extending from the north-east.
     * @param {[number, number, number]} boxes[].size [X, Y, Z] array defining the size of the box in pixels, extending from the north-east.
     * @param {string} [boxes[].name] Custom name to easily identify this box when it is selected.
     */
    constructor(...boxes) {
        this.boxes = boxes;
    }
    /**
     * Get the box which the `faceLocation` lies within.
     *
     * @param {import("@minecraft/server").Vector3} faceLocation Selection location relative to the bottom north-west corner of the block.
     *
     * @param {Object} [options] Optionally configure how the selected box is calculated.
     * @param {boolean} [options.invertX] X axis extends `west -> east` rather than `east -> west` if true, following [Blockbench](https://blockbench.net)'s displayed positions.
     * @param {boolean} [options.invertY] Y axis extends `up -> down` rather than `down -> up` if true.
     * @param {boolean} [options.invertZ] Z axis extends `south -> north` rather than `north -> south` if true.
     *
     * @returns {(string|number|undefined)} Selected box name, or box index if a name is not provided. If no boxes apply to the selection, `undefined` is returned.
     */
    getSelected(faceLocation, options) {
        // Create a new object so the original is not mutated
        let location = { ...faceLocation };

        // X is inverted to ensure measurements are relative to the bottom north-east.
        if (!options?.invertX) location.x = 1 - location.x;
        if (options?.invertY) location.y = 1 - location.y;
        if (options?.invertZ) location.z = 1 - location.z;

        for (let i = 0; i < this.boxes.length; i++) {
            const box = this.boxes[i];

            const from = {
                x: box.origin[0] + 8,
                y: box.origin[1],
                z: box.origin[2] + 8,
            };
            const to = {
                x: from.x + box.size[0],
                y: from.y + box.size[1],
                z: from.z + box.size[2],
            };

            const inXRange = isInRange(location.x, from.x / 16, to.x / 16);
            const inYRange = isInRange(location.y, from.y / 16, to.y / 16);
            const inZRange = isInRange(location.z, from.z / 16, to.z / 16);

            if (inXRange && inYRange && inZRange) return box.name ?? i;
        }
    }
}
