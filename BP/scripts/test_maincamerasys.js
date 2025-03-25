import { world, system } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { utilities } from "./utilsfb";

world.beforeEvents.itemUse.subscribe((data) => {
    var player = data.source;


    switch (data.itemStack.typeId) {
        case "fb:faztab_security": {


            const cameraList = utilities.getEntities(player.dimension, player.nameTag, 'fb:camera_entity_testing').map(entity => utilities.getName(entity, player.nameTag));

            if (!player.hasTag("fb_tablet_camera")) {
                system.run(async () => {
                    var form = new ActionFormData();
                    form.title("§fFaztab - Menu");
                    form.body("(!) Greetings security guard,welcome to the main menu of our device\ncreated for you,called Faztab,with this device you can monitor the\nsecurity cameras added by you and much more blah blah blah\nlet's go to the important thing... the testing!\n\n§7- Fazbear Entertaiment");
                    form.button("View cameras", "textures/items/flashlight");
                    form.button("Rev cameras", "textures/items/remover_tool");
                    form.button("Help", "textures/ui/how_to_play_button_hover_light");
                    form.show(player).then((response) => {
                        if (response.selection === 0) {
                            system.run(async () => {
                                var form = new ModalFormData();
                                form.title("§fFaztab - Menu / View Cameras");
                                form.dropdown('(!) Select the camera you want to preview\n§c- Please note that some cameras cannot be used at distances of 128 blocks\n§7[That will change in the future]\n\n§7- Below you will see the list of cameras added by you\n', cameraList)

                                form.show(player).then(async (result) => {
                                    let cameraname = cameraList[result.formValues];
                                    try {
                                        system.run(async () => {
                                            await player.runCommand(`summon fb:camera_entity_testing`);
                                            await player.runCommand(`tag @e[r=2,type=fb:camera_entity_testing] add "executing: ${player.nameTag}"`);
                                            player.addTag("fb_tablet_camera");
                                            await player.runCommand(`tp @s @e[tag="cameras:${player.nameTag}${cameraname}"]`);
                                            await player.runCommand(`event entity @e[tag="cameras:${player.nameTag}${cameraname}"] ride_fb`);
                                            await player.runCommand(`ride @s start_riding @e[tag="cameras:${player.nameTag}${cameraname}"]`);
                                        });
                                    } catch (e) {
                                        console.warn(e)
                                        system.run(async () => {
                                            player.onScreenDisplay.setActionBar(`§l§o§cNo camera detected!`);
                                        });
                                    }
                                });
                            });
                        }
                        else if (response.selection === 1) {
                            system.run(async () => {
                                var form = new ModalFormData()
                                form.title("§fFaztab - Menu / Rev cameras")
                                form.dropdown('(!) Choose the camera you want to disable (the camera will be permanently removed)\nWhen removing a camera, the placed block will also be removed\nAnd you can add again at any time', cameraList)
                                form.show(player).then(async (result) => {
                                    let cameraname = cameraList[result.formValues];
                                    try {
                                        system.run(async () => {
                                            await player.runCommand(`event entity @e[tag="cameras:${player.nameTag}${cameraname}"] fb:despawn`)
                                        });
                                    } catch (e) {
                                        system.run(async () => {
                                            player.onScreenDisplay.setActionBar(`§cError!`);
                                        });
                                    }
                                });
                            });
                        }
                        else if (response.selection === 2) {
                            system.run(async () => {
                                player.runCommand(`tellraw @a[m=1] {"rawtext":[{"text":"§l§g- §eCamera Setup | Help §g-§r\n§f(!) Add a connection with a security camera\n- By establishing a connection with a camera\nyou can monitor the area\n\n§gHow can I add a camera?\n§7- Just type the name of your camera and be within \na 3 block radius of the camera\n§8(this is mandatory otherwise the camera will not adjust correctly)\n\n§l§gSpanish Help:§r\n§f(!) Agregue una conexión con una cámara de seguridad\n- Al establecer una conexión con una cámara\npuede monitorear el área\n\n§g¿Cómo puedo agregar una cámara?\n§7- Simplemente escriba el nombre de su cámara y estar dentro de \na un radio de 3 bloques de la cámara\n§8(esto es obligatorio de lo contrario la camara no se ajustara correctamente)"}]}`)
                            });
                        }
                    });
                });
            }
            else if (player.hasTag("fb_tablet_camera")) {
                system.run(async () => {
                    var form = new ActionFormData();
                    system.run(async () => {
                        player.runCommand(`replaceitem entity @s slot.armor.head 1 air`)
                        await player.runCommand(`tp @s @e[type=fb:camera_entity_testing,tag="executing: ${player.nameTag}"]`);
                        await player.runCommand(`event entity @e[type=fb:camera_entity_testing,tag="executing: ${player.nameTag}"] fb:despawn2`);
                        player.removeTag('fb_tablet_camera');
                        player.runCommand(`camera @s clear`)
                    });
                });
            }


        } break;
        default:
            break;
    }
});

system.runInterval(async => {
    for (const player of world.getPlayers()) {

        if (player.hasTag("fb_tablet_camera")) {
            player.addEffect('invisibility', 3 * 3 * true)
            player.runCommand(`replaceitem entity @s slot.armor.head 1 fb:faztab_effect_item`)
            player.runCommand(`replaceitem entity @s slot.armor.head 1 fb:faztab_effect_item`)
            player.runCommand(`replaceitem entity @s slot.armor.head 1 fb:faztab_effect_item`)
            player.playAnimation('animation.player.camera', { blendOutTime: 0.1 })
        }


        //entities

        if (player.hasTag("new_form_execute")) {
            player.runCommand(`replaceitem entity @s slot.armor.head 1 air`)
            player.removeTag("new_form_execute");
            var form = new ModalFormData()
            form.title("§fFaztab - Camera setup")
            form.textField("§f(!) Add a connection with a security camera\n- By establishing a connection with a camera\nyou can monitor the area\n\n§cHow can I add a camera?\n- Just type the name of your camera and be within \na 5 block radius of the camera", "Name");
            form.show(player).then(async (result) => {
                let cameraname = result.formValues[0];
                try {
                    await player.runCommand(`tag @e[type=fb:camera_entity_testing,r=3] add "cameras:${player.nameTag}${cameraname}"`);
                    await player.runCommand(`tag @e[type=fb:camera_entity_testing,r=3] add "cameras:${player.nameTag}"`);
                    player.onScreenDisplay.setActionBar(`§7Camera setup - Name: ${cameraname}!`);
                } catch (e) {
                    player.onScreenDisplay.setActionBar(`§cError!`);
                }
            });
        }
    }
});

system.events.beforeWatchdogTerminate.subscribe(data => {
    data.cancel = true;
});

world.afterEvents.blockPlace.subscribe(async evd => {
    const loc = evd.blockLocation;
    const { block, player } = evd;
    const namespace = "fb:";

    if (block.typeId.includes(namespace)) {

        const players = Array.from(world.getPlayers());
        if (!players.some(player => player.hasTag(`${block.x} ${block.y} ${block.z}`))) {
            system.run(async () => {
                player.addTag(`${block.x} ${block.y} ${block.z}`);
            });
        }
    }
});