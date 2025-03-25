export function getPlayerYRot(originEntity) {
    const y = originEntity.getRotation().y

    let facingDirectionCardinal
    switch (true) {
        case y <= -135 || y > 135:
            facingDirectionCardinal = 2
            break
        case y > -135 && y <= -45:
            facingDirectionCardinal = 3
            break
        case y > -45 && y <= 45:
            facingDirectionCardinal = 0
            break
        default:
            facingDirectionCardinal = 1
            break
    }
    return facingDirectionCardinal
}

export function switchBlockFaces(event, Direction) {
    let targetBlock
    switch (event.blockFace) {
        case Direction.East:
            targetBlock = event.block.east()
            break
        case Direction.West:
            targetBlock = event.block.west()
            break
        case Direction.South:
            targetBlock = event.block.south()
            break
        case Direction.North:
            targetBlock = event.block.north()
            break
    }
    return targetBlock
}

