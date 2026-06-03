---
title: Audio Modding Pipeline
---

# Audio Modding Pipeline

AC EVO Audio Modding Pipeline — the complete workflow for creating custom car audio packages using FMOD Studio.

## Changelog {#changelog}

- **June 3, 2026**: V1 initial release

## Prerequisites {#prerequisites}

- **FMOD Studio v2.03.13** — [Download page](https://www.fmod.com/download)
- FMOD knowledge

## FMOD Script Installation {#script-installation}

Find the `fmodScript.js` file in the `acevo_content\tools\scripts` folder. Copy this file into your FMOD `scripts` folder (typically `C:\Program Files\FMOD SoundSystem\FMOD Studio 2.03.13\scripts`). You will need it later inside FMOD Studio.

![FMOD script installation location](/evo/audio/image7.png)

## Prepare FMOD Mod Project {#prepare-project}

Open the FMOD modding project and the main workspace should be shown (`CTRL + 1`). You will see all the events you can work on and then assign them to the car in the editor.

The **workflow** is the following:

1. Fork the events with new ones by script
2. Set a new master bank by script
3. Delete the old master bank (and the default associated events)
4. Make your work on the sounds (not part of this pipeline document)
5. Build the banks

![FMOD mod project workspace — events with template suffix](/evo/audio/image8.png)

### Step 1: Fork Template Events

As you can see, there is a `template` suffix for each event. **The default events SHALL NOT BE USED** — it will generate a conflict with other cars.

1. Select all events with the `template` suffix (as shown in the picture above).
2. Open the top menu **Scripts → Mod Tools → Fork Selected \*\_template**.
3. The script will generate an exact copy of the selected events with a new suffix.
   - You can change the suffix by editing the script with a text editor.

![Fork script execution result — newly created event copies](/evo/audio/image6.png)

**Best practice**: set the event suffix equal to the name of the corresponding modded car folder.

The first script also unassigns the default events from the original master bank, keeping the project lighter and cleaner.

### Step 2: Clone the Master Bank

The next step is to clone the `master_bank`. Select the **Banks** tab, select `master_bank_template`, and then run the **Scripts → Clone Selected Banks** script as shown below.

![Clone Selected Banks script menu](/evo/audio/image5.png)

![Cloned master_bank result](/evo/audio/image1.png)

The result is a perfect copy of the original `master_bank_template`.

### Step 3: Mark the New Master Bank

1. Right-click on the new bank and select **Mark as Master Bank**.
2. Confirm that a new **Master** label appears next to it.
3. You can now safely remove the original `master_bank_template`.

Once done, the project is ready and you can start working on your own sound package.

## Build Sound Banks {#build-banks}

Once you are happy with your work, it is time to build the banks. Press `F7` or use the **Build…** command in the main menu as shown in the picture.

![Build menu](/evo/audio/image9.png)

This will build two banks:

| File | Description |
|------|-------------|
| `master_bank.bank` | Main audio data package |
| `master_bank.strings.bank` | String index data package |

Both files shall be placed inside the `sfx` folder in your modded car folder.

![Built bank files](/evo/audio/image2.png)

:::danger
**DO NOT touch the Mixer page in FMOD (CTRL + 2)! Modifying the Mixer will mess up the entire game audio!**

Use the events volume instead.
:::

## Assign Sound Events {#assign-events}

1. Open the editor, select the **Tools** menu and open **CarFinalState**. A window like this will be shown.
2. At the top you can see many tabs. Click on the **Audio events** tab:

![CarFinalState window — Audio events tab](/evo/audio/image3.png)

3. For each audio event, perform the following:
   - In the first dropdown menu, select the proper event type (e.g. `EngineInt`).
   - Click the `...` button, type `master` in the Filter field, and choose `master_bank.bank`.
   - In the last dropdown menu, choose the corresponding audio event (e.g. `engine_int_ks_modded_car`).
4. Repeat for the other audio events.
5. When you have completed the assignments, click **Save reference actor** at the bottom of the list.

![Save reference actor button](/evo/audio/image4.png)

Now you are ready to test your car audio in game!

---

## References

- Kunos Simulazioni, AC EVO Audio Modding Pipeline official documentation
