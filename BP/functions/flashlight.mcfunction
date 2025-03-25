scoreboard objectives add flashlight dummy
scoreboard objectives add flashlighth dummy
scoreboard players add @a flashlight 0
scoreboard players add @a flashlighth 0
execute as @e[scores={flashlight=!0},hasitem={item=fb:flashlight,location=slot.weapon.mainhand}] at @s positioned ~~~ run function flashlight_light
execute as @e[scores={flashlight=!0},hasitem={item=fb:flashlight,location=slot.weapon.offhand}] at @s positioned ~~~ run function flashlight_light
scoreboard players add @a[scores={flashlight=!0},hasitem={item=fb:flashlight,location=slot.weapon.mainhand}] flashlight -1
scoreboard players add @a[scores={flashlight=!0},hasitem={item=fb:flashlight,location=slot.weapon.offhand}] flashlight -1