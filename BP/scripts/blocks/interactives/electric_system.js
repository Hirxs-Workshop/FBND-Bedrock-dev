import { world, system, BlockPermutation, ItemStack } from '@minecraft/server'


system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:switch_cc', {
    onPlayerInteract: async e => {
      const { player, block } = e;
      const { x, y, z } = block.location;
      const fillBounds = `${x - 8} ${y - 2} ${z + 8} ${x + 8} ${y + 6} ${z - 8}`;
      const lever_on = block.permutation.withState("fb:block_status", 2);
      const lever_off = block.permutation.withState("fb:block_status", 1);
      if (block.permutation.getState("fb:block_status") === 1) {
        block.setPermutation(lever_on);
        await block.dimension.runCommand(`fill ${fillBounds} fb:light_off [] replace fb:light_on`);
        await block.dimension.runCommand(`fill ${fillBounds} fb:roof_light_off [] replace fb:roof_light_on`);
        await block.dimension.runCommand(`fill ${fillBounds} fb:ceiling_large_light_off [] replace fb:ceiling_large_light`);
        await block.dimension.runCommand(`fill ${fillBounds} fb:light_2["p:is_lit"=0] replace fb:light_2["p:is_lit"=1]`);
        player.playSound("random.click");
        return;
      }
      if (block.permutation.getState("fb:block_status") === 2) {
        block.setPermutation(lever_off);
        await block.dimension.runCommand(`fill ${fillBounds} fb:light_on [] replace fb:light_off`);
        await block.dimension.runCommand(`fill ${fillBounds} fb:roof_light_on [] replace fb:roof_light_off`);
        await block.dimension.runCommand(`fill ${fillBounds} fb:ceiling_large_light [] replace fb:ceiling_large_light_off`);
        await block.dimension.runCommand(`fill ${fillBounds} fb:light_2["p:is_lit"=1] replace fb:light_2["p:is_lit"=0]`);
        player.playSound("random.click");
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:office_light', {
    onPlayerInteract: async e => {
      const { player, block } = e;
      const { x, y, z } = block.location;
      const fillBounds = `${x - 8} ${y - 2} ${z + 8} ${x + 8} ${y + 6} ${z - 8}`;
      const lever_on = block.permutation.withState("fb:block_status", 2);
      const lever_off = block.permutation.withState("fb:block_status", 1);
      if (block.permutation.getState("fb:block_status") === 1) {
        block.setPermutation(lever_on);
        await block.dimension.runCommand(`fill ${fillBounds} fb:office_light[] replace fb:office_light_off`);
        player.playSound("random.click");
        return;
      }
      if (block.permutation.getState("fb:block_status") === 2) {
        block.setPermutation(lever_off);
        await block.dimension.runCommand(`fill ${fillBounds} fb:office_light_off[] replace fb:office_light`);
        player.playSound("random.click");
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:electric_system_reworked_vw', {
    onPlace: async e => {
      const { block } = e;
      const { x, y, z } = block.location;
      if (block.hasTag('electric_on')) {
        await block.dimension.runCommand(`fill ${x} ${y} ${z} ${x} ${y + 2} ${z} fb:electric_wires_on[] replace fb:electric_wires_off`);
        await block.dimension.runCommand(`fill ${x + 1} ${y - 1} ${z} ${x - 1} ${y} ${z} fb:electric_wires_on[] replace fb:electric_wires_off`);
        await block.dimension.runCommand(`fill ${x} ${y - 1} ${z + 1} ${x} ${y} ${z - 1} fb:electric_wires_on[] replace fb:electric_wires_off`);
        await block.dimension.runCommand(`fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires["minecraft:cardinal_direction"="south"] replace fb:lever_wires_off["minecraft:cardinal_direction"="south"]`);
        await block.dimension.runCommand(`fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires["minecraft:cardinal_direction"="north"] replace fb:lever_wires_off["minecraft:cardinal_direction"="north"]`);
        await block.dimension.runCommand(`fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires["minecraft:cardinal_direction"="east"] replace fb:lever_wires_off["minecraft:cardinal_direction"="east"]`);
        await block.dimension.runCommand(`fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires["minecraft:cardinal_direction"="west"] replace fb:lever_wires_off["minecraft:cardinal_direction"="west"]`);
        await block.dimension.runCommand(`fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:electric_block_on[] replace fb:electric_block_off`);
      }
      if (block.hasTag('electric_off')) {
        await block.dimension.runCommand(`fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:electric_block_off[] replace fb:electric_block_on`);
        await block.dimension.runCommand(`fill ${x + 1} ${y - 1} ${z} ${x - 1} ${y} ${z} fb:electric_wires_off[] replace fb:electric_wires_on`);
        await block.dimension.runCommand(`fill ${x} ${y - 1} ${z + 1} ${x} ${y} ${z - 1} fb:electric_wires_off[] replace fb:electric_wires_on`);
        await block.dimension.runCommand(`fill ${x} ${y} ${z} ${x} ${y + 2} ${z} fb:electric_wires_off[] replace fb:electric_wires_on`);
        await block.dimension.runCommand(`fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires_off["minecraft:cardinal_direction"="south"] replace fb:lever_wires["minecraft:cardinal_direction"="south"]`);
        await block.dimension.runCommand(`fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires_off["minecraft:cardinal_direction"="north"] replace fb:lever_wires["minecraft:cardinal_direction"="north"]`);
        await block.dimension.runCommand(`fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires_off["minecraft:cardinal_direction"="east"] replace fb:lever_wires["minecraft:cardinal_direction"="east"]`);
        await block.dimension.runCommand(`fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires_off["minecraft:cardinal_direction"="west"] replace fb:lever_wires["minecraft:cardinal_direction"="west"]`);
      }
    }
  });
});
