const fs = require('fs-extra');
const path = require('path');
const ini = require('ini');

function mergeArraysUnique(...inputArrays) {
    let combinedArray = [];

    inputArrays.forEach(inputArray => {
        combinedArray = [...combinedArray, ...inputArray]
    });

    return Array.from(new Set([...combinedArray]));
}

function getModlistData(profilePath) {
    const modlistRaw = fs.readFileSync(path.join(profilePath, 'modlist.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }

        return data;
    });
    const modlistArray = modlistRaw.trim().split('\r\n').slice(1);

    return modlistArray.reverse().map((m, i) => {
        const activeFlag = m.slice(0, 1);
        const modName = m.slice(1);

        return {
            modName,
            activeFlag,
            index: i,
            modlistString: m
        };
    })
}

function getExtrasModsFromModlistData(modlistData) {
    const extrasSeparator = modlistData.find(o => {
        return o.modName === 'Extras_separator';
    });
    
    return modlistData.slice(extrasSeparator.index);
}

function getModDirNames(profilePath) {
    return fs.readdirSync(path.join(profilePath, '../../mods'));
}

function parseModIni(modPath) {
    return ini.parse(fs.readFileSync(modPath, 'utf-8'));
}

function addIniToModData(profilePath, modData) {
    const modIniPath = path.join(profilePath, '../../mods', modData.modName, 'meta.ini');
    return fs.existsSync(modIniPath) ? (Object.assign({ iniData: parseModIni(modIniPath) }, modData)) : modData;
}

function getCommentedMods(modDataArrayWithInis, commentString) {
    return modDataArrayWithInis.filter(m => {
        return m.iniData && m.iniData.General.comments ? m.iniData.General.comments.toUpperCase() === commentString.toUpperCase(): '';
    });
}

function getAllExtraModData(sourceProfilePath) {
    const modsInFolder = getModDirNames(sourceProfilePath);
    const modsWithFolder = getModlistData(sourceProfilePath).filter(m => {
        return modsInFolder.includes(m.modName);
    });
    const allModlistData = modsWithFolder.map(m => {
        return addIniToModData(sourceProfilePath, m);
    });
    const extrasSeparatedModDataArray = getExtrasModsFromModlistData(allModlistData);
    const extrasCommentedModDataArray = getCommentedMods(allModlistData, 'LS_EXTRAS');

    return mergeArraysUnique(extrasSeparatedModDataArray, extrasCommentedModDataArray);
}

function createModlist(copyDir, modlistStrings) {
    const modlistFileString = modlistStrings.join('\r\n');
    const modlistFileTargetPath = path.join(copyDir, 'profiles/LSExtras/modlist.txt');
    fs.outputFileSync(modlistFileTargetPath, modlistFileString);
}

function copyModFolders(sourceProfilePath, copyDir, extrasModDataArray) {
    extrasModDataArray.forEach(m => {
        fs.ensureDirSync(path.join(copyDir, 'mods', m.modName));
        fs.copySync(path.join(sourceProfilePath, '../../mods', m.modName), path.join(copyDir, 'mods', m.modName));
    });
}

const sourceProfile = process.argv[2];
const copyDir = process.argv[3];
const targetProfile = process.argv[4];

const allExtraModData = getAllExtraModData(sourceProfile);
const extraModlistStrings = allExtraModData.map(m => m.modlistString);
createModlist(copyDir, extraModlistStrings);
copyModFolders(sourceProfile, copyDir, allExtraModData);