---
title: 8. Materials and AC Editor
---

# 8. Materials and AC Editor

In the following section you will find information about how to use the AC editor and guidelines for setting
up materials.

## MATERIAL NAMING CONVENTIONS

Please use the following conventions for naming materials in your 3D software. Firstly, ALWAYS indicate
whether it is for the interior or exterior (INT_ or EXT_), then indicate the name that is straightforward
(usually indicating the texture it is using) and lastly indicate if it has to use a certain transparency property,
such as AT for alpha test. When possible, use the following names:

| Name | Description |
| --- | --- |
| EXT_Tyre | |
| EXT_Rim | |
| EXT_Rim_blur | |
| EXT_Rim_blur_Alpha | transparent blurred rim part (use alpha blend mode and transparency ON) |
| EXT_Carpaint | |
| EXT_Carbon | |
| EXT_Details_AT | for labels and logos (use alpha test mode with transparency OFF) |
| EXT_Details_Plastic | Details=using the exterior details texture |
| EXT_Details_Metal | |
| EXT_Details_Chrome | |
| EXT_Engine | |
| EXT_Disc | |
| EXT_Caliper | |
| EXT_Window | |
| EXT_Lights_Glass | |
| EXT_Lights_Chrome | |
| INT_Details_AT | for labels and logos (alpha test mode with transparency OFF) |
| INT_Details_Plastic | Details=using the interior details texture |
| INT_Details_Chrome | |
| INT_Details_Metal_Black | |
| INT_Details_Metal_Flat | |
| INT_Details_Gauges | |
| INT_OCC_Carbon | OCC=using the ambient occlusion texture |
| INT_OCC_Leather | |
| INT_OCC_Alcantara | |
| INT_OCC_Plastic | |
| INT_OCC_Metal | |
| INT_BELT | |
| INT_LCD | ALWAYS keep the digital display on a separate texture (for racing cars) |
| INT_FUEL_INDICATOR | material with emissive for the fuel warning light |

If needed, you can use multiple materials (for multiple carbon patterns), in this case, make a distinction
with numbers or name (e.g. INT_OCC_Carbon_Flat and INT_OCC_Carbon_Refl). In any case, strive to
differentiate exterior and interior materials.
NOTE: For a more comprehensive guide and community tips to use the editor, see the following thread
on the official support forum:
http://www.assettocorsa.net/forum/index.php?threads/ac-editor.10964/
NOTE: to find useful information and request help for general editor and shader-related issues, see the
following thread on the official support forum:
http://www.assettocorsa.net/forum/index.php?threads/car-materials-shaders-modelling-stuff-add-your-knowledge-here.19704/
Basic guide to the KS EDITOR:
When you first open the editor, make sure you save the layout and set your preferences under
Utilities/Data Editor.

![p067_X0](/images/pipeline/p067_X0.png)

![p067_X1](/images/pipeline/p067_X1.png)

![p067_X2](/images/pipeline/p067_X2.png)

You can use the built-in Project Manager to save and manage projects:

![p068_X1](/images/pipeline/p068_X1.png)

![p068_X0](/images/pipeline/p068_X0.png)

![p068_X2](/images/pipeline/p068_X2.png)

![p068_X3](/images/pipeline/p068_X3.png)

![p068_X4](/images/pipeline/p068_X4.png)

Scene illumination in the editor can be changed under the Illumination tab:

![p068_X5](/images/pipeline/p068_X5.png)

You can review your textures using the Texture Review tool under Utilities/Texture Review (option only
visible when a model is loaded).

![p069_X0](/images/pipeline/p069_X0.png)

It is recommended you keep your texture folder organised. You can back up your unused textures with
the “Move Selected in backup folder” button.
You can use a Copy&Paste tool to copy existing shader properties to a second material.
Note that first you need to select the correct shader (if source is ksPerpixelMultimap, the target needs to
be a multimap material as well and so on), then fill in the shader slots manually! After these steps are
done, you can use the tool under Material Tools to copy and paste the shader values, as follows:

![p069_X1](/images/pipeline/p069_X1.png)

Transparencies and cast shadow settings can be applied globally to materials under the Materials tab:

![p070_X0](/images/pipeline/p070_X0.png)

Persistence files (containing shader and object settings) can be saved under File. You can also load
existing persistence files from higher LODs. Note that loading a persistence file on a new export will only
transfer shader settings, transparencies and cast shadow settings will have to be set manually. However,
for later persistence updates using the load function (once the transparencies are set), the transparencies
will not have to be set again.

![p070_X1](/images/pipeline/p070_X1.png)

General guidelines to using different alpha modes:
Where possible try to avoid using Alpha Blend mode. Blend requires transparency, which can cause
issues with draw priorities, because some objects can be viewed from two directions.
A common issue is the interior: interior objects sometimes (such as the transparent interior windshield
banner) need a priority set to 1 to avoid the object being drawn before the external glass objects when
viewed from outside.
However, from cockpit view, this can cause issues with the blurred rim on opponent cars, because the
blurred spokes object with a priority of 0 will draw before the interior banner, if for example it goes around
the windshield.
Of course, Alpha Blend mode is still required for glass objects and the blurred rim spokes.
When using priorities, make sure the priority is applied on the object level, not the sub-object level.
Additionally, if the transparent object is linked to a helper, you have to assign the priority on the highest
level in the hierarchy, thus the helper itself (see the section about Damage Glass).

![p071_X0](/images/pipeline/p071_X0.png)

It is recommended to detach all transparent object as separate objects in your 3D software before
exporting. AVOID including transparent objects in a group object with multiple material IDs. This is very
important because otherwise adding a new materiaI ID later on could cause the transparency and cast
shadow settings to “migrate” to another subobject, incorrectly assigning transparency to otherwise
opaque pieces of mesh.
Alpha Test mode usually works to a satisfying level when the alpha has no gradient. Alpha Test requires
no transparency, which is why no issues will arise if more layers are in front of one another. In Alpha Test
materials, transparency is defined by the Alpha channel in the Normal Map.
Alpha Test mode can also be used to hide certain objects using a simple texture (make sure you disable
shadow casting for those objects). Remember that you control transparency with the Normal Map alpha
channel.
Opaque mode is required for non-transparent objects, or where the shape of objects is defined by the
mesh. Make sure you don’t group objects with different properties in this respect under the same material.
If you have objects that require the alpha channel to define their border, group them under a new
material. As a general rule, keep alpha and non-alpha objects in separate materials.
Guide to shader types
Below you find a few shader types used for specific parts of the vehicle, showing the recommended
shader and blending mode (note that other properties are merely representative):

![p073_X1](/images/pipeline/p073_X1.png)

![p073_X0](/images/pipeline/p073_X0.png)

![p073_X2](/images/pipeline/p073_X2.png)

![p073_X4](/images/pipeline/p073_X4.png)

![p073_X3](/images/pipeline/p073_X3.png)

![p074_X0](/images/pipeline/p074_X0.png)

![p074_X1](/images/pipeline/p074_X1.png)

![p074_X2](/images/pipeline/p074_X2.png)
