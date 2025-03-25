function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class ElectricSystemFBD {
  async onPlace(e) {
    const { block } = e;
    const { x, y, z } = block.location;

    if (block.hasTag('electric_on')) {
      const commands = [
        `fill ${x + 1} ${y - 1} ${z} ${x - 1} ${y + 1} ${z} fb:electric_wires_on[] replace fb:electric_wires_off`,
        `fill ${x} ${y - 1} ${z + 1} ${x} ${y + 1} ${z - 1} fb:electric_wires_on[] replace fb:electric_wires_off`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:lever_wires["minecraft:cardinal_direction"="south"] replace fb:lever_wires_off["minecraft:cardinal_direction"="south"]`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:lever_wires["minecraft:cardinal_direction"="north"] replace fb:lever_wires_off["minecraft:cardinal_direction"="north"]`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:lever_wires["minecraft:cardinal_direction"="east"] replace fb:lever_wires_off["minecraft:cardinal_direction"="east"]`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:lever_wires["minecraft:cardinal_direction"="west"] replace fb:lever_wires_off["minecraft:cardinal_direction"="west"]`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:electric_block_on[] replace fb:electric_block_off`,
        `fill ${x} ${y - 1} ${z} ${x} ${y - 2} ${z} fb:ceiling_large_light["minecraft:cardinal_direction"="south"] replace fb:ceiling_large_light_off["minecraft:cardinal_direction"="south"]`,
        `fill ${x} ${y - 1} ${z} ${x} ${y - 2} ${z} fb:ceiling_large_light["minecraft:cardinal_direction"="north"] replace fb:ceiling_large_light_off["minecraft:cardinal_direction"="north"]`,
        `fill ${x} ${y - 1} ${z} ${x} ${y - 2} ${z} fb:ceiling_large_light["minecraft:cardinal_direction"="west"] replace fb:ceiling_large_light_off["minecraft:cardinal_direction"="west"]`,
        `fill ${x} ${y - 1} ${z} ${x} ${y - 2} ${z} fb:ceiling_large_light["minecraft:cardinal_direction"="east"] replace fb:ceiling_large_light_off["minecraft:cardinal_direction"="east"]`,
        `fill ${x} ${y} ${z} ${x} ${y - 2} ${z} fb:light_2["p:is_lit"=1] replace fb:light_2["p:is_lit"=0]`,
        `fill ${x} ${y} ${z} ${x} ${y - 2} ${z} fb:roof_light_on [] replace fb:roof_light_off`,
        `fill ${x} ${y} ${z} ${x} ${y - 2} ${z} fb:roof_light_on [] replace fb:roof_light_off`,
        `fill ${x} ${y} ${z} ${x} ${y - 2} ${z} fb:light_on [] replace fb:light_off`
      ];
      for (const cmd of commands) {
        await block.dimension.runCommandAsync(cmd);
      }
    }
    if (block.hasTag('electric_off')) {
      const commands = [
        `fill ${x + 1} ${y - 1} ${z} ${x - 1} ${y + 1} ${z} fb:electric_wires_off[] replace fb:electric_wires_on`,
        `fill ${x} ${y - 1} ${z + 1} ${x} ${y + 1} ${z - 1} fb:electric_wires_off[] replace fb:electric_wires_on`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:electric_block_off[] replace fb:electric_block_on`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:lever_wires_off["minecraft:cardinal_direction"="south"] replace fb:lever_wires["minecraft:cardinal_direction"="south"]`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:lever_wires_off["minecraft:cardinal_direction"="north"] replace fb:lever_wires["minecraft:cardinal_direction"="north"]`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:lever_wires_off["minecraft:cardinal_direction"="east"] replace fb:lever_wires["minecraft:cardinal_direction"="east"]`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:lever_wires_off["minecraft:cardinal_direction"="west"] replace fb:lever_wires["minecraft:cardinal_direction"="west"]`,
        `fill ${x} ${y - 1} ${z} ${x} ${y - 2} ${z} fb:ceiling_large_light_off["minecraft:cardinal_direction"="south"] replace fb:ceiling_large_light["minecraft:cardinal_direction"="south"]`,
        `fill ${x} ${y - 1} ${z} ${x} ${y - 2} ${z} fb:ceiling_large_light_off["minecraft:cardinal_direction"="north"] replace fb:ceiling_large_light["minecraft:cardinal_direction"="north"]`,
        `fill ${x} ${y - 1} ${z} ${x} ${y - 2} ${z} fb:ceiling_large_light_off["minecraft:cardinal_direction"="west"] replace fb:ceiling_large_light["minecraft:cardinal_direction"="west"]`,
        `fill ${x} ${y - 1} ${z} ${x} ${y - 2} ${z} fb:ceiling_large_light_off["minecraft:cardinal_direction"="east"] replace fb:ceiling_large_light["minecraft:cardinal_direction"="east"]`,
        `fill ${x} ${y} ${z} ${x} ${y - 2} ${z} fb:light_off [] replace fb:light_on`,
        `fill ${x} ${y} ${z} ${x} ${y - 2} ${z} fb:roof_light_off [] replace fb:roof_light_on`,
        `fill ${x} ${y} ${z} ${x} ${y - 2} ${z} fb:light_2["p:is_lit"=0] replace fb:light_2["p:is_lit"=1]`
      ];
      for (const cmd of commands) {
        await block.dimension.runCommandAsync(cmd);
      }
    }
  }

  async onPlayerInteract(e) {
    const { block, player } = e;
    const { x, y, z } = block.location;

    if (block.permutation.getState("fb:block_status") === 1) {
      const commands = [
        `fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires_off["minecraft:cardinal_direction"="south"] replace fb:lever_wires["minecraft:cardinal_direction"="south"]`,
        `fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires_off["minecraft:cardinal_direction"="north"] replace fb:lever_wires["minecraft:cardinal_direction"="north"]`,
        `fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires_off["minecraft:cardinal_direction"="east"] replace fb:lever_wires["minecraft:cardinal_direction"="east"]`,
        `fill ${x} ${y + 1} ${z} ${x} ${y - 1} ${z} fb:lever_wires_off["minecraft:cardinal_direction"="west"] replace fb:lever_wires["minecraft:cardinal_direction"="west"]`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:electric_block_off[] replace fb:electric_block_on`
      ];
      for (const cmd of commands) {
        await block.dimension.runCommandAsync(cmd);
      }
      await player.runCommandAsync('title @s actionbar §2WARNING! §cWait for all the lights/wires to turn (off) correctly');
      return;
    }
    if (block.permutation.getState("fb:block_status") === 2) {
      const commands = [
        `fill ${x} ${y + 1} ${z} ${x} ${y - 2} ${z} fb:lever_wires["minecraft:cardinal_direction"="south"] replace fb:lever_wires_off["minecraft:cardinal_direction"="south"]`,
        `fill ${x} ${y + 1} ${z} ${x} ${y - 2} ${z} fb:lever_wires["minecraft:cardinal_direction"="north"] replace fb:lever_wires_off["minecraft:cardinal_direction"="north"]`,
        `fill ${x} ${y + 1} ${z} ${x} ${y - 2} ${z} fb:lever_wires["minecraft:cardinal_direction"="east"] replace fb:lever_wires_off["minecraft:cardinal_direction"="east"]`,
        `fill ${x} ${y + 1} ${z} ${x} ${y - 2} ${z} fb:lever_wires["minecraft:cardinal_direction"="west"] replace fb:lever_wires_off["minecraft:cardinal_direction"="west"]`,
        `fill ${x + 1} ${y + 1} ${z - 1} ${x - 1} ${y - 1} ${z + 1} fb:electric_block_on[] replace fb:electric_block_off`
      ];
      for (const cmd of commands) {
        await block.dimension.runCommandAsync(cmd);
      }
      await player.runCommandAsync('title @s actionbar §2WARNING! §cWait for all the lights/wires to turn (on) correctly');
      return;
    }
  }
}
