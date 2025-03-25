import { system, BlockPermutation, Direction, world, EquipmentSlot } from "@minecraft/server";
import { switchBlockFaces, getPlayerYRot } from "fbd_data_files/detectSidesBlocks";
import { decrementStack } from "fbd_data_files/invItems";
import { isReplaceable } from "fbd_data_files/blocksReplaceables";
import { destroyMultiBlock } from "fbd_data_files/whenPlayerDestroy";

const IsBlockSized = [3, 1, 1];
const Rotate_when_IsBlockSized = [1, 1, 3];
const ajustConnection = [
    `fd:sync_desk`,
    `fd:sync_desk_props`,
];

const lastLogTimes = {};

for (const blockIDs of ajustConnection) {
    world.beforeEvents.playerInteractWithBlock.subscribe(event => {
        if (!event.itemStack) {
            return;
        }
        const player = event.player || event.source;
        if (!player) {
            console.warn("DEBUG | Jugador no encontrado en el evento", event);
            return;
        }
        const item = event.itemStack.typeId;
        const dimension = player.dimension;
        if (!item.match(blockIDs)) return;
        
        const key = JSON.stringify(item);
        const oldLog = lastLogTimes[key] || 0;
        lastLogTimes[key] = Date.now();
        if ((oldLog + 150) >= Date.now()) return;
        
        const targetBlock = switchBlockFaces(event, Direction);
        if (!targetBlock) {
            console.warn("DEBUG | No se pudo obtener targetBlock para event.blockFace:", event.blockFace);
            return;
        }
        const direction = getPlayerYRot(player);
        let multiBlockPart0, multiBlockPart2;
        switch (direction) {
            // Facing North
            case 2:
                multiBlockPart0 = targetBlock.west();
                multiBlockPart2 = targetBlock.east();
                break;
            // Facing East
            case 3:
                multiBlockPart0 = targetBlock.north();
                multiBlockPart2 = targetBlock.south();
                break;
            // Facing South
            case 0:
                multiBlockPart0 = targetBlock.east();
                multiBlockPart2 = targetBlock.west();
                break;
            // Facing West (default)
            default:
                multiBlockPart0 = targetBlock.south();
                multiBlockPart2 = targetBlock.north();
                break;
        }
        const listPlacedBlocks = [targetBlock, multiBlockPart0, multiBlockPart2];
        if (!listPlacedBlocks.every(isReplaceable)) return;
        system.run(() => {
            decrementStack(player, item);
            multiBlockPart0.setPermutation(BlockPermutation.resolve(
                item, { "ff:direction": direction, "ff:multiblock_part": 0, "ff:is_placed": 1 }
            ));
            targetBlock.setPermutation(BlockPermutation.resolve(
                item, { "ff:direction": direction, "ff:multiblock_part": 1, "ff:is_placed": 1 }
            ));
            multiBlockPart2.setPermutation(BlockPermutation.resolve(
                item, { "ff:direction": direction, "ff:multiblock_part": 2, "ff:is_placed": 1 }
            ));
            player.playSound('step.netherite', player.location);
        });
    });

    world.beforeEvents.playerBreakBlock.subscribe(event => {
        const permutation = event.block.permutation;
        if (!permutation.matches(blockIDs)) return;
        const destroyedBlock = event.block;
        let fillTargetBlock, isRotated;
        switch (true) {
            case permutation.matches(blockIDs, { "ff:direction": 2, "ff:multiblock_part": 0, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock;
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "ff:direction": 2, "ff:multiblock_part": 1, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock.west();
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "ff:direction": 2, "ff:multiblock_part": 2, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock.west(2);
                isRotated = false;
                break;

            case permutation.matches(blockIDs, { "ff:direction": 0, "ff:multiblock_part": 0, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock.west(2);
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "ff:direction": 0, "ff:multiblock_part": 1, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock.west();
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "ff:direction": 0, "ff:multiblock_part": 2, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock;
                isRotated = false;
                break;
            case permutation.matches(blockIDs, { "ff:direction": 3, "ff:multiblock_part": 0, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock;
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "ff:direction": 3, "ff:multiblock_part": 1, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock.north();
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "ff:direction": 3, "ff:multiblock_part": 2, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock.north(2);
                isRotated = true;
                break;

            case permutation.matches(blockIDs, { "ff:direction": 1, "ff:multiblock_part": 0, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock.north(2);
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "ff:direction": 1, "ff:multiblock_part": 1, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock.north();
                isRotated = true;
                break;
            case permutation.matches(blockIDs, { "ff:direction": 1, "ff:multiblock_part": 2, "ff:is_placed": 1 }):
                fillTargetBlock = destroyedBlock;
                isRotated = true;
                break;
            default:
                return;
        }

        system.run(() => {
            if (!isRotated) {
                destroyMultiBlock(fillTargetBlock, IsBlockSized);
            } else {
                destroyMultiBlock(fillTargetBlock, Rotate_when_IsBlockSized);
            }
        });
    });
}
