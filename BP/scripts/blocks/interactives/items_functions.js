import { world, BlockPermutation, ItemStack, system } from '@minecraft/server'

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.itemComponentRegistry.registerCustomComponent('test:changer_tool', {
    onUseOn: e => {
      const { block, player } = e;
      if (block.hasTag('changeable')) {
        const currentState = Number(block.permutation.getState("p:changer")) || 0;
        const newState = currentState + 1;
        block.setPermutation(block.permutation.withState("p:changer", newState));
        const center = block.center();
        block.dimension.playSound("block.lantern.break", center);
        block.dimension.spawnParticle("foxes:texture", center);
      }
    }
  });
});



system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.itemComponentRegistry.registerCustomComponent('fbd:banjo_sound', {
    onUse: e => {
      const { block, player } = e;
      e.source.playSound("note.bass");
    }
  })
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.itemComponentRegistry.registerCustomComponent('fbd:guitar_sound', {
    onUse: e => {
      const { block, player } = e;
      e.source.playSound("note.guitar");
    }
  })
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.itemComponentRegistry.registerCustomComponent('fbd:flashlight_on', {
    onUse: e => {
      const { block, player } = e;
      e.source.playSound("flashlight.click");
      e.source.runCommand("replaceitem entity @s slot.weapon.mainhand 0 fb:flashlight")
    }
  })
});

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.itemComponentRegistry.registerCustomComponent('fbd:flashlight_off', {
    onUse: e => {
      const { block, player } = e;
      e.source.playSound("flashlight.click");
      e.source.runCommand("replaceitem entity @s slot.weapon.mainhand 0 fb:flashlight_off")
      return;
    }
  })
});

// ITEMS

// system.beforeEvents.startup.subscribe(initEvent => {
//  initEvent.itemComponentRegistry.registerCustomComponent('fbd:stars_change', {
//    onUseOn: e => {
//      const { block, player } = e;
//      const stars_change_1 = block.permutation.withState("fb:box", 3);
//      if (block.hasTag('stars') && block.permutation.getState("fb:box") < 2) {
//        block.setPermutation(stars_change_1);
//        return;
//      }
//    }
//  });
//})