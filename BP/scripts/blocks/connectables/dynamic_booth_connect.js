import { rightBlockLocation, leftBlockLocation, frontBlockLocation } from '../fbnd_booths';

export class fbnd_booths {
	onPlace(e) {
		const { block } = e;
		const direction = block.permutation.getState("minecraft:cardinal_direction");
		const rightBlock = block.offset(rightBlockLocation[direction]);
		const leftBlock = block.offset(leftBlockLocation[direction]);
		const frontBlock = block.offset(frontBlockLocation[direction]);
		updateSofa(block);
		if (rightBlock.typeId === block.typeId) {
			updateSofa(rightBlock);
		}
		if (leftBlock.typeId === block.typeId) {
			updateSofa(leftBlock);
		}
		if (frontBlock.typeId === block.typeId) {
			updateSofa(frontBlock);
		}
	}
	onPlayerDestroy(e) {
		const { block, destroyedBlockPermutation } = e;
		const direction = destroyedBlockPermutation.getState("minecraft:cardinal_direction");
		const rightBlock = block.offset(rightBlockLocation[direction]);
		const leftBlock = block.offset(leftBlockLocation[direction]);
		const frontBlock = block.offset(frontBlockLocation[direction]);
		if (rightBlock.typeId === destroyedBlockPermutation.type.id) {
			updateSofa(rightBlock);
		}
		if (leftBlock.typeId === destroyedBlockPermutation.type.id) {
			updateSofa(leftBlock);
		}
		if (frontBlock.typeId === destroyedBlockPermutation.type.id) {
			updateSofa(frontBlock);
		}
	}
}
function updateSofa(block) {
	const direction = block.permutation.getState("minecraft:cardinal_direction");
	const rightBlockProperties = {
		"north": {location : {x: 1, y: 0, z: 0}, allow: "east"},
		"south": {location : {x: -1, y: 0, z: 0}, allow: "west"},
		"west": {location : {x: 0, y: 0, z: -1}, allow: "north"},
		"east": {location : {x: 0, y: 0, z: 1}, allow: "south"}
	}
	const leftBlockProperties = {
		"north": {location : {x: -1, y: 0, z: 0}, allow: "west"},
		"south": {location : {x: 1, y: 0, z: 0}, allow: "east"},
		"west": {location : {x: 0, y: 0, z: 1}, allow: "south"},
		"east": {location : {x: 0, y: 0, z: -1}, allow: "north"}
	}
	const rightBlock = block.offset(rightBlockProperties[direction].location);
	const leftBlock = block.offset(leftBlockProperties[direction].location);
	const rightDirection = rightBlock.permutation.getState("minecraft:cardinal_direction");
	const leftDirection = leftBlock.permutation.getState("minecraft:cardinal_direction");
    const blockProperties = {
        "north": [
            { location: {x: -1, y: 0, z: 0}, requiredDirection: "north", check: {location: {x: 0, y: 0, z: 1}, direction: "east"} },
            { location: {x: 1, y: 0, z: 0}, requiredDirection: "north", check: {location: {x: 0, y: 0, z: 1}, direction: "west"} },
            { location: {x: -1, y: 0, z: 0}, requiredDirection: "north", check: {location: {x: 0, y: 0, z: -1}, direction: "west"} },
            { location: {x: 1, y: 0, z: 0}, requiredDirection: "north", check: {location: {x: 0, y: 0, z: -1}, direction: "east"} }
        ],
        "south": [
            { location: {x: 1, y: 0, z: 0}, requiredDirection: "south", check: {location: {x: 0, y: 0, z: -1}, direction: "west"} },
            { location: {x: -1, y: 0, z: 0}, requiredDirection: "south", check: {location: {x: 0, y: 0, z: -1}, direction: "east"} },
            { location: {x: 1, y: 0, z: 0}, requiredDirection: "south", check: {location: {x: 0, y: 0, z: 1}, direction: "east"} },
            { location: {x: -1, y: 0, z: 0}, requiredDirection: "south", check: {location: {x: 0, y: 0, z: 1}, direction: "west"} }
        ],
        "west": [
            { location: {x: 0, y: 0, z: -1}, requiredDirection: "west", check: {location: {x: 1, y: 0, z: 0}, direction: "south"} },
            { location: {x: 0, y: 0, z: 1}, requiredDirection: "west", check: {location: {x: 1, y: 0, z: 0}, direction: "north"} },
            { location: {x: 0, y: 0, z: -1}, requiredDirection: "west", check: {location: {x: -1, y: 0, z: 0}, direction: "north"} },
            { location: {x: 0, y: 0, z: 1}, requiredDirection: "west", check: {location: {x: -1, y: 0, z: 0}, direction: "south"} }
        ],
        "east": [
            { location: {x: 0, y: 0, z: 1}, requiredDirection: "east", check: {location: {x: -1, y: 0, z: 0}, direction: "north"} },
            { location: {x: 0, y: 0, z: -1}, requiredDirection: "east", check: {location: {x: -1, y: 0, z: 0}, direction: "south"} },
            { location: {x: 0, y: 0, z: 1}, requiredDirection: "east", check: {location: {x: 1, y: 0, z: 0}, direction: "south"} },
            { location: {x: 0, y: 0, z: -1}, requiredDirection: "east", check: {location: {x: 1, y: 0, z: 0}, direction: "north"} }
        ]
    };
	if (rightBlock.typeId === block.typeId && (rightDirection === direction || rightBlockProperties[direction].allow === rightDirection)) {
		block.setPermutation(block.permutation.withState("fbnd:right", 1));
	} else {
		block.setPermutation(block.permutation.withState("fbnd:right", 0));
	}
	if (leftBlock.typeId === block.typeId && (leftDirection === direction || leftBlockProperties[direction].allow === leftDirection)) {
		block.setPermutation(block.permutation.withState("fbnd:left", 1));
	} else {
		block.setPermutation(block.permutation.withState("fbnd:left", 0));
	}
	const properties = blockProperties[direction];
	let shouldSetPermutation = false;
	for (let i = 0; i < properties.length; i++) {
		const prop = properties[i];
		const targetBlock = block.offset(prop.location);
		const checkBlock = block.offset(prop.check.location);

		if (targetBlock.typeId === block.typeId &&
			targetBlock.permutation.getState("minecraft:cardinal_direction") === prop.requiredDirection &&
			checkBlock.permutation.getState("minecraft:cardinal_direction") === prop.check.direction) {
			shouldSetPermutation = true;
			break;
		}
	}
	if (shouldSetPermutation) {
		block.setPermutation(block.permutation.withState("fbnd:facing", 1));
	} else {
		block.setPermutation(block.permutation.withState("fbnd:facing", 0));
	}
}