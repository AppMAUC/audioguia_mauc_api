const types = {
    audio: ['mp4', 'mpeg'],
    image: ['jpeg', 'png'],
    document: ['msword', 'pdf'],
};

const fileValidation = (type, arr, model = 'artworks') => {
    const newArr = arr.filter((file) => {
        for (let i = 0; i < types[type].length; i++) {
            if (!types[type].includes(file.mimetype.split('/')[1])) {
                return false;
            };
        };
        return true;
    });

    return arr.length == newArr.length;
}

module.exports = {
    types,
    fileValidation
};