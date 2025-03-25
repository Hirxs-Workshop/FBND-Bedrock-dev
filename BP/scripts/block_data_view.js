import { world, system, Player } from "@minecraft/server";
system.runInterval(
	() => {
		const players = world.getAllPlayers();
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			try {
				const { block, face } = player.getBlockFromViewDirection();
				if (!block) {
					player.onScreenDisplay.setActionBar( "" );
					return;
				};
				
				player.onScreenDisplay.setActionBar(
					`§rblock: §a${block.typeId}§r, face: §7${face}§r, xyz: §7${block.location.x}§r, §7${block.location.y}§r, §7${block.location.z}§r \n`
					+ `data: §e${JSON.stringify(block.permutation.getAllStates(), null, 4)}`
				);
			} catch {
				player.onScreenDisplay.setActionBar( "" );
			};
		};
	},
);