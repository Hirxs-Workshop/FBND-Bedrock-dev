import { world, ItemStack, system } from '@minecraft/server';

system.beforeEvents.startup.subscribe(eventData => {
  eventData.blockComponentRegistry.registerCustomComponent('fbd:on_player_destroy', {
    onPlayerDestroy(e) {
      const { player, dimension } = e;

      const { destroyedBlockPermutation: perm } = e;

      if (!player || !player.getComponent('equippable')) {
        return;
      }

      const selectedItem = player.getComponent('equippable').getEquipment('Mainhand');

      if (!selectedItem || !selectedItem.hasTag('minecraft:is_pickaxe')) {
        return;
      }

      const slabItem = perm.getItemStack(1);
      if (slabItem) {
        dimension.spawnItem(slabItem, e.block.location);
      }
    }
  });
});