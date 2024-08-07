const { types } = require('../config/files');

const getPath = (param) => {
    return param.replace('/', '').split('/')[1];
};

const getFolder = (field) => {
    const arr = Object.keys(types);
    const folder = arr.find((item) => {
        return field.match(item);
    })
    return folder ? folder : new Error('Campo não identificado');
}

const getAdvancedFolder = (file, url) => {
    let a = getFolder(file.fieldname);
    let b = getPath(url);
    let lang = file.originalname.match(/\-(br|en)/);

    if (a == 'audio' && lang) {
        return `${a}s/${b}/${lang[1]}`;
    }

    return `${a}s/${b}`
}

const getFileNames = (array) => {
    const names = array.map((item) => {
        return item.filename
    });
    return names
}

module.exports = {
    getPath,
    getFolder,
    getFileNames,
    getAdvancedFolder
}