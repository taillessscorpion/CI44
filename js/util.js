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