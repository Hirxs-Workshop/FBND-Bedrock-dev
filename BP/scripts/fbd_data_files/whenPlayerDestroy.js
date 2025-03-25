import { BlockPermutation } from "@minecraft/server"

export function destroyBlock(block) {
    if (block != undefined) (
        block.setPermutation(BlockPermutation.resolve("minecraft:air"))
    )
}

export function destroyMultiBlock(block, size) {
    const fillPosition = [block.x, block.y, block.z]
    const fillSize = [block.x + size[0] - 1, block.y + size[1] - 1, block.z + size[2] - 1]
    const dimension = block.dimension

    dimension.runCommand(`fill ${fillPosition.join(` `)} ${fillSize.join(` `)} air[]`)
}