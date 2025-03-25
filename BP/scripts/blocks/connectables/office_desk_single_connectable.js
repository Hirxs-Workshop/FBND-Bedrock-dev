import { system, world, BlockPermutation, ItemStack } from "@minecraft/server";
system.beforeEvents.startup.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('fbd:desk_function', {
        onPlace: (e) => {
            let block = e.block;
            let direction = block.permutation.getState('minecraft:cardinal_direction');
            if (direction === 'north' || direction === 'south') {
                deskEx(block, 'east', 'west', direction, 'desk');
            } else {
                deskEx(block, 'north', 'south', direction, 'desk');
            };
        },
        onPlayerDestroy: (e) => {
            let block = e.block;
            let previousBlock = e.destroyedBlockPermutation;
            ['west', 'east', 'north', 'south'].forEach(facingDirection => {
                if (block[facingDirection]().typeId === previousBlock.type.id) {
                    let direction = previousBlock.getState('minecraft:cardinal_direction');
                    if (direction === 'north' || direction === 'south') {
                        deskEx(block.east(), 'east', 'west', direction, 'desk');
                        deskEx(block.west(), 'east', 'west', direction, 'desk');
                    } else {
                        deskEx(block.north(), 'north', 'south', direction, 'desk');
                        deskEx(block.south(), 'north', 'south', direction, 'desk');
                    };
                }
            });
        }
    });
});
function normalizeDirection(direction) {
    if (direction === 'south') return 'north';
    if (direction === 'west') return 'east';
    return direction;
}
function modifyDeskFunction(block, start, end, settingType) {
    if (start.x === end.x && start.z === end.z) {
        let height = block.below().isAir ? 2 : 1;
        block.setPermutation(BlockPermutation.resolve(block.typeId, { 'fbd:d_state': 'both', 'fbd:height': height, 'minecraft:cardinal_direction': normalizeDirection(block.permutation.getState('minecraft:cardinal_direction')) }));
        return
    };
    [start, end] = (start.x > end.x || (start.x === end.x && start.z > end.z)) ? [end, start] : [start, end];
    const [xStart, yNorm, zStart] = [start.x, start.y, start.z];
    const [xEnd, zEnd] = [end.x, end.z];
    let finalDirection = normalizeDirection(block.permutation.getState('minecraft:cardinal_direction'));
    if (settingType === 'normal') {
        if (xStart !== xEnd) {
            for (let xLoop = Math.min(xStart, xEnd) + 1; xLoop < Math.max(xStart, xEnd); xLoop++) {
                block.dimension.getBlock({ x: xLoop, y: yNorm, z: zStart }).setPermutation(modifyPermutation(block, 'fbd:height', 1));
            }
        } else {
            for (let zLoop = Math.min(zStart, zEnd) + 1; zLoop < Math.max(zStart, zEnd); zLoop++) {
                block.dimension.getBlock({ x: xStart, y: yNorm, z: zLoop }).setPermutation(modifyPermutation(block, 'fbd:height', 1));
            }
        };
        block.dimension.getBlock(start).below().isAir ? block.dimension.getBlock(start).setPermutation(BlockPermutation.resolve(block.typeId, { 'fbd:d_state': 'open_left', 'fbd:height': 2, 'minecraft:cardinal_direction': finalDirection })) : undefined;
        block.dimension.getBlock(end).below().isAir ? block.dimension.getBlock(end).setPermutation(BlockPermutation.resolve(block.typeId, { 'fbd:d_state': 'open_right', 'fbd:height': 2, 'minecraft:cardinal_direction': finalDirection })) : undefined;
    } else if (settingType === 'closed') {
        if (xStart !== xEnd) {
            for (let xLoop = Math.min(xStart, xEnd); xLoop <= Math.max(xStart, xEnd); xLoop++) {
                let selectedBlock = block.dimension.getBlock({ x: xLoop, y: yNorm, z: zStart });
                let height = selectedBlock.below().isAir ? 2 : 1;
                selectedBlock.setPermutation(BlockPermutation.resolve(block.typeId, { 'fbd:d_state': 'none', 'fbd:is_closed': true, 'fbd:height': height, 'minecraft:cardinal_direction': finalDirection }));
            }
        } else {
            for (let zLoop = Math.min(zStart, zEnd); zLoop <= Math.max(zStart, zEnd); zLoop++) {
                let selectedBlock = block.dimension.getBlock({ x: xStart, y: yNorm, z: zLoop });
                let height = selectedBlock.below().isAir ? 2 : 1;
                selectedBlock.setPermutation(BlockPermutation.resolve(block.typeId, { 'fbd:d_state': 'none', 'fbd:is_closed': true, 'fbd:height': height, 'minecraft:cardinal_direction': finalDirection }));
            }
        };
    }
}
function modifyDesk(block, start, end) {
    if (start.x === end.x && start.z === end.z) {
        block.setPermutation(modifyPermutation(block, 'fbd:desk_state_sides', 'both'));
        return
    };
    [start, end] = (start.x > end.x || (start.x === end.x && start.z > end.z)) ? [end, start] : [start, end];
    const [xStart, yNorm, zStart] = [start.x, start.y, start.z];
    const [xEnd, zEnd] = [end.x, end.z];
    try {
        if (xStart !== xEnd) {
            for (let xLoop = Math.min(xStart, xEnd) + 1; xLoop < Math.max(xStart, xEnd); xLoop++) {
                block.dimension.getBlock({ x: xLoop, y: yNorm, z: zStart }).setPermutation(modifyPermutation(block, 'fbd:desk_state_sides', 'none'));
            }
        } else {
            for (let zLoop = Math.min(zStart, zEnd) + 1; zLoop < Math.max(zStart, zEnd); zLoop++) {
                block.dimension.getBlock({ x: xStart, y: yNorm, z: zLoop }).setPermutation(modifyPermutation(block, 'fbd:desk_state_sides', 'none'));
            }
        };
        let deskDirection = block.permutation.getState('minecraft:cardinal_direction');
        let startDirection = (deskDirection === 'north' || deskDirection === 'east') ? 'left' : 'right';
        let endDirection = startDirection === 'left' ? 'right' : 'left';
        block.dimension.getBlock(start).setPermutation(modifyPermutation(block, 'fbd:desk_state_sides', startDirection));
        block.dimension.getBlock(end).setPermutation(modifyPermutation(block, 'fbd:desk_state_sides', endDirection));
    } catch (error) {
        return;
    };
}
function deskEx(block, direction1, direction2, settingType, option) {
    let start = block.location;
    let end = block.location;
    let blockDirection = (settingType === "normal" || settingType === "closed") ? normalizeDirection(block.permutation.getState('minecraft:cardinal_direction')) : block.permutation.getState('minecraft:cardinal_direction');
    let current = block;
    let strict = option === 'curtain' ? false : true;
    while (isMatchingBlock(current[direction1](), block.typeId, blockDirection, strict)) {
        end = current[direction1]().location;
        current = current[direction1]();
    }
    current = block;
    while (isMatchingBlock(current[direction2](), block.typeId, blockDirection, strict)) {
        start = current[direction2]().location;
        current = current[direction2]();
    }
    option === 'curtain' ? modifyDeskFunction(block, start, end, settingType) : modifyDesk(block, start, end);
}
function isMatchingBlock(block, typeId, direction, restrict) {
    if (block?.typeId !== typeId) return false;
    let blockDirection = restrict ? block.permutation.getState('minecraft:cardinal_direction') : normalizeDirection(block.permutation.getState('minecraft:cardinal_direction'));
    return blockDirection === direction;
}
function modifyPermutation(block, permutationName, state) {
    return block.permutation.withState(permutationName, state);
};
world.afterEvents.playerPlaceBlock.subscribe((e) => {
    let block = e.block;
    if (block.above().typeId.endsWith('_curtain')) {
        block.dimension.getBlock(block.above().location).setPermutation(modifyPermutation(block.above(), 'fbd:height', 1));
    };
    if (block.typeId.startsWith('fbd:') && block.below().typeId === 'fbd:furniture_design') {
        block.dimension.playSound('fbd.saw', block.location)
        let blockTrait = traitList.find(trait => block.typeId.includes(trait)) + '_' || '';
        let bareName = block.typeId.replace('fbd:', '').replace(blockTrait, '');
        let decomposed = decomposedMaterial[bareName];
        for (let key in decomposed) {
            if (decomposed.hasOwnProperty(key)) {
                if (key.startsWith('$')) {
                    block.dimension.spawnItem(new ItemStack('minecraft:' + blockTrait + key.replace('$', ''), decomposed[key]), block.center());
                } else {
                    block.dimension.spawnItem(new ItemStack('minecraft:' + key, decomposed[key]), block.center());
                }
            }
        };
        if (block.typeId.endsWith('based_grandfather_clock')) block.above().setPermutation(BlockPermutation.resolve('minecraft:air'));
        block.setPermutation(BlockPermutation.resolve('minecraft:air'));
    }
});
function normalizeAndRotate(d) {
    return ['north', 'west', 'south', 'east'][(['north', 'west', 'south', 'east'].indexOf(d) + 1) % 4];
}
world.beforeEvents.playerPlaceBlock.subscribe((e) => {
    let blockPerm = e.permutationBeingPlaced;
    let blockId = blockPerm.type.id;
    let face = e.face;
    if (blockId.endsWith('_lamp') || blockId === 'fbd:wind_bell' || blockId === 'fbd:item_sign') {
        if (face !== 'Up' && face !== 'Down') {
            let faceToSet = blockId === 'fbd:item_sign' ? normalizeAndRotate(face.toLowerCase()) : face.toLowerCase();
            system.run(() => {
                e.block.setPermutation(BlockPermutation.resolve(blockId, { 'fbd:wall_bit': true, 'minecraft:cardinal_direction': faceToSet }));
            });
        };
    };
    if (blockId === 'fbd:clock') {
        if (face !== 'Up' && face !== 'Down') {
            system.run(() => {
                e.block.setPermutation(BlockPermutation.resolve(blockId, { 'minecraft:cardinal_direction': face.toLowerCase() }));
            });
        };
    };
    if (blockId === "fbd:piano") {
        let { block } = e;
        if (block.below().typeId === 'fbd:furniture_design') return;
        let rotation = blockPerm.getState('minecraft:cardinal_direction');
        let directions = rotation === "south" || rotation === "north" ? ["east", "west"] : ["north", "south"];
        let sideTest = directions.find(dir => block[dir]().isAir);
        let upperTest = block.above().isAir;
        let pointTest = block[rotation](-1).isAir;
        if (sideTest && upperTest && pointTest) {
            let cardinalDirection = blockPerm.getState('minecraft:cardinal_direction');
            let pointUpperTest = block[rotation](-1).above().isAir;
            let sidePointTest = block[sideTest]()[rotation](-1).isAir;
            let sideUpperTest = sideTest ? block[sideTest]().above().isAir : false;
            if (pointUpperTest && sideUpperTest && sidePointTest) {
                const d = ['north', 'east', 'south', 'west'];
                let firstPart = d.indexOf(sideTest) === (d.indexOf(cardinalDirection) + 1) % 4 || d.indexOf(sideTest) === (d.indexOf(cardinalDirection) + 2) % 4 ? "left" : "right";
                let secondPart = firstPart === "left" ? "right" : "left";
                system.run(() => {
                    const emptyBlock = BlockPermutation.resolve('fbd:empty_block', { 'minecraft:cardinal_direction': cardinalDirection });
                    block.setPermutation(BlockPermutation.resolve('fbd:' + firstPart + '_piano', { 'minecraft:cardinal_direction': cardinalDirection }));
                    block[sideTest]().setPermutation(BlockPermutation.resolve('fbd:' + secondPart + '_piano', { 'minecraft:cardinal_direction': cardinalDirection }));
                    block[rotation](-1).setPermutation(emptyBlock);
                    block[sideTest]()[rotation](-1).setPermutation(emptyBlock);
                    block.above().setPermutation(emptyBlock);
                    block[sideTest]().above().setPermutation(emptyBlock);
                });
            } else {
                e.cancel = true;
            }
        } else {
            e.cancel = true;
        }
    }
});
world.afterEvents.playerBreakBlock.subscribe((e) => {
    let block = e.block;
    if (block.above().typeId.endsWith('_curtain')) {
        block.dimension.getBlock(block.above().location).setPermutation(modifyPermutation(block.above(), 'fbd:height', 2));
    };
});
function removeOneChest(block) {
    block.dimension.getEntities({ type: 'minecraft:item', name: 'Chest', location: block.location }).forEach((item) => {
        let currentItemStack = item.getComponent("item").itemStack;
        if (currentItemStack.amount > 1) { currentItemStack.amount = currentItemStack.amount - 1 } else { item.remove() };
        return;
    });
}
