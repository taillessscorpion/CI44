const utils = {};
utils.getDataFromDoc = (doc) => {
    const data = doc.data();
    data.id = doc.id;
    return data
}
utils.getDataFromDocs = (docs) => {
    return docs.map(utils.getDataFromDoc)
}
utils.getArrayFromPostionToPosion = (array, positionStart, posiotionEnd, positionDistance) => {
    if(positionDistance === null) {positionDistance = 1}
    var newArray = [];
    for(i=positionStart;i<posiotionEnd;i++) {
        newArray.push(array[i]);
    }
    return newArray
}
utils.arrayCollapseToString = (array) => {
    newString = '';
    for(i=0;i<array.length;i++) {
        newString += array[i].toString()
    }
    return newString;
}
utils.getUrlFromBackground = (backgroundUrl) => {
    let newArray = Array.from(backgroundUrl);
    let arrayOfUrl = utils.getArrayFromPostionToPosion(newArray, newArray.indexOf('"')+1, newArray.lastIndexOf('"'));
    return utils.arrayCollapseToString(arrayOfUrl);
}
utils.getISOStringDate = () => {
    let newDate = new Date();
    return newDate.toISOString();
}
utils.getYearsTwoLastNumber = (year) => {
    year = year.toString().split('');
    if(year.length === 4) {
        return Number(year[2] + year [3])
    } else {
        console.log('utils.getYearsTwoLastNumber takes a wrong input')
    }
}
utils.fullfillDateMonth = (date) => {
    date = date.toString();
    if(date.length === 1) {
        return 0 + date
    } else if (date.length === 2) {
        return date
    } else {
        console.log('utils.fullfillDateMonth takes a wrong input')
    }
}
utils.converseTimeFromISOString = (string) => {
    newDateFromString = new Date(string);
    let getMins = utils.fullfillDateMonth(newDateFromString.getMinutes());
    let getHours = utils.fullfillDateMonth(newDateFromString.getHours());
    let getDate = utils.fullfillDateMonth(newDateFromString.getHours());
    let getMonth = utils.fullfillDateMonth(newDateFromString.getMonth());
    let getYear = utils.getYearsTwoLastNumber(newDateFromString.getFullYear());
    return `${getHours}:${getMins}, ${getDate}/${getMonth}/${getYear}`
}
