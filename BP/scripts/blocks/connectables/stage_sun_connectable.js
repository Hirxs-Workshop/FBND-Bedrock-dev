import { system, BlockPermutation, Direction, world, EquipmentSlot, Player } from "@minecraft/server";
import { switchBlockFaces, getPlayerYRot } from "fbd_data_files/detectSidesBlocks";
import { isReplaceable } from "fbd_data_files/blocksReplaceables";
import { destroyMultiBlock } from "fbd_data_files/whenPlayerDestroy";
import { decrementStack } from "fbd_data_files/invItems";

const isBlockSized = [2, 2, 1];
const rotate_IsBlockSized = [1, 2, 2];
const ajustConnection = [
    `fb:stage_sun`
];

const lastLogTimes = {};

for (const blockIDs of ajustConnection) {
    world.beforeEvents.playerInteractWithBlock.subscribe(event => {
        if (!event.itemStack) return;

        const player = event.player || event.source;
        if (!player) {
            console.warn("DEBUG | Jugador no encontrado en el evento", event);
            return;
        }

        const item = event.itemStack.typeId;
        if (!item.match(blockIDs)) return;
        
        const key = JSON.stringify(item);
        const oldLog = lastLogTimes[key] || 0;
        lastLogTimes[key] = Date.now();
        if ((oldLog + 150) >= Date.now()) return;

        const dimension = player.dimension;
        const targetBlock = switchBlockFaces(event, Direction);
        if (!targetBlock) {
            console.warn("No se pudo obtener targetBlock para event.blockFace:", event.blockFace);
            return;
        }
        const direction = getPlayerYRot(player);
        let cm1, cm3, cm4;
        switch (direction) {
            case 2:
                cm1 = targetBlock.above();
                cm3 = targetBlock.above().east();
                cm4 = targetBlock.east();
                break;
            case 3:
                cm1 = targetBlock.above();
                cm3 = targetBlock.above().south();
                cm4 = targetBlock.south();
                break;
            case 0:
                cm1 = targetBlock.above();
                cm3 = targetBlock.above().west();
                cm4 = targetBlock.west();
                break;
            default:
                cm1 = targetBlock.above();
                cm3 = targetBlock.above().north();
                cm4 = targetBlock.north();
                break;
        }
        const listPlacedBlocks = [targetBlock, cm1, cm3, cm4];
        if (!listPlacedBlocks.every(isReplaceable)) return;
        system.run(() => {
            decrementStack(player, item);
            cm1.setPermutation(BlockPermutation.resolve(
                item, { "fbd:direction": direction, "fbd:connected_models": 0, "fbd:block_placed": 1 }
            ));
            targetBlock.setPermutation(BlockPermutation.resolve(
                item, { "fbd:direction": direction, "fbd:connected_models": 1, "fbd:block_placed": 1 }
            ));
            cm3.setPermutation(BlockPermutation.resolve(
                item, { "fbd:direction": direction, "fbd:connected_models": 2, "fbd:block_placed": 1 }
            ));
            cm4.setPermutation(BlockPermutation.resolve(
                item, { "fbd:direction": direction, "fbd:connected_models": 3, "fbd:block_placed": 1 }
            ));
            player.playSound('block.itemframe.place', player.location);
        });
    });

    world.beforeEvents.playerBreakBlock.subscribe(event => {
        const permutation = event.block.permutation;
        if (!permutation.matches(blockIDs)) return;
        const destroyedBlock = event.block;
        let fillTargetBlock, isRotated;
        switch (true) {
            case permutation.matches(blockIDs, { "fbd:direction": 2, "fbd:connected_models": 0 }):
                fillTargetBlock = destroyedBlock.below();
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 2, "fbd:connected_models": 1 }):
                fillTargetBlock = destroyedBlock;
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 2, "fbd:connected_models": 2 }):
                fillTargetBlock = destroyedBlock.below().west();
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 2, "fbd:connected_models": 3 }):
                fillTargetBlock = destroyedBlock.west();
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 0, "fbd:connected_models": 0 }):
                fillTargetBlock = destroyedBlock.below().west();
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 0, "fbd:connected_models": 1 }):
                fillTargetBlock = destroyedBlock.west();
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 0, "fbd:connected_models": 2 }):
                fillTargetBlock = destroyedBlock.below();
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 0, "fbd:connected_models": 3 }):
                fillTargetBlock = destroyedBlock;
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 3, "fbd:connected_models": 0 }):
                fillTargetBlock = destroyedBlock.below();
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 3, "fbd:connected_models": 1 }):
                fillTargetBlock = destroyedBlock;
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 3, "fbd:connected_models": 2 }):
                fillTargetBlock = destroyedBlock.below().north();
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 3, "fbd:connected_models": 3 }):
                fillTargetBlock = destroyedBlock.north();
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 1, "fbd:connected_models": 0 }):
                fillTargetBlock = destroyedBlock.below().north();
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 1, "fbd:connected_models": 1 }):
                fillTargetBlock = destroyedBlock.north();
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 1, "fbd:connected_models": 2 }):
                fillTargetBlock = destroyedBlock.below();
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "fbd:direction": 1, "fbd:connected_models": 3 }):
                fillTargetBlock = destroyedBlock;
                isRotated = true;
                break;
            default:
                return;
        }
        system.run(() => {
            if (!isRotated) {
                destroyMultiBlock(fillTargetBlock, isBlockSized);
            } else {
                destroyMultiBlock(fillTargetBlock, rotate_IsBlockSized);
            }
        });
    });
}
