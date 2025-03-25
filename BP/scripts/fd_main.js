import { world, ItemStack, system } from "@minecraft/server";

// Stable
import "./blocks/interactives/fbd_core" // Main
import "./blocks/interactives/items_functions"
import "./blocks/interactives/spotlight_colors"

// Stable Doors
import "./blocks/interactives/doors/black_door"
import "./blocks/interactives/doors/bathroom_door"
import "./blocks/interactives/doors/movie_backstage_door"
import "./blocks/interactives/doors/red_door"

// Stable Advanced
import "./blocks/connectables/tables_function"
import "./blocks/connectables/celebrate_fun_connectable"
import "./blocks/connectables/office_desk_connectable"
import "./blocks/connectables/stage_sun_connectable"
import "./blocks/connectables/office_desk_single_connectable"
import "./blocks/connectables/block_stairs"
import "./blocks/connectables/dynamic_booth_connect"

// Experimental
import "./blocks/interactives/electric_system"

// import "block_data_view"
import "./blocks/interactives/dye_system"



import { fbnd_booths } from './blocks/connectables/dynamic_booth_connect';

system.beforeEvents.startup.subscribe((e) => {
	e.blockComponentRegistry.registerCustomComponent("fbnd:connection_sides", new fbnd_booths());
});
world.afterEvents.playerPlaceBlock.subscribe((e) => {
	const { block } = e;
	try {
		if (shouldBlockConnect(block)) {
			updateAdjacentBlocks(block, true);
		}
	} catch (error) {
		return;
	}
});