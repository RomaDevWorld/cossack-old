module.exports = function (type) { 
    let array //Array variable

    if(type === 1){ //If type is 1
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
    }
    else if(type === 2){
        array = [
            '**Упс! Ми вронили магічний шар!**',
            '**Чітке "Ні."**',
            '**Чітке "Так."**',
            '**В магічного шара є сумніви..**',
            '**Духи кажуть "Так.."**\nАле чи можна їм довіряти?',
            '**Духи кажуть "Так.."**\nАле чи можна їм довіряти?',
            '**404: Не знайдено**',
            '**Духи засмучені цим запитанням**',
            '**Духам подобається Ваше запитання**'
        ]
    }
    else{
        array = ['null']
    }
    return array[Math.floor(Math.random()*array.length)]; //Get random item from defined array
};