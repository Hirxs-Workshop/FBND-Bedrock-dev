import {
  world,
  BlockPermutation,
  ItemStack, system
} from '@minecraft/server'
import { ElectricSystemFBD } from './electric/wires';

system.beforeEvents.startup.subscribe((e) => {
  e.blockComponentRegistry.registerCustomComponent("fbd:electric_system_reworked", new ElectricSystemFBD());
});


system.beforeEvents.startup.subscribe(function (initEvent) {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:seat_function_pizzeria', {
    onPlayerInteract: function (e) {
      let {
        x,
        y,
        z
      } = e.block.location;
      if (e.player.isSneaking) return;
      let blockStr = e.block.x + " " + e.block.y + " " + e.block.z;
      e.dimension.runCommand("summon fbd:seat_2 " + blockStr);
      e.dimension.runCommand("execute as @e[type=fbd:seat_2,c=1] run tp @s " + blockStr + " facing @p");
      e.dimension.runCommand(`execute at @e[type=player] positioned ${x} ${y} ${z} run ride @s start_riding @e[type=fbd:seat_2,c=1] teleport_rider`);
    },
    onPlayerDestroy: function (e) {
      if (!e.player) return;
      let playerLoc = e.player.location;
      playerLoc.x -= 0.5;
      playerLoc.z -= 0.5;

      if (playerLoc.x != e.block.location.x) return;
      if (playerLoc.y != e.block.location.y) return;
      if (playerLoc.z != e.block.location.z) return;

      e.player.runCommand("ride @s stop_riding");
    },
    onPlace: function (e) {
      if (!e.block) return;
      let block = e.block.above();
      if (!block) return;
    }
  });
});


system.beforeEvents.startup.subscribe((initEvent) => {
  initEvent.blockComponentRegistry.registerCustomComponent("fbd:clock_sound", {
    onTick: (event) => {
      const {
        player,
        block
      } = event;
      let {
        x,
        y,
        z
      } = event.block.location;
      block.dimension.runCommand(`execute at @e[type=player] positioned ${x} ${y} ${z} run playsound fb.clock_ticking @a[r=16] ~ ~ ~ 100 1 1`);
    }
  });
});

system.beforeEvents.startup.subscribe((initEvent) => {
  initEvent.blockComponentRegistry.registerCustomComponent("fbd:fan_sound", {
    onTick: (event) => {
      const {
        player,
        block
      } = event;
      let {
        x,
        y,
        z
      } = event.block.location;
      block.dimension.runCommand(`execute at @e[type=player] positioned ${x} ${y} ${z} run playsound fb:fan @a[r=16] ~ ~ ~ 5 1 1`);
    }
  });
});

system.beforeEvents.startup.subscribe((initEvent) => {
  initEvent.blockComponentRegistry.registerCustomComponent("fbd:changer_tool_tip", {
    onTick: (event) => {
      const {
        player,
        block
      } = event;
      let {
        x,
        y,
        z
      } = event.block.location;
      if (block.permutation.getState("p:changer") === 0) {
        block.dimension.spawnParticle("fb:changer_2", {
          x: block.location.x + 0.5,
          y: block.location.y + 0.5,
          z: block.location.z + 0.5
        });
        block.dimension.spawnParticle("fb:changertool", {
          x: block.location.x + 0.5,
          y: block.location.y + 0.5,
          z: block.location.z + 0.5
        });
        block.dimension.runCommand(`title @p actionbar §3[INFO] §bYou need to crouch to be able to change the variant`);
      }

    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:add_coins', {
    onPlayerInteract: e => {
      const {
        player,
        block
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const coins_add = e.block.permutation.getState("p:coins");
      const coins = block.permutation.withState("p:coins", coins_add + 1);
      const equipment = player.getComponent('equippable');
      const selectedItem = equipment.getEquipment('Mainhand');
      if (selectedItem && (selectedItem.typeId === 'fb:faz_coin_item') && block.permutation.getState("p:coins") < 3) {
        player.playSound("use.candle");
        block.setPermutation(coins);
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:items_place', {
    onPlayerInteract: e => {
      const {
        player,
        block
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const equipment = player.getComponent('equippable');
      const selectedItem = equipment.getEquipment('Mainhand');
      const pizza_slice = block.permutation.withState("fd:item", 1);
      const pizza_slice_2 = block.permutation.withState("fd:item", 2);
      const cake_slice = block.permutation.withState("fd:item", 3);
      const remove_item = block.permutation.withState("fd:item", 0);
      const get_pizza_slice = new ItemStack("fb:pizza_slice_item");
      const get_pizza_slice_2 = new ItemStack("fb:pizza_2_slice_item");
      const get_cake_slice = new ItemStack("fb:cake_slice_item");
      if (selectedItem && (selectedItem.typeId === 'fb:pizza_slice_item') && block.permutation.getState("fd:item") === 0) {
        player.playSound("random.pop")
        block.setPermutation(pizza_slice);
        if (selectedItem.amount > 1) {
          selectedItem.amount -= 1;
          equipment.setEquipment('Mainhand', selectedItem);
        } else {
          equipment.setEquipment('Mainhand', undefined);
        }
        return;

      }
      if (selectedItem && (selectedItem.typeId === 'fb:pizza_2_slice_item') && block.permutation.getState("fd:item") === 0) {
        player.playSound("random.pop")
        block.setPermutation(pizza_slice_2);
        if (selectedItem.amount > 1) {
          selectedItem.amount -= 1;
          equipment.setEquipment('Mainhand', selectedItem);
        } else {
          equipment.setEquipment('Mainhand', undefined);
        }
        return;

      }
      if (selectedItem && (selectedItem.typeId === 'fb:cake_slice_item') && block.permutation.getState("fd:item") === 0) {
        player.playSound("random.pop")
        block.setPermutation(cake_slice);
        if (selectedItem.amount > 1) {
          selectedItem.amount -= 1;
          equipment.setEquipment('Mainhand', selectedItem);
        } else {
          equipment.setEquipment('Mainhand', undefined);
        }
        return;

      }
      if (block.permutation.getState("fd:item") === 1) {
        player.playSound("random.pop2")
        block.setPermutation(remove_item);
        block.dimension.spawnItem(get_pizza_slice, { x: block.location.x + 0.5, y: block.location.y + 1, z: block.location.z + 0.5 });
        return;

      }
      if (block.permutation.getState("fd:item") === 2) {
        player.playSound("random.pop2")
        block.setPermutation(remove_item);
        block.dimension.spawnItem(get_pizza_slice_2, { x: block.location.x + 0.5, y: block.location.y + 1, z: block.location.z + 0.5 });
        return;

      }
      if (block.permutation.getState("fd:item") === 3) {
        player.playSound("random.pop2")
        block.setPermutation(remove_item);
        block.dimension.spawnItem(get_cake_slice, { x: block.location.x + 0.5, y: block.location.y + 1, z: block.location.z + 0.5 });
        return;

      }

    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:soda_machine', {
    onPlayerInteract: e => {
      const {
        player,
        block
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const equipment = player.getComponent('equippable');
      const selectedItem = equipment.getEquipment('Mainhand');
      const updates = e.block.permutation.getState("fbd:sodas");
      const update = block.permutation.withState("fbd:sodas", updates + 1);
      const butter_soda_get = new ItemStack("fd:butter_soda_item");
      const foxys_fruity_cove_coole_hw_get = new ItemStack("fd:foxys_fruity_cove_coole_hw_item");
      const exotic_beverage_soda_get = new ItemStack("fd:exotic_beverage_item");
      if (player.isSneaking) {
        block.setPermutation(update);
        player.playSound("fb.selection_machine")
        return;
      }
      if (selectedItem && (selectedItem.typeId === 'fb:faz_coin_item') && block.permutation.getState("fbd:sodas") === 1) {
        player.playSound("fb.coins")
        player.playSound("fb.soda_dispenser")
        block.dimension.spawnItem(butter_soda_get, { x: block.location.x + 0.5, y: block.location.y + 1, z: block.location.z + 0.5 });
        if (selectedItem.amount > 1) {
          selectedItem.amount -= 1;
          equipment.setEquipment('Mainhand', selectedItem);
        } else {
          equipment.setEquipment('Mainhand', undefined);
        }
        return;
      }
      if (selectedItem && (selectedItem.typeId === 'fb:faz_coin_item') && block.permutation.getState("fbd:sodas") === 2) {
        player.playSound("fb.coins")
        player.playSound("fb.soda_dispenser")
        block.dimension.spawnItem(exotic_beverage_soda_get, { x: block.location.x + 0.5, y: block.location.y + 1, z: block.location.z + 0.5 });

        if (selectedItem.amount > 1) {
          selectedItem.amount -= 1;
          equipment.setEquipment('Mainhand', selectedItem);
        } else {
          equipment.setEquipment('Mainhand', undefined);
        }
        return;
      }
      if (selectedItem && (selectedItem.typeId === 'fb:faz_coin_item') && block.permutation.getState("fbd:sodas") === 3) {
        player.playSound("fb.coins")
        player.playSound("fb.soda_dispenser")
        block.dimension.spawnItem(foxys_fruity_cove_coole_hw_get, { x: block.location.x + 0.5, y: block.location.y + 1, z: block.location.z + 0.5 });

        if (selectedItem.amount > 1) {
          selectedItem.amount -= 1;
          equipment.setEquipment('Mainhand', selectedItem);
        } else {
          equipment.setEquipment('Mainhand', undefined);
        }
        return;
      }

    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:door_function', {
    onPlayerInteract: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const open_block = block.permutation.withState("fb:block_status", 2);
      const close_block = block.permutation.withState("fb:block_status", 1);
      if (block.permutation.getState("fb:block_status") === 1) {
        block.dimension.runCommand(`execute at @e[type=fb:new_office_door] positioned ${x} ${y} ${z} run event entity @e[r=3] fb:closed_door_ex`);

        player.playSound("fb.office_door_button")
        block.setPermutation(open_block);

        return;

      }
      if (block.permutation.getState("fb:block_status") === 2) {

        block.dimension.runCommand(`execute positioned ${x} ${y} ${z} run event entity @e[r=3] fb:open_door_ex`);
        block.setPermutation(close_block);
        player.playSound("fb.office_door_button")
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:vent_open', {
    onPlayerInteract: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const open_block = block.permutation.withState("fb:block_status", 2);
      const close_block = block.permutation.withState("fb:block_status", 1);
      if (block.permutation.getState("fb:block_status") === 1) {
        player.playSound("open_trapdoor.copper")
        block.setPermutation(open_block);

        return;

      }
      if (block.permutation.getState("fb:block_status") === 2) {
        block.setPermutation(close_block);
        player.playSound("open_trapdoor.copper")
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:light_function', {
    onPlayerInteract: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      if (block.permutation.getState("fb:block_status") === 1) {
        block.dimension.runCommand(`fill ~-4 ~-2 ~4 ~4 ~7 ~-4 fb:office_light_off [] replace fb:office_light`);
        player.playSound("random.click")

        return;

      }
      if (block.permutation.getState("fb:block_status") === 2) {
        block.dimension.runCommand(`fill ~-4 ~-2 ~4 ~4 ~7 ~-4 fb:office_light [] replace fb:office_light_off`);
        player.playSound("random.click")

        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:vent_button', {
    onPlayerInteract: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z,
        r
      } = block.location;
      const lever_on = block.permutation.withState("fb:block_status", 2);
      const lever_off = block.permutation.withState("fb:block_status", 1);
      if (block.permutation.getState("fb:block_status") === 1) {
        block.setPermutation(lever_on);
        block.dimension.runCommand(`fill ${x - 6} ${y - 2} ${z + 6} ${x + 6} ${y + 6} ${z - 6} fb:vent_light_on[] replace fb:vent_light`);
        player.playSound("random.click")
        return;

      }
      if (block.permutation.getState("fb:block_status") === 2) {
        block.setPermutation(lever_off);
        block.dimension.runCommand(`fill ${x - 6} ${y - 2} ${z + 6} ${x + 6} ${y + 6} ${z - 6} fb:vent_light[] replace fb:vent_light_on`);
        player.playSound("random.click");
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:lamp_cc', {
    onTick: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      if (block.permutation.getState("p:is_lit") === 1) {
        block.dimension.spawnParticle("fbd:light_sparkle", { x: block.location.x + 0.5, y: block.location.y, z: block.location.z + 0.5 });
        block.dimension.spawnParticle("fbd:light_sparkle", { x: block.location.x + 0.5, y: block.location.y, z: block.location.z + 0.5 });
        return;
      }
    },
    onPlace: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      if (block.permutation.getState("p:is_lit") === 0) {
        block.dimension.runCommand(`execute at @e[type=fd:lamp_light_ray] positioned ${x} ${y} ${z} run event entity @e[r=0.5] destroy`);
        return;
      }
      if (block.permutation.getState("p:is_lit") === 1) {
        block.dimension.runCommand(`summon fd:lamp_light_ray ${x} ${y + 0.45} ${z}`);
        return;
      }
    },
    onPlayerDestroy: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      block.dimension.runCommand(`execute at @e[type=fd:lamp_light_ray] positioned ${x} ${y} ${z} run event entity @e[r=0.5] destroy`);
    },
    onPlayerInteract: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const off_lamp = block.permutation.withState("p:is_lit", 0);
      const on_lamp = block.permutation.withState("p:is_lit", 1);
      if (block.permutation.getState("p:is_lit") === 0) {
        block.dimension.runCommand(`summon fd:lamp_light_ray ${x} ${y + 0.45} ${z}`);
        player.playSound("random.click")
        block.setPermutation(on_lamp);
        return;
      }
      if (block.permutation.getState("p:is_lit") === 1) {
        block.dimension.runCommand(`execute at @e[type=fd:lamp_light_ray] positioned ${x} ${y} ${z} run event entity @e[r=0.5] destroy`);
        player.playSound("random.click")
        block.setPermutation(off_lamp);
        return;
      }
    },
    onStepOn: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const destroy_lamp = block.permutation.withState("p:is_lit", 2);
      if (block.permutation.getState("p:is_lit") === 1) {
        block.dimension.runCommand(`execute at @a positioned ${x} ${y} ${z} run playsound block.lantern.fall @e[r=7`);
        block.setPermutation(destroy_lamp);
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(eventData => {

  eventData.blockComponentRegistry.registerCustomComponent('fbd:lamp_tick', {
    onTick(e) {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const drestroyed_off = block.permutation.withState("p:is_lit", 3);
      const drestroyed_on = block.permutation.withState("p:is_lit", 2);
      if (block.permutation.getState("p:is_lit") === 2) {

        block.dimension.runCommand(`execute at @e[type=fd:lamp_light_ray] positioned ${x} ${y} ${z} run event entity @e[r=0.5] destroy`);
        block.setPermutation(drestroyed_off);
        return;
      }
      if (block.permutation.getState("p:is_lit") === 3) {
        block.dimension.runCommand(`summon fd:lamp_light_ray ${x} ${y + 0.45} ${z}`);
        block.setPermutation(drestroyed_on);
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(eventData => {

  eventData.blockComponentRegistry.registerCustomComponent('fbd:lightbulb_change', {
    onPlayerInteract: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const off_lamp = block.permutation.withState("fb:block_status", 1);
      const on_lamp = block.permutation.withState("fb:block_status", 2);
      if (block.permutation.getState("fb:block_status") === 1) {
        player.playSound("random.click")
        block.setPermutation(on_lamp);
        return;
      }
      if (block.permutation.getState("fb:block_status") === 2) {
        block.setPermutation(off_lamp);
        return;
      }
      if (block.permutation.getState("fb:block_status") === 3) {
        block.setPermutation(off_lamp);
        return;
      }
    },
    onTick(e) {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const drestroyed_off = block.permutation.withState("fb:block_status", 3);
      const drestroyed_on = block.permutation.withState("fb:block_status", 2);
      if (block.permutation.getState("fb:block_status") === 2) {
        block.setPermutation(drestroyed_off);
        return;
      }
      if (block.permutation.getState("fb:block_status") === 3) {
        block.setPermutation(drestroyed_on);
        return;
      }
    }
  });
});

function createOnPlace(entityName) {
  return e => {
    const { block } = e;
    const { x, y, z } = block.location;
    const angles = [180, 200, 225, 250, 270, 290, 315, 335, 0, 25, 45, 70, 90, 115, 135, 160];
    const rotationState = block.permutation.getState("fb:rotation");
    const angle = angles[rotationState];
    block.dimension.runCommand(`summon ${entityName} ${x} ${y} ${z} ${angle} 0`);
  };
}

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:spotlight_ray', {
    onPlace: createOnPlace('fd:spotlight_ray_new')
  });
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:silver_spotlight_ray', {
    onPlace: createOnPlace('fd:silver_spotlight_ray')
  });
});



system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:fan_interactive', {
    onPlayerInteract: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z,
        r
      } = block.location;
      const fan_on = block.permutation.withState("fb:block_status", 2);
      const fan_off = block.permutation.withState("fb:block_status", 1);
      if (block.permutation.getState("fb:block_status") === 1) {
        block.setPermutation(fan_on);
        player.playSound("random.click")

        return;

      }
      if (block.permutation.getState("fb:block_status") === 2) {
        block.setPermutation(fan_off);
        player.playSound("random.click");
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:wall_light_cc', {
    onPlayerInteract: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z,
        r
      } = block.location;
      const wall_light_off = block.permutation.withState("p:changer", 1);
      const wall_light_on = block.permutation.withState("p:changer", 0);
      if (block.permutation.getState("p:changer") === 0) {
        block.setPermutation(wall_light_off);
        player.playSound("random.click")
        return;

      }
      if (block.permutation.getState("p:changer") === 1) {
        block.setPermutation(wall_light_on);
        player.playSound("random.click");
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:toilet_function', {
    onPlayerInteract: e => {
      const {
        player,
        block
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const toilet_open = block.permutation.withState("fbd:bathroom_vars", 1);
      const toilet_close = block.permutation.withState("fbd:bathroom_vars", 0);
      if (player.isSneaking && block.permutation.getState("fbd:bathroom_vars") === 0) {
        block.setPermutation(toilet_open);
        return;
      }
      if (player.isSneaking && block.permutation.getState("fbd:bathroom_vars") === 1) {
        block.setPermutation(toilet_close);
        player.playSound("fbd:toilet");
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:light_lever_interactive', {
    onPlayerInteract: e => {
      const {
        player,
        block,
        entity
      } = e;
      const {
        x,
        y,
        z,
        r
      } = block.location;
      const lever_on = block.permutation.withState("fb:block_status", 2);
      const lever_off = block.permutation.withState("fb:block_status", 1);
      if (block.permutation.getState("fb:block_status") === 1) {
        block.setPermutation(lever_on);
        player.playSound("block.lantern.fall")
        return;

      }
      if (block.permutation.getState("fb:block_status") === 2) {
        block.setPermutation(lever_off);
        player.playSound("block.lantern.fall");
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(eventData => {
  eventData.blockComponentRegistry.registerCustomComponent('fbd:emergency_light_switch', {
    onPlayerInteract(e) {
      const {
        player,
        block
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const emergency_light_on = block.permutation.withState("p:var", 1);
      const emergency_light_off = block.permutation.withState("p:var", 0);
      if (block.permutation.getState("p:var") === 0) {
        block.setPermutation(emergency_light_on);
        player.playSound("random.click")
        return;
      }
      if (block.permutation.getState("p:var") === 1) {
        block.setPermutation(emergency_light_off);
        player.playSound("random.click")
        return;
      }

    }
  });
});

system.beforeEvents.startup.subscribe(eventData => {
  eventData.blockComponentRegistry.registerCustomComponent('fbd:on_interact', {
    onPlayerInteract(e) {
      const {
        block,
        player,
        face
      } = e;

      const equipment = player.getComponent('equippable');

      const selectedItem = equipment.getEquipment('Mainhand');

      if (selectedItem?.typeId === block.typeId && !block.permutation.getState('fbd:double')) {
        const verticalHalf = block.permutation.getState('minecraft:vertical_half');
        const isBottomUp = verticalHalf === 'bottom' && face === 'Up';
        const isTopDown = verticalHalf === 'top' && face === 'Down';
        if (isBottomUp || isTopDown) {
          if (player.getGameMode() !== "creative") {
            if (selectedItem.amount > 1) {
              selectedItem.amount -= 1;
              equipment.setEquipment('Mainhand', selectedItem);
            } else if (selectedItem.amount === 1) {
              equipment.setEquipment('Mainhand', undefined);
            }
          }
          block.setPermutation(block.permutation.withState('fbd:double', true));
          block.setWaterlogged(false);
          player.playSound('use.stone');
        }
      }
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fb:plushy_sound_interaction', {
    onPlayerInteract: e => {
      const {
        player,
        block
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      if (!player.isSneaking) {
        player.playSound("fb:freddy_noze");
        block.dimension.spawnParticle("foxes:texture", {
          x: block.location.x + 0.5,
          y: block.location.y + 0.5,
          z: block.location.z + 0.5
        });
      }
      if (player.isSneaking) {
        player.playSound("random.fizz");
        block.dimension.spawnParticle("fb:smoke", {
          x: block.location.x + 0.5,
          y: block.location.y + 0.5,
          z: block.location.z + 0.5
        });
        block.dimension.runCommand(`setblock ${x} ${y} ${z} air[] destroy`);
      }

    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:cake_explode', {
    onPlayerInteract: e => {
      const {
        player,
        block
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      if (!player.isSneaking) {
        player.playSound("fb:freddy_noze");
        block.dimension.spawnParticle("fb:conteffi_rain", {
          x: block.location.x + 0.5,
          y: block.location.y + 0.5,
          z: block.location.z + 0.5
        });
      }
      if (player.isSneaking) {
        player.playSound("random.fizz");
        block.dimension.spawnParticle("fb:conteffi_rain", {
          x: block.location.x + 0.5,
          y: block.location.y + 0.5,
          z: block.location.z + 0.5
        });
        block.dimension.runCommand(`setblock ${x} ${y} ${z} air[] destroy`);
      }

    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fd:on_interact', {
      onPlayerInteract(e) {
          const { block, player } = e;
          const equipment = player.getComponent('equippable');
          const selectedItem = equipment.getEquipment('Mainhand');
          if (selectedItem && selectedItem.typeId === 'fb:ball_pit') {
              const permutation = block.permutation;
              const currentLayerLevel = permutation.getState('fd:layer_level');
              if (currentLayerLevel <= 6) {
                  e.cancel = true;
                  const newLayerLevel = currentLayerLevel + 1;

                  const newPermutation = permutation.withState('fd:layer_level', newLayerLevel);

                  block.setPermutation(newPermutation);

                  if (player.getGameMode() !== "creative") {
                      if (selectedItem.amount > 1) {
                          selectedItem.amount -= 1;
                          equipment.setEquipment('Mainhand', selectedItem);
                      } else {
                          equipment.setEquipment('Mainhand', undefined); 
                      }
                  }
              }
          }
      }
  });

  initEvent.blockComponentRegistry.registerCustomComponent('fb:arcade_room_sign_interactive', {
    onPlayerInteract: e => {
      const {
        player,
        block
      } = e;
      const {
        x,
        y,
        z
      } = block.location;
      const updates = e.block.permutation.getState("fb:sign_sype");
      const update = block.permutation.withState("fb:sign_sype", updates + 1);
      if (block.permutation.getState("fb:sign_sype") === 0) {
        player.playSound("random.click");
        player.runCommand('title @s actionbar §eArcade Sign on,the pattern is §7(Swivel)');
        block.setPermutation(update);
        return;
      }
      if (block.permutation.getState("fb:sign_sype") === 1) {
        player.playSound("random.click");
        player.runCommand('title @s actionbar §eArcade Sign on,the pattern is §7(Impulse)');
        block.setPermutation(update);
        return;
      }
      if (block.permutation.getState("fb:sign_sype") === 2) {
        player.playSound("random.click");
        player.runCommand('title @s actionbar §eThe sign was turned §7(Off)');
        block.setPermutation(update);
      }
    }
  });
});

function createPhoneOnInteract() {
  const actions = [
    { stopsound: "fb:phone5", playsound: "fb:phone1", title: "§7Connected... §l§q[Call Night 1]" },
    { stopsound: "fb:phone1", playsound: "fb:phone2", title: "§7Connected... §l§q[Call Night 2]" },
    { stopsound: "fb:phone2", playsound: "fb:phone3", title: "§7Connected... §l§q[Call Night 3]" },
    { stopsound: "fb:phone3", playsound: "fb:phone4", title: "§7Connected... §l§q[Call Night 4]" },
    { stopsound: "fb:phone4", playsound: "fb:phone5", title: "§7Connected... §l§k§q[Call Night 5]§r" },
    { stopsound: "fb:phone5", extraSound: "random.fizz", title: "§cWarning... §l§m[Call deactivated]" }
  ];

  return e => {
    const { player, block } = e;
    const { x, y, z } = block.location;
    const channel = block.permutation.getState("fb:channel");
    const update = block.permutation.withState("fb:channel", channel + 1);

    player.playSound("random.click");

    const action = actions[channel];
    if (action) {
      player.runCommand(`stopsound @a[r=15] ${action.stopsound}`);
      if (channel === 5 && action.extraSound) {
        player.playSound(action.extraSound);
      } else {
        player.playSound(action.playsound);
      }

      player.runCommand(`title @s actionbar ${action.title}`);
    }

    block.setPermutation(update);
  };
}

function createSongSelectorOnInteract() {
  const songs = [
    { music: "fb1",  title: "§7The speaker is playing... §l§f[FNAF 1 Song]" },
    { music: "fb2",  title: "§7The speaker is playing... §l§f[It's been so long]" },
    { music: "fb3",  title: "§7The speaker is playing... §l§f[Showtime]" },
    { music: "fb4",  title: "§7The speaker is playing... §l§f[Music Box 1]" },
    { music: "fb5",  title: "§7The speaker is playing... §l§f[Music Box 2]" },
    { music: "fb6",  title: "§7The speaker is playing... §l§f[Birthday]" },
    { music: "fb7",  title: "§7The speaker is playing... §l§f[Stage Performance]" },
    { music: "fb8",  title: "§7The speaker is playing... §l§f[I cant fix you]" },
    { music: "fb9",  title: "§7The speaker is playing... §l§f[Never be alone]" },
    { music: "fb10", title: "§7The speaker is playing... §l§f[Bad Ending FNAF 3]" },
    { music: "fb11", title: "§7The speaker is playing... §l§f[Creepin Towards The Door]" },
    { music: "fb12", title: "§7The speaker is playing... §l§f[Showcase Instrumental]" },
    { music: "fb13", title: "§7The speaker is playing... §l§f[Forgotten Notes]" }
  ];

  return e => {
    const { player, block } = e;
    const { x, y, z } = block.location;
    const state = block.permutation.getState("fbd:music");
    const update = block.permutation.withState("fbd:music", state + 1);

    if (state < songs.length) {
      const song = songs[state];
      player.runCommand('stopsound @a[r=15] fb5');
      player.runCommand(`music play ${song.music} 0.5 1 loop`);
      player.runCommand(`title @s actionbar ${song.title}`);
    } else if (state === songs.length) {
      player.playSound("random.click");
      player.runCommand('playsound random.fizz @a[r=15] ~~~ 40');
      player.runCommand('music stop 1');
      block.dimension.spawnParticle("fd:stage_notes_deny", {
        x: x + 0.5,
        y: y + 0.5,
        z: z + 0.5
      });
      player.runCommand('title @s actionbar §7The speakers were turned... §l§c[OFF]');
    }

    block.setPermutation(update);
  };
}

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:phone_function', {
    onPlayerInteract: createPhoneOnInteract()
  });

  initEvent.blockComponentRegistry.registerCustomComponent('fbd:song_selector', {
    onPlayerInteract: createSongSelectorOnInteract(),
    onPlayerDestroy: e => {
      const { player } = e;
      player.runCommand('music stop 1');
    }
  });
});


system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:notes', {
    onTick: (event) => {
      const {
        player,
        block
      } = event;
      let {
        x,
        y,
        z
      } = event.block.location;
      block.dimension.spawnParticle("fbd:note", {
        x: block.location.x + 0.5,
        y: block.location.y + 0.5,
        z: block.location.z + 0.5
      })
    }
  });
});

function createStarsChangeQuantityOnInteract() {
  return e => {
    const { player, block } = e;
    const equipment = player.getComponent('equippable');
    const selectedItem = equipment.getEquipment('Mainhand');
    const current = block.permutation.getState("fb:box");

    if (selectedItem && selectedItem.typeId === 'fb:stars_item') {
      let newState;
      if (current < 2) newState = 3;
      else if (current < 5) newState = 6;
      else if (current < 8) newState = 0;
      if (newState !== undefined) {
        block.setPermutation(block.permutation.withState("fb:box", newState));
        return;
      }
    }
    
    if (player.isSneaking) {
      const sneakMap = { 0: 1, 1: 2, 2: 0, 3: 4, 4: 5, 5: 3, 6: 7, 7: 8, 8: 6 };
      const newState = sneakMap[current];
      if (newState !== undefined) {
        block.setPermutation(block.permutation.withState("fb:box", newState));
        return;
      }
    }
  };
}

function createSodaRemoveOnInteract() {
  return e => {
    const { player, block } = e;
    const { x, y, z } = block.location;
    if (player.isSneaking) return;
    const sodaActions = [
      { tag: 'red_soda', item: new ItemStack("fb:soda_item") },
      { tag: 'blue_soda', item: new ItemStack("fb:blue_soda_item") },
      { tag: 'butter_soda', item: new ItemStack("fd:butter_soda_item") },
      { tag: 'foxys_fruity_cove_coole_hw', item: new ItemStack("fd:foxys_fruity_cove_coole_hw_item") },
      { tag: 'exotic_beverage', item: new ItemStack("fd:exotic_beverage_item") }
    ];
    
    for (const action of sodaActions) {
      if (block.hasTag(action.tag)) {
        player.playSound("break.big_dripleaf");
        block.dimension.spawnItem(action.item, {
          x: x + 0.5,
          y: y + 1,
          z: z + 0.5
        });
        block.dimension.runCommand(`setblock ${x} ${y} ${z} air[]`);
        block.dimension.spawnParticle("foxes:texture", {
          x: x + 0.5,
          y: y + 0.5,
          z: z + 0.5
        });
        return;
      }
    }
  };
}

function createPizzaBoxOnInteract(sliceItem) {
  return e => {
    const { player, block } = e;
    if (player.isSneaking) return;
    const { x, y, z } = block.location;
    const current = block.permutation.getState("fb:box");
    const newState = current + 1;
    block.setPermutation(block.permutation.withState("fb:box", newState));

    if (newState === 0) {
      player.playSound("random.pop2");
    } else if (newState === 1) {
      player.playSound("random.pop2");
      return;
    } else if (newState >= 2 && newState <= 5) {
      player.playSound("random.pop");
      block.dimension.spawnItem(new ItemStack(sliceItem), {
        x: x + 0.5,
        y: y + 1,
        z: z + 0.5
      });
    } else if (newState === 6) {
      player.playSound("random.fizz");
      block.dimension.spawnParticle("fb:smoke", {
        x: x + 0.5,
        y: y + 0.5,
        z: z + 0.5
      });
      block.dimension.runCommand(`setblock ${x} ${y} ${z} air[] destroy`);
    }
  };
}

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:stars_change_quantity', {
    onPlayerInteract: createStarsChangeQuantityOnInteract()
  });
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:soda_remove', {
    onPlayerInteract: createSodaRemoveOnInteract()
  });
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:pizza_box_cc', {
    onPlayerInteract: createPizzaBoxOnInteract("fb:pizza_slice_item")
  });
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:pizza_box_cc_2', {
    onPlayerInteract: createPizzaBoxOnInteract("fb:pizza_2_slice_item")
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:pizza_slice_remove', {
    onPlayerInteract: e => {
      const { player, block } = e;
      const { x, y, z } = block.location;
      const pizza_slice_2 = new ItemStack("fb:pizza_2_slice_item");
      const pizza_slice = new ItemStack("fb:pizza_slice_item");
      if (!player.isSneaking && block.hasTag('pizza_slice_2')) {
        player.playSound("break.big_dripleaf");
        block.dimension.spawnItem(pizza_slice_2, {
          x: block.location.x + 0.5,
          y: block.location.y + 1,
          z: block.location.z + 0.5
        });
        block.dimension.runCommand(`setblock ${x} ${y} ${z} air[]`);
        block.dimension.spawnParticle("foxes:texture", {
          x: block.location.x + 0.5,
          y: block.location.y + 0.5,
          z: block.location.z + 0.5
        });
        return;
      }
      if (!player.isSneaking && block.hasTag('pizza_slice')) {
        player.playSound("break.big_dripleaf");
        block.dimension.spawnItem(pizza_slice, {
          x: block.location.x + 0.5,
          y: block.location.y + 1,
          z: block.location.z + 0.5
        });
        block.dimension.runCommand(`setblock ${x} ${y} ${z} air[]`);
        block.dimension.spawnParticle("foxes:texture", {
          x: block.location.x + 0.5,
          y: block.location.y + 0.5,
          z: block.location.z + 0.5
        });
        return;
      }
    }
  });
});

function getPreciseRotation(playerYRotation) {
  if (playerYRotation < 0) playerYRotation += 360;
  const rotation = Math.round(playerYRotation / 22.5);
  return rotation !== 16 ? rotation : 0;
}

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("fbd:ar_for_ceiling_blocks", {
    beforeOnPlayerPlace(event) {
      const { player } = event;
      if (!player) return;
      const blockFace = event.permutationToPlace.getState("minecraft:block_face");
      if (blockFace !== "down") return;
      const playerYRotation = player.getRotation().y;
      const rotation = getPreciseRotation(playerYRotation);
      event.permutationToPlace = event.permutationToPlace.withState("fb:rotation", rotation);
    }
  });
});

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("fd:advanced_rotation_v1", {
    beforeOnPlayerPlace(event) {
      const { player } = event;
      if (!player) return;
      const blockFace = event.permutationToPlace.getState("minecraft:block_face");
      if (blockFace !== "up") return;
      const playerYRotation = player.getRotation().y;
      const rotation = getPreciseRotation(playerYRotation);
      event.permutationToPlace = event.permutationToPlace.withState("fb:rotation", rotation);
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.itemComponentRegistry.registerCustomComponent('test:changer_tool', {
    onUseOn: e => {
      const { block, player } = e;
      if (block.hasTag('changeable')) {
        const updates = e.block.permutation.getState("p:changer");
        block.setPermutation(block.permutation.withState("p:changer", updates + 1));
        block.dimension.playSound("block.lantern.break", block.center());
        block.dimension.spawnParticle("foxes:texture", block.center());
      }
    }
  });
});

system.beforeEvents.startup.subscribe(event => {
  event.blockComponentRegistry.registerCustomComponent("fbd:snack_variants_function", {
    onPlace: onPlaceEvent => {
      onPlaceEvent.block.setPermutation(onPlaceEvent.block.permutation.withState("fbd:snack_variants", Math.round(Math.random() * 10)));
    }
  });
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('fbd:trash_cc', {
    onPlayerInteract: e => {
      const { player, block } = e;
      const { x, y, z } = block.location;
      const equipment = player.getComponent('equippable');
      const selectedItem = equipment.getEquipment('Mainhand');
      if (!player.isSneaking && selectedItem) {
        player.playSound("random.pop2");
        player.playSound("composter.ready");
        if (selectedItem.amount > 1) {
          selectedItem.amount -= 1;
          equipment.setEquipment('Mainhand', selectedItem);
        } else {
          equipment.setEquipment('Mainhand', undefined);
        }
        return;
      }
    }
  });
});

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("fbd:balloons_down", {
    onPlace(event) {
      const { block } = event;
      const { x, y, z } = block.location;
      if (block.dimension.getBlock({ x, y, z }).typeId === "fb:balloons_down" && block.hasTag("north")) {
        block.dimension.runCommand(`setblock ${x} ${y + 1} ${z} fb:balloons_up ["minecraft:cardinal_direction"="north"]`);
      }
      if (block.dimension.getBlock({ x, y, z }).typeId === "fb:balloons_down" && block.hasTag("east")) {
        block.dimension.runCommand(`setblock ${x} ${y + 1} ${z} fb:balloons_up ["minecraft:cardinal_direction"="east"]`);
      }
      if (block.dimension.getBlock({ x, y, z }).typeId === "fb:balloons_down" && block.hasTag("south")) {
        block.dimension.runCommand(`setblock ${x} ${y + 1} ${z} fb:balloons_up ["minecraft:cardinal_direction"="south"]`);
      }
      if (block.dimension.getBlock({ x, y, z }).typeId === "fb:balloons_down" && block.hasTag("west")) {
        block.dimension.runCommand(`setblock ${x} ${y + 1} ${z} fb:balloons_up ["minecraft:cardinal_direction"="west"]`);
      }
    }
  });
});

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("fbd:balloons_up", {
    onPlayerDestroy(event) {
      const { block } = event;
      const { x, y, z } = block.location;
      block.dimension.getBlock({ x, y: y - 1, z }).setPermutation(BlockPermutation.resolve("minecraft:air"));
    }
  });
});

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("fbd:balloons_down_destroy", {
    onPlayerDestroy(event) {
      const { block } = event;
      const { x, y, z } = block.location;
      block.dimension.getBlock({ x, y: y + 1, z }).setPermutation(BlockPermutation.resolve("minecraft:air"));
    }
  });
});

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("fbd:silver_lamp_up", {
    onPlace(event) {
      const { block } = event;
      const { x, y, z } = block.location;
      if (block.dimension.getBlock({ x, y, z }).typeId === "fb:office_light_up") {
        block.dimension.runCommand(`setblock ${x} ${y - 1} ${z} fb:office_light_down`);
      }
    }
  });
});

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("fbd:silver_lamp_down", {
    onPlayerDestroy(event) {
      const { block } = event;
      const { x, y, z } = block.location;
      block.dimension.getBlock({ x, y: y + 1, z }).setPermutation(BlockPermutation.resolve("minecraft:air"));
    }
  });
});

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("fbd:silver_lamp_destroy", {
    onPlayerDestroy(event) {
      const { block } = event;
      const { x, y, z } = block.location;
      block.dimension.getBlock({ x, y: y - 1, z }).setPermutation(BlockPermutation.resolve("minecraft:air"));
    }
  });
});


/// FB&D OPTIMIZATION UPDATE