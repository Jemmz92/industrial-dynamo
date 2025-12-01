# Integrated Dynamo Module

Adds the Integrated Dynamo augmentation to D&D 5e 2024 in Foundry VTT.

## Features
- Integrated Dynamo with 3 charges
- Clickable abilities: Voltaic Surge, Arc Pulse, Emergency Reboot, etc.
- WoW-style talent tree: Capacitor, Conductor, Stabilizer, Special
- Talent prerequisites enforced
- Emergency Reboot requires 3 charges
- Dynamo ID cannot be stolen

## Installation
1. Clone this repository or download the folder
2. Copy into `FoundryVTT/Data/modules/`
3. Activate module in Foundry
4. Open any actor → Dynamo tab appears
5. Click abilities to use them, unlock talents in the tree

## Module Structure
- scripts/dynamo.js → main logic
- styles/dynamo.css → tab and talent tree styling
- templates/dynamo-tab.html → Dynamo tab HTML
- icons/ → optional ability/talent icons
