import {
  world,
  system,
  EntityRemoveBeforeEvent,
  EntitySpawnAfterEvent,
  EntityItemComponent,
  EntityComponentTypes,
  Vector2,
  Vector3,
} from "@minecraft/server";

// Velocity Bounds Constants. These were determined via running and logging 18 stacks of armor stands through dispensers in various orientations to get an approximate max and min velocity for each orientation.
const Bounds = {
  north: {
    min: { x: -0.17, y: -0.03, z: 0 } as Vector3,
    max: { x: 0.17, y: 0.35, z: 0.45 } as Vector3,
  },
  south: {
    min: { x: -0.17, y: -0.03, z: -0.45 } as Vector3,
    max: { x: 0.17, y: 0.35, z: 0 } as Vector3,
  },
  east: {
    min: { x: -0.45, y: -0.03, z: -0.17 } as Vector3,
    max: { x: 0, y: 0.35, z: 0.17 } as Vector3,
  },
  west: {
    min: { x: 0, y: -0.03, z: -0.17 } as Vector3,
    max: { x: 0.45, y: 0.35, z: 0.17 } as Vector3,
  },
  above: {
    min: { x: -0.19, y: 0, z: -0.19 } as Vector3,
    max: { x: 0.19, y: 0.27, z: 0.19 } as Vector3,
  },
  below: {
    min: { x: 0, y: 0, z: 0 } as Vector3,
    max: { x: 0, y: 0, z: 0 } as Vector3,
  },
};

function v3CheckBounds(bounds: { min: Vector3; max: Vector3 }, velocity: Vector3): boolean {
  return (
    bounds.min.x < velocity.x &&
    velocity.x < bounds.max.x &&
    bounds.min.y < velocity.y &&
    velocity.y < bounds.max.y &&
    bounds.min.z < velocity.z &&
    velocity.z < bounds.max.z
  );
}

function GetArmorstandBlocks(): Vector3[] {
  var returnArg: Vector3[] = [];
  const dynamicProp = world.getDynamicProperty("gyver_armorstand_blocks");
  if (dynamicProp) {
    returnArg = JSON.parse(dynamicProp as string);
  }
  return returnArg;
}

function SetArmorstandBlocks(array: Vector3[]): void {
  world.setDynamicProperty("gyver_armorstand_blocks", JSON.stringify(array));
}

function AddArmorstandBlock(blockLocation: Vector3): void {
  var inputArray = GetArmorstandBlocks();
  inputArray.push(blockLocation);
  SetArmorstandBlocks(inputArray);
}

function RemoveArmorstandBlock(testLocation: Vector3, testArray: Vector3[]): [Vector3[], boolean] {
  var returnArg: Vector3[] = [];
  var foundEntry: boolean = false;
  const testlocstring = JSON.stringify(testLocation);
  for (var loc of testArray) {
    if (!foundEntry) {
      if (JSON.stringify(loc) === testlocstring) {
        foundEntry = true;
        continue;
      }
    }
    returnArg.push(loc);
  }

  return [returnArg, foundEntry];
}

world.beforeEvents.entityRemove.subscribe((event: EntityRemoveBeforeEvent) => {
  const eventEntity = event.removedEntity;
  try {
    if (eventEntity) {
      if (eventEntity.typeId === "minecraft:armor_stand") {
        const entityDimension = eventEntity.dimension;
        const entityBlock = entityDimension.getBlock(eventEntity.getHeadLocation());
        if (entityBlock) {
          AddArmorstandBlock(entityBlock.location);
        }
      }
    }
  } catch (e) {
    console.warn((e as Error).message);
  }
});

world.afterEvents.entitySpawn.subscribe((event: EntitySpawnAfterEvent) => {
  let myentity = event.entity;
  try {
    if (myentity) {
      const itemComp = myentity.getComponent(EntityComponentTypes.Item) as EntityItemComponent | undefined;
      if (itemComp) {
        if (itemComp.itemStack.typeId === "minecraft:armor_stand") {
          const spawnDimension = myentity.dimension;
          const spawnLocation = myentity.location;
          const spawnVelocity = myentity.getVelocity();
          var dispensedStand: boolean = false;
          var testDispenser: boolean = true;
          var StandRotation: Vector2 = { x: 0, y: 270 };
          const spawnBlock = spawnDimension.getBlock(spawnLocation);
          if (spawnBlock) {
            var destroyedBlocks = GetArmorstandBlocks();
            if (destroyedBlocks.length > 0) {
              var [removedBlocks, foundEntry] = RemoveArmorstandBlock(spawnBlock.location, destroyedBlocks);
              if (foundEntry) {
                SetArmorstandBlocks(removedBlocks);
                testDispenser = false;
              }
            }
            if (testDispenser) {
              if (!dispensedStand) {
                const testBlock = spawnBlock.north(1);
                if (
                  testBlock &&
                  testBlock.matches("minecraft:dispenser", { facing_direction: 3 }) &&
                  v3CheckBounds(Bounds.north, spawnVelocity)
                ) {
                  dispensedStand = true;
                  StandRotation.y = 0;
                }
              }
              if (!dispensedStand) {
                const testBlock = spawnBlock.south(1);
                if (
                  testBlock &&
                  testBlock.matches("minecraft:dispenser", { facing_direction: 2 }) &&
                  v3CheckBounds(Bounds.south, spawnVelocity)
                ) {
                  dispensedStand = true;
                  StandRotation.y = 180;
                }
              }
              if (!dispensedStand) {
                const testBlock = spawnBlock.east(1);
                if (
                  testBlock &&
                  testBlock.matches("minecraft:dispenser", { facing_direction: 4 }) &&
                  v3CheckBounds(Bounds.east, spawnVelocity)
                ) {
                  dispensedStand = true;
                  StandRotation.y = 90;
                }
              }
              if (!dispensedStand) {
                const testBlock = spawnBlock.west(1);
                if (
                  testBlock &&
                  testBlock.matches("minecraft:dispenser", { facing_direction: 5 }) &&
                  v3CheckBounds(Bounds.west, spawnVelocity)
                ) {
                  dispensedStand = true;
                }
              }
              if (!dispensedStand) {
                const testBlock = spawnBlock.above(1);
                if (
                  testBlock &&
                  testBlock.matches("minecraft:dispenser", { facing_direction: 0 }) &&
                  v3CheckBounds(Bounds.above, spawnVelocity)
                ) {
                  dispensedStand = true;
                }
              }
              if (!dispensedStand) {
                const testBlock = spawnBlock.below(1);
                if (
                  testBlock &&
                  testBlock.matches("minecraft:dispenser", { facing_direction: 1 }) &&
                  spawnVelocity.x === 0 &&
                  spawnVelocity.y === 0 &&
                  spawnVelocity.z === 0
                ) {
                  dispensedStand = true;
                }
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
    console.warn((e as Error).message);
  }
});

// Clear the Armorstand destroyed Blocks list every two seconds.
system.runInterval(() => {
  SetArmorstandBlocks([]);
}, 40);
