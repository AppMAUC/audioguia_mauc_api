const fs = require('fs');
const path = require('path');

// Factory para criar os objetos elements
const createElements = (audios = [], images = []) => {
    return {
        audios: audios,
        images: images
    };
};

// Função para verificar se o arquivo já existe
const fileExists = (filePath) => {
    try {
        return fs.existsSync(filePath);
    } catch (err) {
        console.error("Erro ao verificar se o arquivo existe:", err);
        return false;
    }
};

const getFilesPaths = (elements, model) => {

    const getPaths = Object.keys(elements).map((file) => {
        return elements[file].map((e) => {
            return path.join('uploads', file, model, file == 'audios' ? e.match(/\-(br|en)/)[1] + `\\${e}` : e)
        })
    });

    return getPaths.flat()
}

const getFilePath = (file, model, item) => {
    return path.join('uploads', file, model, file == 'audios' ? item.match(/\-(br|en)/)[1] + `\\${item}` : item);
}


const deleteFiles = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if(fileExists(arr[i])) {
            fs.unlinkSync(arr[i]);
        }
    }
}

module.exports = {
    deleteFiles,
    getFilesPaths,
    getFilePath,
    createElements,
    fileExists
}
