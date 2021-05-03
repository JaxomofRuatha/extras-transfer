## How to Use

**You must have Node JS installed**

If not, go to https://nodejs.org/en/download/ for Windows version

Once Node is installed:

1. Open cmd or Powershell command prompt, either should work
2. Get the file paths for
    - This repository (Git clone to a local folder if you haven't already)
    - The MO2 profile that has the extras you want to migrate
    - The folder you want to make a copy to (NOT an existing LS install, empty folder is best for first time)
3. If you haven't already, do one or both of the following for the mods you want to be copied:
    - Create a separator called `Extras` and put any mods you want below it (or just put them below the `Occlusion Output` mod)
    - Add a comment to the mod with the content `LS_EXTRAS`
4. Run the following command, replacing the paths with the ones mentioned: `node <path_to_repository>/index.js <path_to_extras_profile> <path_to_destination_folder>`
    - Example, for me this was `node J:\Projects\extras-transfer\index.js "N:\MO2 Instances\Living Skyrim 3.0.0\profiles\Living Skyrim 3" "N:\MO2 Instances\LS Temp Extras"` in cmd