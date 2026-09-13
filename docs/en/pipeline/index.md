---
title: AC Official Car Pipeline R2.0
---

# Assetto Corsa Pipeline for Community Modders R2.0

> This document was extracted from the official SDK `sdk/dev/car_pipeline_2.0rev/AC_Pipeline_PUB_Rev2.0.pdf` ([Chinese translation](/pipeline/)).

## Contents

- [1. Requirements](01-requirements)
- [2. Basic Guidelines](02-basic-guidelines)
- [3. Scene Structure](03-scene-structure)
- [4. Functional Mesh Elements](04-functional-mesh-elements)
- [5. Functional Textures](05-functional-textures)
- [6. Texturing Guidelines](06-texturing-guidelines)
- [7. Animations](07-animations)
- [8. Materials and AC Editor](08-materials-ac-editor)
- [9. In-game Console Commands](09-console-commands)

**BEFORE YOU START:**

This is an updated version of the original car-pipeline-1.03 document that was released
alongside the game's original release. The car production pipeline has gone through massive
changes since then, cars included in the original game had vastly different requirements than
current releases, which is why an update has been due.
This document contains information that matches the quality requirements for official KUNOS
releases since the Japanese Pack DLC, through the Porsche Packs and the most recent Ready
To Race DLC packs. It is safe to say that the current requirements are unlikely to change in the
remaining lifecycle of Assetto Corsa.
However, some new functions (especially digital display scripts etc.), are likely to be added,
which is why we recommend you visit the official support forum to be up to date on
developments in this respect.
Note that due to the nature of the development cycle, we have continued to add new functions
and features into the simulator, which is why this document is not comprehensive. However,
each section will include a link to the most relevant community threads on the official support
forum, where community artists can find, and also ask for, support to guide them through their
projects. Because the core engine has not changed, some parts of the document, such as
animations and general model management, remain unchanged.
For compatibility purposes, you can still find the contents of the old sdk in an archive within the
new SDK folder.
Note that most pieces of advice in this document are intended for our internal professional
artists. Naturally, the creation of community-made content is not so strict and it's down to your
preference and expectations how much you wish to stick to it.
Also note that Kunos staff artists do not work with Blender, so guidelines and rules do not
always transfer correctly to that software and thus we have no experience in helping you find
the right methods for the creation of community content. Again, we can only urge you to visit
the modding section of the official support forum to find information on Blender.
IMPORTANT: In addition to this document, the sdk/dev folder contains a number of useful
folders with examples and guides for scene hierarchy, various animations, and a driver rig to be
used in 3ds Max.
