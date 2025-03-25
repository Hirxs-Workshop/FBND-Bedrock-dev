
class Utilities {
  getName(entity, nametag) {
    if (!entity) return;

    for (const tag of entity.getTags()) {
      if (tag.includes("cameras")) {
        const name = tag.split(":")[1].replace(nametag, "");

        return name;
      }
    }
  }

  async runCommand(player, command) {
    try {
      return await player.runCommand(command);
    } catch (e) {
      return { error: true };
    }
  }

  getEntities(dimension, includesName, type) {
    const entities = dimension.getEntities();
    const result = [];

    for (const entity of entities) {
      const tags = entity.getTags();

      if (tags.find((tag) => tag.includes(includesName)) && entity.typeId == type) result.push(entity);
    }
    return result;
  }
}

export const utilities = new Utilities();
