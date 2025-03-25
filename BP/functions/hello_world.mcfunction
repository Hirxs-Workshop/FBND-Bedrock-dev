clear @a fd:inv_block
execute as @e[type=player,hasitem={location=slot.weapon.mainhand,item=fb:remover_tool,quantity=1}] run function remover_particles
execute as @e[type=player,hasitem={location=slot.weapon.mainhand,item=fb:rotate,quantity=1}] run function rotate_particles
execute as @a[hasitem={item=fb:flashlight,location=slot.weapon.mainhand}] run function flashlight_light