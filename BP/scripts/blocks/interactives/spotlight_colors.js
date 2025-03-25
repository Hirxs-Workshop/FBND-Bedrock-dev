import { world, system } from '@minecraft/server';

const directionMapping = {
  south: "0 0",
  east: "-90 0",
  west: "90 0",
  north: "180 0"
};

const runColors = (e, permutationKey, eventMapping, updateState = false) => {
  const { block, player } = e;

  if (updateState) {
    const equipment = player.getComponent('equippable');
    const selectedItem = equipment.getEquipment('Mainhand');
    if (!selectedItem || selectedItem.typeId !== 'fb:changer_tool_item') return;
  }
  const { x, y, z } = block.location;
  const state = block.permutation.getState(permutationKey);
  const commandSuffix = eventMapping[state];
  if (commandSuffix) {
    if (updateState) {
      block.setPermutation(block.permutation.withState(permutationKey, state + 1));
    }
    block.dimension.runCommandAsync(
      `execute positioned ${x} ${y} ${z} run event entity @e[r=0.5] ${commandSuffix}`
    );
  }
};

const runDirection = (e, entity) => {
  const { block } = e;
  const { x, y, z } = block.location;
  const rotation = directionMapping[block.permutation.getState("minecraft:cardinal_direction")];
  if (rotation) {
    block.dimension.runCommandAsync(`summon ${entity} ${x} ${y} ${z} ${rotation}`);
  }
};

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:silver_spotlight_ray_colors_change', {
    onPlayerInteract: e => runColors(e, "light:colors", {
      0: "fb:color_blue",
      1: "fb:color_red",
      2: "fb:color_green",
      3: "fb:color_pink",
      4: "fb:color_default"
    }, true),
    onPlace: e => runColors(e, "light:colors", {
      1: "fb:color_red",
      2: "fb:color_green",
      3: "fb:color_pink",
      4: "fb:color_default"
    })
  });

  initEvent.blockComponentRegistry.registerCustomComponent('fbd:spotlight_ray_colors_change', {
    onPlayerInteract: e => runColors(e, "light:colors", {
      0: "fb:color_blue",
      1: "fb:color_red",
      2: "fb:color_purple",
      3: "fb:color_orange",
      4: "fb:color_green",
      5: "fb:color_default"
    }, true),
    onPlace: e => runColors(e, "light:colors", {
      1: "fb:color_red",
      2: "fb:color_purple",
      3: "fb:color_orange",
      4: "fb:color_green",
      5: "fb:color_default"
    })
  });

  initEvent.blockComponentRegistry.registerCustomComponent('fbd:neon_place_sign_entity', {
    onPlayerInteract: e => runColors(e, "fbnd:neon_colors", {
      0: "fbnd:neon_color_green",
      1: "fbnd:neon_color_yellow",
      2: "fbnd:neon_color_blue",
      3: "fbnd:neon_color_magenta",
      4: "fbnd:neon_color_purple",
      5: "fbnd:neon_color_default"
    }, true),
    onPlace: e => runDirection(e, "fd:arcade_neon_sign_entity")
  });

  initEvent.blockComponentRegistry.registerCustomComponent('fbd:neon_place_entity', {
    onPlayerInteract: e => runColors(e, "fbnd:neon_colors", {
      0: "fbnd:neon_color_green",
      1: "fbnd:neon_color_yellow",
      2: "fbnd:neon_color_blue",
      3: "fbnd:neon_color_magenta",
      4: "fbnd:neon_color_purple",
      5: "fbnd:neon_color_default"
    }, true),
    onPlace: e => runDirection(e, "fd:small_neon_line_entity")
  });
});
