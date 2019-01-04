import * as esgraph from 'esgraph';

var dotUpdate = [];
var forBranch = [];

function delSpaces(dotUpdate) {
    return dotUpdate.replace(/\s/g, '');
}

function removeExceptions() {
    for (let i = 0; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes('exception')) {
            dotUpdate.splice(i, 1);
            i--;
        }
    }
}
function removeExceptionsForDot(dot) {
    for (let i = 0; i < dot.length; i++) {
        if (dot[i].includes('exception')) {
            dot.splice(i, 1);
            i--;
        }
    }
    return dot;
}
function removeDeletedNodes() {
    for (let i = 0; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes('->')) {
            let tmpDotUpdate = delSpaces(dotUpdate[i]);
            let left = tmpDotUpdate.substring(0, tmpDotUpdate.indexOf('-'));
            let right = tmpDotUpdate.substring(tmpDotUpdate.indexOf('>') + 1, tmpDotUpdate.indexOf('['));
            if (left == right) {
                dotUpdate.splice(i, 1);
                i--;
            }
        }
    }
}

function getFirstString(dotUpdate) {
    if (dotUpdate.includes('let'))
        dotUpdate = dotUpdate.replace('let', '');
    else if (dotUpdate.includes('var'))
        dotUpdate = dotUpdate.replace('var', '');
    return dotUpdate.substring(0, (dotUpdate.lastIndexOf('"')));
}

function getString(dotUpdate) {
    let start = dotUpdate.indexOf('"');
    if (dotUpdate.includes('let'))
        start = dotUpdate.indexOf('let') + 3;
    else if (dotUpdate.includes('var'))
        start = dotUpdate.indexOf('var') + 3;
    let end = dotUpdate.lastIndexOf('"');
    return dotUpdate.substring(start + 1, end);
}

function deleteNodes(toDel, toConnect, j) {
    for (let i = j + 1; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes(toDel))
            dotUpdate[i] = dotUpdate[i].replace(toDel, toConnect);
    }
}

function getNodeIndex(dotUpdate) {
    return dotUpdate.substring(dotUpdate.indexOf('n'), dotUpdate.indexOf('[') - 1);
}

/*
function isThereNode(firstNode, node) {
    for (let i = 0; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes('->') && dotUpdate[i].includes(firstNode) && dotUpdate[i].includes(node))
            return 0;
    }
    return -1;
}
*/
function numOfPointers(firstNode, node) {
    let counter = 0;
    for (let i = 0; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes('->') && (dotUpdate[i].substring(dotUpdate[i].indexOf('->'))).includes(node) && !(dotUpdate[i].substring(0, dotUpdate[i].indexOf('->'))).includes(firstNode))
            counter++;
    }
    return counter;
}

function unionNodes3(j) {
    return (dotUpdate[j].includes(' = ') || dotUpdate[j].includes('++') || dotUpdate[j].includes('--') || dotUpdate[j].includes('+=') || dotUpdate[j].includes('-='));
}

function unionNodes4(flagToMore, indexToDel, i) {
    if (flagToMore == 1)
        dotUpdate.splice(i + 1, indexToDel);
}


function unionNodes2(i, indexToDel, tmpString) {
    let flagToMore = 0;
    if (dotUpdate[i].includes(' = ')) {
        let j = i;
        tmpString = getFirstString(dotUpdate[i]);
        let firstNode = getNodeIndex(dotUpdate[i]);
        j++;
        while (j < dotUpdate.length && (unionNodes3(j))) {
            let node = getNodeIndex(dotUpdate[j]);
            if (numOfPointers(firstNode, node) == 0) {
                flagToMore = 1;
                tmpString = tmpString + '\n' + getString(dotUpdate[j]);
                deleteNodes(node, firstNode, j);
                indexToDel++; j++;      } else break;  }
        tmpString = tmpString + '"]';
        unionNodes4(flagToMore, indexToDel, i);
        dotUpdate[i] = tmpString;
        tmpString = ''; indexToDel = 0;
    }
}

function unionNodes() {
    let tmpString = '';
    let indexToDel = 0;
    for (let i = 0; i < dotUpdate.length; i++) {
        unionNodes2(i, indexToDel, tmpString);
    }
}

function getExitNode() {
    let i = 1;
    while (i < dotUpdate.length && !dotUpdate[i].includes('->')) { i++; }
    return i - 1;
}

function addNumbers() {
    let end = getExitNode();
    let index = 1;
    for (let i = 1; i < end && !dotUpdate[i].includes('->') && dotUpdate[i].includes('shape'); i++) {
        if (dotUpdate[i].includes('return'))
            dotUpdate[i] = dotUpdate[i].slice(0, dotUpdate[i].indexOf('label') + 7) + '(' + (end - 1) + ')\n' + dotUpdate[i].slice(dotUpdate[i].indexOf('label') + 7);
        else {
            dotUpdate[i] = dotUpdate[i].slice(0, dotUpdate[i].indexOf('label') + 7) + '(' + index + ')\n' + dotUpdate[i].slice(dotUpdate[i].indexOf('label') + 7);
            index++;
        }
    }
}

function changeShape1(i) {
    for (let j = 0; j < i; j++) {
        let cond = dotUpdate[i].substring(0, dotUpdate[i].indexOf(' ->')) + ' ';
        if (dotUpdate[j].includes(cond) && !dotUpdate[j].includes('->') && !dotUpdate[j].includes('shape')) {
            //  dotUpdate[j] = dotUpdate[j].replace(']','');
            dotUpdate[j] = dotUpdate[j].substr(0, dotUpdate[j].lastIndexOf(']')) + dotUpdate[j].substr(dotUpdate[j].lastIndexOf(']') + 1);
            dotUpdate[j] = dotUpdate[j] + ' , shape = "diamond"]';
        }
    }
}

function changeShape2() {
    for (let i = 0; i < dotUpdate.length; i++) {
        if (!dotUpdate[i].includes('->') && !dotUpdate[i].includes('shape') && dotUpdate[i] != '') {
            dotUpdate[i] = dotUpdate[i].substr(0, dotUpdate[i].lastIndexOf(']')) + dotUpdate[i].substr(dotUpdate[i].lastIndexOf(']') + 1);
            dotUpdate[i] = dotUpdate[i] + ' , shape = "box"]';
        }
    }
}

function changeShape() {
    for (let i = 0; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes('->') && dotUpdate[i].includes('label')) {
            changeShape1(i);
        }
    }
    changeShape2();
}
function extractArgs2(tmpVal, i) {
    while (i + 1 < tmpVal.length && tmpVal[i].indexOf(']') != tmpVal[i].length - 1 && tmpVal[i + 1].indexOf(']') != tmpVal[i + 1].length - 1) {
        tmpVal[i] = tmpVal[i] + ',' + tmpVal[i + 1];
        tmpVal.splice(i + 1, 1);
    }

    return tmpVal;
}
/*
function stringUnion(tmpVal) {
    for (let i = 0; (i + 1) < tmpVal.length; i++) {
        if (tmpVal[i].indexOf('\'') == 0 && tmpVal[i].charAt(tmpVal[i].length - 1) != '\'')
            tmpVal = stringUnion2(i, tmpVal);
    }
    return tmpVal;
}

function stringUnion2(i, tmpVal) {
    while (i + 1 < tmpVal.length && tmpVal[i + 1].indexOf('\'') != tmpVal[i + 1].length - 1) {
        tmpVal[i] = tmpVal[i] + ' ' + tmpVal[i + 1];
        tmpVal.splice(i + 1, 1);
    }
    if (i + 1 < tmpVal.length && tmpVal[i + 1].indexOf('\'') == tmpVal[i + 1].length - 1) {
        tmpVal[i] = tmpVal[i] + ' ' + tmpVal[i + 1];
        tmpVal.splice(i + 1, 1);
    }
    return tmpVal;
}
*/
function extractArgs(argsDict) {
    var tmpVal = argsDict.split(',');
    for (var i = 0; (i + 1) < tmpVal.length; i++) {
        if (tmpVal[i].indexOf('[') != -1) {
            tmpVal = extractArgs2(tmpVal, i);
            if (i + 1 < tmpVal.length && tmpVal[i + 1].indexOf(']') == tmpVal[i + 1].length - 1) {
                tmpVal[i] = tmpVal[i] + ',' + tmpVal[i + 1];
                tmpVal.splice(i + 1, 1);
            }
            else
                forBranch[0] = 'test';
        }
    }
    // tmpVal = stringUnion(tmpVal);
    return tmpVal;
}

function getTheRealArgs(parseObj) {
    let index = 1;
    let arrArgs = [];
    while (index < parseObj.length) {
        if (parseObj[index].Type == 'Identifier') {
            arrArgs.push(parseObj[index].Name);
        }
        else
            break;
        index++;
    }
    return arrArgs;
}

function getArgs(args, parseObj) {
    let theArgs = extractArgs(args);
    let theReal = getTheRealArgs(parseObj);
    let theString = '';
    for (let i = 0; i < theArgs.length; i++) {
        theString += 'let ' + theReal[i] + ' = ' + theArgs[i] + '; ';
    }
    return theString;
}

function makeString() {
    let finalString = '';
    for (let i = 0; i < dotUpdate.length; i++)
        finalString += dotUpdate[i] + '\n';
    return finalString;
}

function getDetailsArr(dot, args, parseObj) {
    let arr = [];
    arr.push(getArgs(args, parseObj));
    //arr.push(`let x = 'hi'; let y = 5; let z = 2; let arr = [1,2,true];`);
    let i = 1;
    while (i < dot.length - 1 && !dot[i].includes('->')) {
        let start = dot[i].indexOf('label') + 7;
        let end = dot[i].lastIndexOf(']') - 1;
        arr.push((dot[i].substring(start, end)) + ';');
        i++;
    }
    return arr;
}

function getPathArr2(dot) {
    let i = 0;
    while (i < dot.length && !dot[i].includes('->')) i++;
    return i;
}

function getPathArr(dot) {
    dot = removeExceptionsForDot(dot);
    let arr = [];
    let i = 0;
    i = getPathArr2(dot);
    while (i < dot.length && dot[i].includes('->')) {
        let tmp = delSpaces(dot[i]);
        let left = tmp.substring(1, tmp.indexOf('-'));
        let right = tmp.substring(tmp.indexOf('>') + 2, tmp.indexOf('['));
        if (left == arr.length - 1) {
            arr.splice(left, 1, arr[left] + '@' + right);
        }
        else
            arr.splice(left, 0, right);
        i++;
    }
    return arr;
}

function addColors2(arrPath, i) {
    for (let j = 0; j < arrPath.length; j++) {
        if ((!dotUpdate[i].includes('color = "green"') && (dotUpdate[i].includes('n' + arrPath[j] + ' ')))) {
            dotUpdate[i] = dotUpdate[i].substr(0, dotUpdate[i].lastIndexOf(']')) + dotUpdate[i].substr(dotUpdate[i].lastIndexOf(']') + 1);
            dotUpdate[i] = dotUpdate[i] + ' , style = "filled" , color = "green"]';
            break;
        }
    }
}

function isGreen(node) {
    for (let i = 0; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes(node) && dotUpdate[i].includes('green')) {
            return true;
        }
    }
    return false;
}

function addColors3(first) {
    let counter = 0;
    for (let i = 0; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes('->') && dotUpdate[i].split('->')[1].includes(first) && isGreen(dotUpdate[i].split('->')[0])) {
            counter++;
        }
    }
    return counter;
}


function addColors4(first) {
    let counter = 0;
    for (let i = 0; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes('->') && dotUpdate[i].split('->')[0].includes(first) && isGreen(dotUpdate[i].split('-> ')[1].substring(0, dotUpdate[i].split('->')[1].indexOf('[')))) {
            counter++;
        }
    }
    return counter;
}

function addcolors1(j){
    if (!dotUpdate[j].includes('color = "green"') && (dotUpdate[j].includes('shape="circle"'))) {
        let first = dotUpdate[j].substring(0, dotUpdate[j].indexOf('['));
        if (addColors3(first) > 0 && addColors4(first) > 0) {
            dotUpdate[j] = dotUpdate[j].substr(0, dotUpdate[j].lastIndexOf(']')) + dotUpdate[j].substr(dotUpdate[j].lastIndexOf(']') + 1);
            dotUpdate[j] = dotUpdate[j] + ' , style = "filled" , color = "green"]';
        }
    }
}

function addColors(arrPath) {
    for (let i = 0; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes('->'))
            break;
        else {
            addColors2(arrPath, i);
        }
    }
    for (let j = 0; j < dotUpdate.length; j++) {
        addcolors1(j);
    }
}

function findPath1(details, i, thePath) {
    if ((details[i].includes('let')) && (thePath.includes(details[i])))
        thePath += details[i].substring(details[i].indexOf('let') + 3);
    else if ((details[i].includes('var')) && (thePath.includes(details[i])))
        thePath += details[i].substring(details[i].indexOf('var') + 3);
    else
        thePath += details[i];
    return thePath;
}

function findPath2(i, thePath) {
    if (eval(thePath))
        i = (i.split('@'))[0];
    else
        i = (i.split('@'))[1];
    return i;
}

function findPath(dot, args, parseObj) {
    let theNodes = [];
    let details = getDetailsArr(dot, args, parseObj);
    let path = getPathArr(dot);
    let thePath = details[0];
    let i = path[0];
    theNodes.push(i);
    while (i < path.length - 1) {
        thePath = findPath1(details, i, thePath);
        i = path[i];
        if (i.includes('@'))
            i = findPath2(i, thePath);
        theNodes.push(i);
    }
    return theNodes;
}

function numOfPointersForCir(first) {
    let counter = 0;
    for (let i = 0; i < dotUpdate.length; i++) {
        if (dotUpdate[i].includes('->') && dotUpdate[i].split('->')[1].includes(first + ' '))
            counter++;
    }
    return counter;
}

function addCircles2(j, first) {
    if (dotUpdate[j].includes('->') && dotUpdate[j].split('->')[1].includes(first + ' ')) {
        dotUpdate[j] = dotUpdate[j].replace(first, 'n' + (dotUpdate.length - 1));
    }
}

function addCircles() {
    for (let i = 0; i < dotUpdate.length - 1; i++) {
        let first = getNodeIndex(dotUpdate[i]);
        if (first != '' && numOfPointersForCir(first) > 1) {
            dotUpdate.splice(i, 0, 'n' + (dotUpdate.length) + ' [label="", shape="circle"]');
            for (let j = 0; j < dotUpdate.length; j++) {
                addCircles2(j, first);
            }
            dotUpdate.splice(dotUpdate.length - 1, 0, 'n' + (dotUpdate.length - 1) + ' -> ' + first + ' []');
        }
    }
}

const part3 = (parsed, sourceCode, args, globalTable) => {
    dotUpdate = [];
    let cfg = esgraph(parsed.body[0].body);
    let dot = esgraph.dot(cfg, { counter: 0, source: sourceCode });
    dotUpdate = dot.split('\n');
    let path = findPath(dot.split('\n'), args, globalTable);
    unionNodes();
    removeExceptions();
    removeDeletedNodes();
    addCircles();
    changeShape();
    addNumbers();
    addColors(path);
    dotUpdate = makeString();
    return dotUpdate;
};

export { part3, delSpaces, removeExceptionsForDot, getString, getNodeIndex, makeString };