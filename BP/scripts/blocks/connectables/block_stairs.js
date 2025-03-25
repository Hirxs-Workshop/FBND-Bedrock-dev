import { system, world } from "@minecraft/server";

system.beforeEvents.startup.subscribe(initEvent => {
    initEvent.BlockComponentRegistry.registerCustomComponent('fbd:stair_placement', {
        onPlace: e => {
            const { block } = e;
            const northBlock = block.north();
            const southBlock = block.south();
            const eastBlock = block.east();
            const westBlock = block.west();
            const vertical_half = block.permutation.getState('minecraft:vertical_half');
            const shape = block.permutation.getState('fbd:shape');
            const cardinal_direction = block.permutation.getState('minecraft:cardinal_direction');

            if (vertical_half == 'bottom') {
                block.setPermutation(block.permutation.withState('fbd:placed_bit', true));
                if(southBlock.hasTag('fbd_stairs_up') && southBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right'));
                }
                if(!southBlock.hasTag('fbd_stairs_up') && !southBlock.hasTag('fbd_stairs_east') && shape == 'inner_right' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_up') && southBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!southBlock.hasTag('fbd_stairs_up') && !southBlock.hasTag('fbd_stairs_west') && shape == 'inner_left' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_up') && northBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!northBlock.hasTag('fbd_stairs_up') && !northBlock.hasTag('fbd_stairs_west') && shape == 'inner_left' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_up') && northBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!northBlock.hasTag('fbd_stairs_up') && !northBlock.hasTag('fbd_stairs_east') && shape == 'inner_right' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_up') && eastBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_up') && !eastBlock.hasTag('fbd_stairs_south') && shape == 'inner_left' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_up') && eastBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_up') && !eastBlock.hasTag('fbd_stairs_north') && shape == 'inner_right' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_up') && westBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!westBlock.hasTag('fbd_stairs_up') && !westBlock.hasTag('fbd_stairs_north') && shape == 'inner_left' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_up') && westBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!westBlock.hasTag('fbd_stairs_up') && !westBlock.hasTag('fbd_stairs_south') && shape == 'inner_right' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_up') && northBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!northBlock.hasTag('fbd_stairs_up') && !northBlock.hasTag('fbd_stairs_west') && shape == 'outer_right' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_up') && northBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!northBlock.hasTag('fbd_stairs_up') && !northBlock.hasTag('fbd_stairs_east') && shape == 'outer_left' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_up') && southBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!southBlock.hasTag('fbd_stairs_up') && !southBlock.hasTag('fbd_stairs_west') && shape == 'outer_right' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_up') && southBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!southBlock.hasTag('fbd_stairs_up') && !southBlock.hasTag('fbd_stairs_east') && shape == 'outer_left' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_up') && westBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!westBlock.hasTag('fbd_stairs_up') && !westBlock.hasTag('fbd_stairs_north') && shape == 'outer_right' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_up') && westBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!westBlock.hasTag('fbd_stairs_up') && !westBlock.hasTag('fbd_stairs_south') && shape == 'outer_left' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_up') && eastBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_up') && !eastBlock.hasTag('fbd_stairs_south') && shape == 'outer_right' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_up') && eastBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_up') && !eastBlock.hasTag('fbd_stairs_north') && shape == 'outer_left' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
            }
            if (vertical_half == 'top') {
                block.setPermutation(block.permutation.withState('fbd:placed_bit', true));
                if(southBlock.hasTag('fbd_stairs_down') && southBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right'));
                }
                if(!southBlock.hasTag('fbd_stairs_down') && !southBlock.hasTag('fbd_stairs_east') && shape == 'inner_right' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_down') && southBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!southBlock.hasTag('fbd_stairs_down') && !southBlock.hasTag('fbd_stairs_west') && shape == 'inner_left' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_down') && northBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!northBlock.hasTag('fbd_stairs_down') && !northBlock.hasTag('fbd_stairs_west') && shape == 'inner_left' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_down') && northBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!northBlock.hasTag('fbd_stairs_down') && !northBlock.hasTag('fbd_stairs_east') && shape == 'inner_right' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_down') && eastBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_down') && !eastBlock.hasTag('fbd_stairs_south') && shape == 'inner_left' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_down') && eastBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_down') && !eastBlock.hasTag('fbd_stairs_north') && shape == 'inner_right' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_down') && westBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!westBlock.hasTag('fbd_stairs_down') && !westBlock.hasTag('fbd_stairs_north') && shape == 'inner_left' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_down') && westBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!westBlock.hasTag('fbd_stairs_down') && !westBlock.hasTag('fbd_stairs_south') && shape == 'inner_right' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_down') && northBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!northBlock.hasTag('fbd_stairs_down') && !northBlock.hasTag('fbd_stairs_west') && shape == 'outer_right' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_down') && northBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!northBlock.hasTag('fbd_stairs_down') && !northBlock.hasTag('fbd_stairs_east') && shape == 'outer_left' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_down') && southBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!southBlock.hasTag('fbd_stairs_down') && !southBlock.hasTag('fbd_stairs_west') && shape == 'outer_right' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_down') && southBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!southBlock.hasTag('fbd_stairs_down') && !southBlock.hasTag('fbd_stairs_east') && shape == 'outer_left' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_down') && westBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!westBlock.hasTag('fbd_stairs_down') && !westBlock.hasTag('fbd_stairs_north') && shape == 'outer_right' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_down') && westBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!westBlock.hasTag('fbd_stairs_down') && !westBlock.hasTag('fbd_stairs_south') && shape == 'outer_left' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_down') && eastBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_down') && !eastBlock.hasTag('fbd_stairs_south') && shape == 'outer_right' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_down') && eastBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_down') && !eastBlock.hasTag('fbd_stairs_north') && shape == 'outer_left' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
            }
        },
        onTick: e => {
            const { block } = e;
            const northBlock = e.block.north();
            const southBlock = e.block.south();
            const eastBlock = e.block.east();
            const westBlock = e.block.west();
            const vertical_half = block.permutation.getState('minecraft:vertical_half');
            const shape = block.permutation.getState('fbd:shape');
            const cardinal_direction = block.permutation.getState('minecraft:cardinal_direction');

            if (vertical_half == 'bottom') {
                block.setPermutation(block.permutation.withState('fbd:placed_bit', true));
                if(southBlock.hasTag('fbd_stairs_up') && southBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right'));
                }
                if(!southBlock.hasTag('fbd_stairs_up') && !southBlock.hasTag('fbd_stairs_east') && shape == 'inner_right' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_up') && southBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!southBlock.hasTag('fbd_stairs_up') && !southBlock.hasTag('fbd_stairs_west') && shape == 'inner_left' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_up') && northBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!northBlock.hasTag('fbd_stairs_up') && !northBlock.hasTag('fbd_stairs_west') && shape == 'inner_left' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_up') && northBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!northBlock.hasTag('fbd_stairs_up') && !northBlock.hasTag('fbd_stairs_east') && shape == 'inner_right' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_up') && eastBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_up') && !eastBlock.hasTag('fbd_stairs_south') && shape == 'inner_left' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_up') && eastBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_up') && !eastBlock.hasTag('fbd_stairs_north') && shape == 'inner_right' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_up') && westBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!westBlock.hasTag('fbd_stairs_up') && !westBlock.hasTag('fbd_stairs_north') && shape == 'inner_left' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_up') && westBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!westBlock.hasTag('fbd_stairs_up') && !westBlock.hasTag('fbd_stairs_south') && shape == 'inner_right' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_up') && northBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!northBlock.hasTag('fbd_stairs_up') && !northBlock.hasTag('fbd_stairs_west') && shape == 'outer_right' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_up') && northBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!northBlock.hasTag('fbd_stairs_up') && !northBlock.hasTag('fbd_stairs_east') && shape == 'outer_left' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_up') && southBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!southBlock.hasTag('fbd_stairs_up') && !southBlock.hasTag('fbd_stairs_west') && shape == 'outer_right' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_up') && southBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!southBlock.hasTag('fbd_stairs_up') && !southBlock.hasTag('fbd_stairs_east') && shape == 'outer_left' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_up') && westBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!westBlock.hasTag('fbd_stairs_up') && !westBlock.hasTag('fbd_stairs_north') && shape == 'outer_right' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_up') && westBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!westBlock.hasTag('fbd_stairs_up') && !westBlock.hasTag('fbd_stairs_south') && shape == 'outer_left' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_up') && eastBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_up') && !eastBlock.hasTag('fbd_stairs_south') && shape == 'outer_right' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_up') && eastBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_up') && !eastBlock.hasTag('fbd_stairs_north') && shape == 'outer_left' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
            }
            if (vertical_half == 'top') {
                block.setPermutation(block.permutation.withState('fbd:placed_bit', true));
                if(southBlock.hasTag('fbd_stairs_down') && southBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right'));
                }
                if(!southBlock.hasTag('fbd_stairs_down') && !southBlock.hasTag('fbd_stairs_east') && shape == 'inner_right' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_down') && southBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!southBlock.hasTag('fbd_stairs_down') && !southBlock.hasTag('fbd_stairs_west') && shape == 'inner_left' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_down') && northBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!northBlock.hasTag('fbd_stairs_down') && !northBlock.hasTag('fbd_stairs_west') && shape == 'inner_left' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_down') && northBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!northBlock.hasTag('fbd_stairs_down') && !northBlock.hasTag('fbd_stairs_east') && shape == 'inner_right' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_down') && eastBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_down') && !eastBlock.hasTag('fbd_stairs_south') && shape == 'inner_left' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_down') && eastBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_down') && !eastBlock.hasTag('fbd_stairs_north') && shape == 'inner_right' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_down') && westBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_left' ))
                }
                if(!westBlock.hasTag('fbd_stairs_down') && !westBlock.hasTag('fbd_stairs_north') && shape == 'inner_left' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_down') && westBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'inner_right' ))
                }
                if(!westBlock.hasTag('fbd_stairs_down') && !westBlock.hasTag('fbd_stairs_south') && shape == 'inner_right' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_down') && northBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!northBlock.hasTag('fbd_stairs_down') && !northBlock.hasTag('fbd_stairs_west') && shape == 'outer_right' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(northBlock.hasTag('fbd_stairs_down') && northBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!northBlock.hasTag('fbd_stairs_down') && !northBlock.hasTag('fbd_stairs_east') && shape == 'outer_left' && cardinal_direction == 'north') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_down') && southBlock.hasTag('fbd_stairs_west') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!southBlock.hasTag('fbd_stairs_down') && !southBlock.hasTag('fbd_stairs_west') && shape == 'outer_right' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(southBlock.hasTag('fbd_stairs_down') && southBlock.hasTag('fbd_stairs_east') && shape == 'straight' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!southBlock.hasTag('fbd_stairs_down') && !southBlock.hasTag('fbd_stairs_east') && shape == 'outer_left' && cardinal_direction == 'south') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_down') && westBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!westBlock.hasTag('fbd_stairs_down') && !westBlock.hasTag('fbd_stairs_north') && shape == 'outer_right' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(westBlock.hasTag('fbd_stairs_down') && westBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!westBlock.hasTag('fbd_stairs_down') && !westBlock.hasTag('fbd_stairs_south') && shape == 'outer_left' && cardinal_direction == 'west') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_down') && eastBlock.hasTag('fbd_stairs_south') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_right' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_down') && !eastBlock.hasTag('fbd_stairs_south') && shape == 'outer_right' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
                if(eastBlock.hasTag('fbd_stairs_down') && eastBlock.hasTag('fbd_stairs_north') && shape == 'straight' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'outer_left' ))
                }
                if(!eastBlock.hasTag('fbd_stairs_down') && !eastBlock.hasTag('fbd_stairs_north') && shape == 'outer_left' && cardinal_direction == 'east') {
                    block.setPermutation(block.permutation.withState('fbd:shape', 'straight' ))
                }
            }
        }
    });
});