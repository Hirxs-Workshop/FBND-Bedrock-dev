import { world, ItemStack, EquipmentSlot, GameMode } from "@minecraft/server";
import SelectionBoxes from "../utils/selection_boxes";

const wallss = {
    x: new SelectionBoxes({ origin: [-8, 0, -8], size: [16, 16, 0] }, { origin: [-8, 0, -8], size: [0, 16, 16] }, { origin: [-8, 0, 8], size: [16, 16, 0] }, { origin: [8, 0, -8], size: [0, 16, 16] }),
    z: new SelectionBoxes({ origin: [-8, 0, -8], size: [16, 16, 0] }, { origin: [-8, 0, -8], size: [0, 16, 16] }, { origin: [-8, 0, 8], size: [16, 16, 0] }, { origin: [8, 0, -8], size: [0, 16, 16] }),
};

const plants = {
    "fb:wall_block_2": {
        value: "wall_tiles_red",
        sound: "block.lantern.break",
    },
    "fb:wall_block_1": {
        value: "wall_tiles_black",
        sound: "block.lantern.break",
    },
    "fb:wall_middle_purple": {
        value: "wall_tiles_purple",
        sound: "block.lantern.break",
    },
    "fb:wall_block_3": {
        value: "wall",
        sound: "block.lantern.break",
    },
    "fb:wall_top_block_2": {
        value: "wall_tiles_red_top",
        sound: "block.lantern.break",
    },
    "fb:wall_down_block_3": {
        value: "wall_tiles",
        sound: "block.lantern.break",
    },
    "fb:wall_down_block_1": {
        value: "wall_down_block_black",
        sound: "block.lantern.break",
    },
    "fb:wall_top_block_1": {
        value: "wall_top_side",
        sound: "block.lantern.break",
    },
    "fb:stage_wall_down": {
        value: "stage_wall_down",
        sound: "block.lantern.break",
    },
    "fb:stage_wall_up": {
        value: "stage_wall_up",
        sound: "block.lantern.break",
    },
    "fb:stage_wall_2": {
        value: "stage_wall_2",
        sound: "block.lantern.break",
    },
    "fb:stage_wall_1": {
        value: "stage_wall_1",
        sound: "block.lantern.break",
    },
    "fb:wall_down_block_2": {
        value: "wall_down_block_2",
        sound: "block.lantern.break",
    },
};

const getAxis = (direction) => (direction === "west" || direction === "east" ? "z" : "x");

function getSelectedwalls(block, faceLocation) {
    const direction = block.permutation.getState("minecraft:cardinal_direction");
    const axis = getAxis(direction);

    return wallss[axis].getSelected(faceLocation);
}

const iswallsOccupied = (block, walls) => block.permutation.getState(`fbd:walls_${walls}_plant`) !== "none";

const setwallsPlant = (block, walls, plant) =>
    block.setPermutation(block.permutation.withState(`fbd:walls_${walls}_plant`, plant));

const DoubleFlowerwallsBlockComponent = {
    onPlayerInteract(event) {
        const { block, dimension, faceLocation, player } = event;
        if (!player) return;

        const equippable = player.getComponent("minecraft:equippable");
        if (!equippable) return;

        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

        const relativeFaceLocation = {
            x: faceLocation.x - block.location.x,
            y: faceLocation.y - block.location.y,
            z: faceLocation.z - block.location.z,
        };

        const selectedwalls = getSelectedwalls(block, relativeFaceLocation);
        if (selectedwalls === undefined) return;

        if (mainhand.hasItem() && !iswallsOccupied(block, selectedwalls)) {
            const plant = plants[mainhand.typeId];
            if (!plant) return;

            if (player.getGameMode() !== GameMode.creative) {
                if (mainhand.amount > 1) mainhand.amount--;
                else mainhand.setItem(undefined);
            }

            setwallsPlant(block, selectedwalls, plant.value);
            dimension.playSound(plant.sound, block.center(), { volume: 0.5 });
        } else if (!mainhand.hasItem() && iswallsOccupied(block, selectedwalls)) {
            const plantValue = block.permutation.getState(`fbd:walls_${selectedwalls}_plant`);
            const plantId = Object.keys(plants).find((key) => plants[key].value === plantValue);

            setwallsPlant(block, selectedwalls, "none");
            dimension.playSound("random.pop", block.center());

            mainhand.setItem(new ItemStack(plantId));
        }
    },
    onPlayerDestroy: releasePlants,
};

world.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("fbd:advanced_wall_fnaf1", DoubleFlowerwallsBlockComponent);
});

function releasePlants({ block, destroyedBlockPermutation, dimension }) {
    const states = destroyedBlockPermutation.getAllStates();

    const storedPlants = Object.entries(states)
        .filter(([state, value]) => state.startsWith("fbd:walls") && value !== "none")
        .map(([state, value]) => value);

    if (storedPlants.length === 0) return;

    for (const plant of storedPlants) {
        const plantId = Object.keys(plants).find((key) => plants[key].value === plant);

        dimension.spawnItem(new ItemStack(plantId), block.center());
    }
}
