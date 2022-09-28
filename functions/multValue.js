module.exports = function (arr, value) { 
    return value.every(value => {
        return arr.includes(value);
    })
};