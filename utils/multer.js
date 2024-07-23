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

const getFileNames = (array) => {
    const names = array.map((item) => {
        return item.filename
    });
    return names
}

module.exports = {
    getPath,
    getFolder,
    getFileNames
}