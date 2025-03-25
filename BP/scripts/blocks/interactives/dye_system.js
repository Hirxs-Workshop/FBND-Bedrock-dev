import {
  world,
  BlockPermutation,
  ItemStack,
  system
} from '@minecraft/server';

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbnd:color_n_entity', {
    onPlayerInteract: e => {
      const { player, block } = e;
      const equipment = player.getComponent('equippable');
      const selectedItem = equipment.getEquipment('Mainhand');

      const dyeToStateMap = {
        "minecraft:white_dye": 0,
        "minecraft:orange_dye": 1,
        "minecraft:magenta_dye": 2,
        "minecraft:light_blue_dye": 3,
        "minecraft:yellow_dye": 4,
        "minecraft:lime_dye": 5,
        "minecraft:pink_dye": 6,
        "minecraft:gray_dye": 7,
        "minecraft:light_gray_dye": 8,
        "minecraft:cyan_dye": 9,
        "minecraft:purple_dye": 10,
        "minecraft:blue_dye": 11,
        "minecraft:brown_dye": 12,
        "minecraft:green_dye": 13,
        "minecraft:red_dye": 14,
        "minecraft:black_dye": 15
      };

      if (selectedItem && (selectedItem.typeId === 'fb:changer_tool_item')) {
        const permutation = block.permutation;
        const newMode = permutation.getState('ef:mode') === 0 ? 1 : 0;
        block.setPermutation(permutation.withState('ef:mode', newMode));
        player.sendMessage(`§6Mode: ${newMode === 0 ? 'Main' : 'Lines'}`);
        player.playSound('random.orb');
        return;
      }

      if (selectedItem && dyeToStateMap.hasOwnProperty(selectedItem.typeId)) {
        const permutation = block.permutation;
        const currentMode = permutation.getState('ef:mode');
        const targetState = currentMode === 0 ? 'ef:colors' : 'ef:lines_colors';
        const currentColor = permutation.getState(targetState);
        const newColor = dyeToStateMap[selectedItem.typeId];

        if (currentColor !== 0 && newColor !== 0) {
          player.sendMessage('§4(!) §cIt looks like the block already has a color assigned, paint it white again!');
          player.playSound('note.bass');
          return;
        }

        block.setPermutation(permutation.withState(targetState, newColor));
        player.playSound(newColor === 0 ? 'random.orb' : 'random.pop');
      }
    }
  });



  initEvent.blockComponentRegistry.registerCustomComponent('fbd:seat_function', {
    onPlayerInteract: function (e) {
      const equippable = e.player.getComponent("equippable");
      const itemSeleccionado = equippable ? equippable.getEquipment("Mainhand") : null;
      if (itemSeleccionado && itemSeleccionado.typeId.endsWith("_dye")) {
        return;
      }

      if (itemSeleccionado && itemSeleccionado.typeId.endsWith("_tool_item")) {
        return;
      }

      const { x, y, z } = e.block.location;
      if (e.player.isSneaking) return;
      let blockStr = e.block.x + " " + e.block.y + " " + e.block.z;
      e.dimension.runCommand("summon fbd:seat " + blockStr);
      e.dimension.runCommand("execute as @e[type=fbd:seat,c=1] run tp @s " + blockStr + " facing @p");
      e.player.runCommand(`execute at @e[type=player] positioned ${x} ${y} ${z} run ride @s start_riding @e[type=fbd:seat,c=1] teleport_rider`);
    },
    onPlayerDestroy: function (e) {
      if (!e.player) return;
      let playerLoc = e.player.location;
      playerLoc.x -= 0.5;
      playerLoc.z -= 0.5;

      if (playerLoc.x !== e.block.location.x) return;
      if (playerLoc.y !== e.block.location.y) return;
      if (playerLoc.z !== e.block.location.z) return;

      e.player.runCommand("ride @s stop_riding");
    },
    onPlace: function (e) {
      if (!e.block) return;
      let block = e.block.above();
      if (!block) return;
    }
  });
});
