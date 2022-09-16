module.exports = function (type) { 
    let array

    if(type = 1){
        array = [
            "https://youtu.be/Hy8kmNEo1i8",
            "https://youtu.be/t0I4mTEdAf8",
            "https://youtu.be/hJY5jgO6HAc",
            "https://youtu.be/UC5VRrrd-xU",
            "https://youtu.be/4jxc_jyLbCM",
            "https://youtu.be/po_FqB0ygUU",
            "https://youtu.be/RKW6rjnYEkc",
            "https://youtu.be/ZZ5LpwO-An4",
            "https://youtu.be/b1qRgrTAwqA",
            "https://youtu.be/WXWpl_MXpuE",
            "https://youtu.be/dkM9GxaCow4",
            "https://youtu.be/mnCUqMB88Ww",
            "https://youtu.be/E-xhxS581Uc",
            "https://youtu.be/J2aJlb-bmuM",
            "https://youtu.be/uVTTkexJNwI",
            "https://youtu.be/1wF-JvimAV0",
            "https://youtu.be/M9J6DKJXoKk",
            "https://youtu.be/AD33rb6CL2A",
            "https://youtu.be/K4dAkcp6zrE",
            "https://youtu.be/g4mHPeMGTJM"
        ]
    }else{
        array = ['null']
    }
    return array[Math.floor(Math.random()*array.length)];
};