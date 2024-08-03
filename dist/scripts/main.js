// scripts/main.ts
import {
  world,
  EntityComponentTypes
} from "@minecraft/server";
var Bounds = {
  north: {
    min: { x: -0.14197, y: 0, z: 0 },
    max: { x: 0.14512, y: 0.28822, z: 0.44923 }
  },
  south: {
    min: { x: -0.14084, y: 0, z: -0.43568 },
    max: { x: 0.15107, y: 0.28823, z: 0 }
  },
  east: {
    min: { x: -0.44638, y: 0, z: -0.13491 },
    max: { x: 0, y: 0.28697, z: 0.11382 }
  },
  west: {
    min: { x: 0, y: -368e-5, z: -0.16915 },
    max: { x: 0.41064, y: 0.34748, z: 0.13619 }
  },
  above: {
    min: { x: -0.13535, y: 0, z: -0.18908 },
    max: { x: 0.14192, y: 0.26345, z: 0.12336 }
  },
  below: {
    min: { x: 0, y: 0, z: 0 },
    max: { x: 0, y: 0, z: 0 }
  }
};
function v3CheckBounds(bounds, velocity) {
  return bounds.min.x < velocity.x && velocity.x < bounds.max.x && bounds.min.y < velocity.y && velocity.y < bounds.max.y && bounds.min.z < velocity.z && velocity.z < bounds.max.z;
}
world.afterEvents.entitySpawn.subscribe((event) => {
  let myentity = event.entity;
  try {
    if (myentity) {
      const itemComp = myentity.getComponent(EntityComponentTypes.Item);
      if (itemComp) {
        if (itemComp.itemStack.typeId === "minecraft:armor_stand") {
          const spawnDimension = myentity.dimension;
          const spawnLocation = myentity.location;
          const spawnVelocity = myentity.getVelocity();
          let dispensedStand = false;
          let StandRotation = { x: 0, y: 270 };
          const spawnBlock = spawnDimension.getBlock(spawnLocation);
          if (spawnBlock) {
            if (!dispensedStand) {
              const testBlock = spawnBlock.north(1);
              if (testBlock && testBlock.matches("minecraft:dispenser", { facing_direction: 3 }) && v3CheckBounds(Bounds.north, spawnVelocity)) {
                dispensedStand = true;
                StandRotation.y = 0;
              }
            }
            if (!dispensedStand) {
              const testBlock = spawnBlock.south(1);
              if (testBlock && testBlock.matches("minecraft:dispenser", { facing_direction: 2 }) && v3CheckBounds(Bounds.south, spawnVelocity)) {
                dispensedStand = true;
                StandRotation.y = 180;
              }
            }
            if (!dispensedStand) {
              const testBlock = spawnBlock.east(1);
              if (testBlock && testBlock.matches("minecraft:dispenser", { facing_direction: 4 }) && v3CheckBounds(Bounds.east, spawnVelocity)) {
                dispensedStand = true;
                StandRotation.y = 90;
              }
            }
            if (!dispensedStand) {
              const testBlock = spawnBlock.west(1);
              if (testBlock && testBlock.matches("minecraft:dispenser", { facing_direction: 5 }) && v3CheckBounds(Bounds.west, spawnVelocity)) {
                dispensedStand = true;
              }
            }
            if (!dispensedStand) {
              const testBlock = spawnBlock.above(1);
              if (testBlock && testBlock.matches("minecraft:dispenser", { facing_direction: 0 }) && v3CheckBounds(Bounds.above, spawnVelocity)) {
                dispensedStand = true;
              }
            }
            if (!dispensedStand) {
              const testBlock = spawnBlock.below(1);
              if (testBlock && testBlock.matches("minecraft:dispenser", { facing_direction: 1 }) && spawnVelocity.x === 0 && spawnVelocity.y === 0 && spawnVelocity.z === 0) {
                dispensedStand = true;
              }
            }
          }
          if (dispensedStand) {
            spawnDimension.spawnEntity("minecraft:armor_stand", spawnLocation).setRotation(StandRotation);
            myentity.kill();
          }
        }
      }
    }
  } catch (e) {
    console.warn(e.message);
  }
});

//# sourceMappingURL=../debug/main.js.map
