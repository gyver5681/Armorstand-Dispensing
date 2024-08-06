# Armorstand Dispensing Parity Fix

In Java, Armorstands are dispensed as full-size entities. This Addon attempts to bring parity to Bedrock by replacing dispensed armorstand items with an armorstand entity.

## Caveats:

I've done my best to remove as many false negatives as I can (an actual armor stand item being dispensed and not being converted to a full size entity), however it's possible it may still happen from time to time.

Java dispensers will dispense the armorstands into blocks, this addon does not duplicate this and instead will wind up dispensing an armor stand item that moves through the block using default minecraft behavior.
-Gyver5681

## ToDo:
