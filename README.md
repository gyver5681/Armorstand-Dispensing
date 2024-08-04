# Armorstand Dispensing Parity Fix

In Java, Armorstands are dispensed as full-size entities. This Addon attempts to bring parity to Bedrock by replacing dispensed armorstand items with an armorstand entity.

## Caveats:

The velocity bounds checking in use is still resulting in an occasional false-negative, resulting in an occasional armorstand item being dispensed instead of an entity. I'm open to suggestions.

Java dispensers will dispense the armorstands into blocks, this addon does not duplicate this and instead will wind up dispensing an armor stand item that moves through the block using default minecraft behavior.
-Gyver5681

## ToDo:
