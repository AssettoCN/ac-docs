---
title: General Overview
---

# General Overview

Custom Shaders Patch (CSP) is split into modules that can be disabled individually. Some options don't belong to any module, and a few features cannot be disabled. This section covers CSP's general features and configuration.

## Modules

### Lighting FX

Adds dynamic lighting to track and car lights, such as headlights. Track lights are set up by the track configuration; car lights can be defined in car configs — if not defined, they are guessed automatically based on the model, textures, manufacture year and other parameters. Rendering is accelerated with [BVH-accelerated shading](https://worldoffries.wordpress.com/2015/02/19/simple-alternative-to-clustered-shading-for-thousands-of-lights/), supporting hundreds of lights at once.

Supported light types:
- Point light
- Spot light
- Double trimmed spot light, used for headlights
- Line light, used for underbody neons and similar

### Extra FX

Adds extra rendering passes to collect more scene information, such as normal maps, depth or motion buffers. Based on that information, the following new effects become possible:

- Local reflections (SSLR)
- Ambient occlusion (SSAO or HBAO+)
- New motion blur
- Temporal antialiasing (TAA)
- Simple local light bounces (SSGI)
- [Scene-wide light bounces](https://youtu.be/R9gsC5vB1Eg) (non-screen-space)
- Volumetric lights
- Fog blur

<!-- Image: https://i.imgur.com/as1FEAj.png — volumetric lights screenshot -->

## Section Contents

| Page | Description |
|------|-------------|
| [Troubleshooting](./troubleshooting) | Common problems and solutions |
| [Filtering](./filtering) | Entity filtering, masks and extended filter syntax in configs |
| [Linear Color Space](./linear-color-space) | Details of the linear color space feature (added in v0.2.3) |
| [Shader Replacements](./shader-replacements) | Statically replacing shaders, material parameters, textures and object properties |
| [Model Replacements](./model-replacements) | Removing, replacing or inserting 3D model pieces |
| [Scene Queries](./scene-queries) | Advanced query syntax for nodes and meshes |
| [Extra FX Flags](./extra-fx-flags) | Flags related to Extra FX opacity, motion blur and TAA |
| [Extra FX Emissive](./extra-fx-emissive) | Emissive meshes casting actual light onto nearby geometry |
| [UV2](./uv2) | Secondary UV mapping and decal texture overlay |
| [Mesh Adjustment](./mesh-adjustment) | Adjusting mesh object properties such as visibility, layers, etc. |
| [Screenshots Name Format](./screenshots-name-format) | Custom screenshot filename format (added in v0.1.60) |

## Source

- [CSP Official Wiki original](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/General-–-CSP-features) — content source
- [acc-extension-config repository](https://github.com/ac-custom-shaders-patch/acc-extension-config) — official CSP configuration files
