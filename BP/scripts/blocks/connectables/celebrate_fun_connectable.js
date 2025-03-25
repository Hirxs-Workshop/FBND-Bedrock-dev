import { system, BlockPermutation, Direction, world, ItemStack } from "@minecraft/server";
import { switchBlockFaces, getPlayerYRot } from "fbd_data_files/detectSidesBlocks";
import { decrementStack } from "fbd_data_files/invItems";
import { isReplaceable } from "fbd_data_files/blocksReplaceables";
const lastLogTimes = {};

const BlockUsed = [
    "fd:celebrate_fun_sign"
];

for (const blockIDs of BlockUsed) {
    world.beforeEvents.playerBreakBlock.subscribe(event => {
        const permutation = event.block.permutation;
        if (!permutation.matches(blockIDs)) return;
        const destroyedBlock = event.block;
        let ajustConnection;
        switch (true) {
            case permutation.matches(blockIDs, { "ff:direction": 2, "ff:width_piece": 0, "ff:is_placed": 1 }):
                ajustConnection = destroyedBlock.east();
                break;
            case permutation.matches(blockIDs, { "ff:direction": 3, "ff:width_piece": 0, "ff:is_placed": 1 }):
                ajustConnection = destroyedBlock.south();
                break;
            case permutation.matches(blockIDs, { "ff:direction": 0, "ff:width_piece": 0, "ff:is_placed": 1 }):
                ajustConnection = destroyedBlock.west();
                break;
            case permutation.matches(blockIDs, { "ff:direction": 1, "ff:width_piece": 0, "ff:is_placed": 1 }):
                ajustConnection = destroyedBlock.north();
                break;

            case permutation.matches(blockIDs, { "ff:direction": 2, "ff:width_piece": 1, "ff:is_placed": 1 }):
                ajustConnection = destroyedBlock.west();
                break;
            case permutation.matches(blockIDs, { "ff:direction": 3, "ff:width_piece": 1, "ff:is_placed": 1 }):
                ajustConnection = destroyedBlock.north();
                break;
            case permutation.matches(blockIDs, { "ff:direction": 0, "ff:width_piece": 1, "ff:is_placed": 1 }):
                ajustConnection = destroyedBlock.east();
                break;
            case permutation.matches(blockIDs, { "ff:direction": 1, "ff:width_piece": 1, "ff:is_placed": 1 }):
                ajustConnection = destroyedBlock.south();
                break;
        }
        if (ajustConnection === void 0) return;
        system.run(() => {
            ajustConnection.setPermutation(BlockPermutation.resolve("minecraft:air"));
        });
    });

    world.beforeEvents.playerInteractWithBlock.subscribe(event => {
        if (!event.itemStack) {
            return;
        }
        const player = event.player || event.source;
        if (!player) {
            console.warn("DEBUG | Item no found!", event);
            return;
        }
        const item = event.itemStack.typeId;
        if (!item.match(blockIDs)) return;
        const key = JSON.stringify(item);
        const oldLog = lastLogTimes[key] || 0;
        lastLogTimes[key] = Date.now();
        if ((oldLog + 150) >= Date.now()) return;
        const targetBlock = switchBlockFaces(event, Direction);
        if (!targetBlock) {
            console.warn("DEBUG | Could not get a valid targetBlock for event.blockFace:", event.blockFace);
            return;
        }
    
        const direction = getPlayerYRot(player);
        let ajustConnection;
        switch (direction) {
            case 2:
                ajustConnection = targetBlock.east();
                break;
            case 3:
                ajustConnection = targetBlock.south();
                break;
            case 0:
                ajustConnection = targetBlock.west();
                break;
            default:
                ajustConnection = targetBlock.north();
                break;
        }
        if (!ajustConnection) {
            console.warn("DEBUG | Could not determine ajustConnection for address:", direction);
            return;
        }
        if (!(isReplaceable(targetBlock) && isReplaceable(ajustConnection))) return;
        system.run(() => {
            decrementStack(player, item);
            targetBlock.setPermutation(BlockPermutation.resolve(
                item, { "ff:direction": direction, "ff:width_piece": 0, "ff:is_placed": 1 }
            ));
            ajustConnection.setPermutation(BlockPermutation.resolve(
                item, { "ff:direction": direction, "ff:width_piece": 1, "ff:is_placed": 1 }
            ));
            if (!blockIDs.includes("_fun_sign")) return;
            player.playSound('block.itemframe.place', player.location);
        });
    });
    
}
