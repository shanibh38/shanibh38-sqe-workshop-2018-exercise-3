var globAndArgs = {};
var locals = {};
var tmpglobAndArgs = {};
var argsDicitonary = {};
var tmplocals = {};
var conditionIndex = 0;
var linesToIgnoer = [];

function fixArrAfterAss(changeVal, start, end, tmpVal, tmpIndex, tmpName) {
    let fixArr = '[';
    start = changeVal.indexOf('[');
    end = changeVal.indexOf(']');
    let tmpArr = changeVal.substring(start + 1, end);
    tmpArr = tmpArr.split(',');
    tmpArr[tmpIndex] = tmpVal;
    for (var i = 0; i < tmpArr.length; i++) {
        if (i == 0)
            fixArr = fixArr + tmpArr[i];
        else
            fixArr = fixArr + ',' + tmpArr[i];
    }
    fixArr = fixArr + ']';
    /*if (type == 'Globals')
        globAndArgs[tmpName] = fixArr;
    else if (type == 'Locals')*/
    locals[tmpName] = fixArr;
}

function arrayNameHandlerPart2(tmpVal, type, tmpName) {
    if (type == 'Globals') {
        globAndArgs[tmpName] = tmpVal;
        globAndArgs[tmpName + '[0]'] = tmpVal;
    }
    else/* if (type == 'Locals')*/ {
        locals[tmpName + '[0]'] = tmpVal;
        locals[tmpName + '[0]'] = tmpVal;
    }
}

function arrayNameHandler(tmpVal, type, name) {
    let start = name.indexOf('[');
    let end = name.indexOf(']');
    let tmpName = name.substring(0, start);
    let tmpIndex = name.substring(start + 1, end);
    let changeVal = '';
    if (type == 'Globals')
        changeVal = globAndArgs[tmpName];
    else if (type == 'Locals')
        changeVal = locals[tmpName];
    if (changeVal.indexOf(',') == -1)
        arrayNameHandlerPart2(tmpVal, type, tmpName);
    else
        fixArrAfterAss(changeVal, start, end, tmpVal, tmpIndex, tmpName);
}

function delPreviousArrPart1(name) {
    let prevArgs = globAndArgs[name].split(',');
    if (prevArgs != undefined) {
        for (var i = 0; i < prevArgs.length; i++)
            delete globAndArgs[name + '[' + i + ']'];
    }
}

function delPreviousArrPart2(name) {
    let prevArgs = locals[name].split(',');
    if (prevArgs != undefined) {
        for (var i = 0; i < prevArgs.length; i++)
            delete locals[name + '[' + i + ']'];
    }
}

function delPreviousArr(name) {
    if (globAndArgs[name] != undefined)
        delPreviousArrPart1(name);
    else if (locals[name] != undefined)
        delPreviousArrPart2(name);
}

function arrayHandlerTypes1(type, name, tmpArr, i) {
    if (type == 'Globals')
        globAndArgs[name + '[' + i + ']'] = tmpArr[i];
    else /*if (type == 'Locals')*/
        locals[name + '[' + i + ']'] = tmpArr[i];
}

function arrayHandlerTypes2(type, name, tmpArr) {
    if (type == 'Globals')
        globAndArgs[name] = '[' + tmpArr.toString() + ']';
    else/* if (type == 'Locals')*/
        locals[name] = '[' + tmpArr.toString() + ']';
}

function arrayHandlerContPart1(name, type, tmpArr) {
    /* if (type == 'Locals') {
         locals[name] = '[' + tmpArr + ']';
         locals[name + '[0]'] = tmpArr;
     }*/
    if (type == 'Globals') {
        globAndArgs[name] = '[' + tmpArr + ']';
        globAndArgs[name + '[0]'] = tmpArr;
    }
}
function arrayHandlerContPart2(name, type, tmpArr) {
    if (type == 'Globals') {
        globAndArgs[name] = '[' + tmpArr + ']';
        globAndArgs[name + '[0]'] = tmpArr;
    }
    else/* if (type == 'Locals')*/ {
        locals[name] = '[' + tmpArr + ']';
        locals[name + '[0]'] = tmpArr;
    }

}
function arrayHandlerCont(name, type, tmpArr) {
    if (globAndArgs[name] != undefined)
        arrayHandlerContPart1(name, type, tmpArr);
    else/* if (locals[name] != undefined)*/
        arrayHandlerContPart2(name, type, tmpArr);
}

function arrayHandler(tmpVal, type, name) {
    delPreviousArr(name);
    let start = tmpVal.indexOf('[');
    let end = tmpVal.lastIndexOf(']');
    let tmpArr = tmpVal.substring(start + 1, end);
    if (tmpArr.indexOf(',') != -1) {
        tmpArr = tmpArr.split(',');
        for (var i = 0; i < tmpArr.length; i++) {
            if (locals[tmpArr[i]] != undefined) { tmpArr[i] = locals[tmpArr[i]]; }
            else if (globAndArgs[tmpArr[i]] != undefined) { tmpArr[i] = globAndArgs[tmpArr[i]]; }
            arrayHandlerTypes1(type, name, tmpArr, i);
        }
        arrayHandlerTypes2(type, name, tmpArr);
    }
    else
        arrayHandlerCont(name, type, tmpArr);
}

function parseConditionStatments(statmentToParse, parseObj, index) {
    tmpglobAndArgs[conditionIndex] = Object.assign({}, globAndArgs);
    tmplocals[conditionIndex] = Object.assign({}, locals);
    conditionIndex++;
    let strVal = '';
    if (statmentToParse.Type == 'IfStatemenet')
        strVal = 'if ';
    else if (statmentToParse.Type == 'ElseIfStatement')
        strVal = 'else if ';
    else/* if (statmentToParse.Type == 'WhileStatement')*/
        strVal = 'while ';

    let tmpVal = parseStatments(statmentToParse, 'Condition', false, parseObj, index);
    return strVal + tmpVal;
}

function parseVarPart1(tmpVal, statmentToParse) {
    if (tmpVal.indexOf('[') == 0/* && tmpVal.lastIndexOf(']')==tmpVal[tmpVal.length-2]*/)
        arrayHandler(tmpVal, 'Globals', statmentToParse.Name);
    else
        globAndArgs[statmentToParse.Name] = tmpVal;
    if ((statmentToParse.Name).indexOf('[') != -1)
        arrayNameHandler(tmpVal, 'Globals', statmentToParse.Name);
}

function parseVarPart2(tmpVal, statmentToParse) {
    if (tmpVal.indexOf('[') == 0 /*&& tmpVal.lastIndexOf(']')==tmpVal[tmpVal.length-2]*/)
        arrayHandler(tmpVal, 'Locals', statmentToParse.Name);
    else {
        if (statmentToParse.Name != '')
            locals[statmentToParse.Name] = tmpVal;
    }
    if ((statmentToParse.Name).indexOf('[') != -1)
        arrayNameHandler(tmpVal, 'Locals', statmentToParse.Name);
}

function parseVarsStatmentsPart3(statmentToParse, tmpVal) {
    let toRet = '';
    if (statmentToParse.Type == 'AssignmentExpression')
        toRet = statmentToParse.Name + ' = ' + tmpVal;
    else if (statmentToParse.Type == 'ReturnStatement')
        toRet = 'return ' + tmpVal;
    return toRet;
}
function parseVarsStatmentsPart2(statmentToParse, tmpVal) {
    let toRet = '';
    if (statmentToParse.Type == 'VariableDeclarator')
        toRet = '';
    else if (locals[statmentToParse.Name] != undefined && statmentToParse.Type == 'AssignmentExpression')
        toRet = '';
    else
        toRet = parseVarsStatmentsPart3(statmentToParse, tmpVal);
    return toRet;
}

function parseStatmentsWithEval(statmentToParse, tmpVal) {
    let strVal = '';
    for (var i = 0; i < tmpVal.length; i++) {
        if (locals[tmpVal[i]] != undefined) { tmpVal[i] = locals[tmpVal[i]]; }
        else if (globAndArgs[tmpVal[i]] != undefined) { tmpVal[i] = globAndArgs[tmpVal[i]]; }
        if (i == 0)
            strVal = strVal + tmpVal[i];
        else
            strVal = strVal + ' ' + tmpVal[i];
    }
    return strVal;
}

function parseVarsStatments(statmentToParse, parseObj, index) {
    let tmpVal = parseStatments(statmentToParse, 'Vars', false, parseObj, index);
    let tmpValWithEval = parseStatments(statmentToParse, 'Vars', true, parseObj, index);
    if (globAndArgs[statmentToParse.Name] != undefined)
        parseVarPart1(tmpValWithEval, statmentToParse);
    else
        parseVarPart2(tmpValWithEval, statmentToParse);
    return parseVarsStatmentsPart2(statmentToParse, tmpVal);
}

function unionArray(tmpVal) {
    let arr = '';
    for (let i = 0; i < tmpVal.length; i++) {
        if (i == 0)
            arr = arr + tmpVal[i];
        else
            arr = arr + ' ' + tmpVal[i];
    }
    return arr;
}

function parseStatmentsPart2Plus(tmpVal) {
    let strVal = '';
    for (var i = 0; i < tmpVal.length; i++) {
        if (locals[tmpVal[i]] != undefined) { tmpVal[i] = locals[tmpVal[i]]; }
        else if (globAndArgs[tmpVal[i]] != undefined) { tmpVal[i] = globAndArgs[tmpVal[i]]; }
        if (i == 0)
            strVal = strVal + tmpVal[i];
        else
            strVal = strVal + ' ' + tmpVal[i];
    }
    return strVal;
}

function parseStatmentsPart2PlusPlus(statmentToParse, strVal, parseObj, index) {
    let subsVal = '';
    if (statmentToParse.Type == 'IfStatemenet' || statmentToParse.Type == 'ElseIfStatement' || statmentToParse.Type == 'ElseStatement' || statmentToParse.Type == 'WhileStatement')
        subsVal = strVal + /*'{'+*/ evalHandler(strVal, statmentToParse, parseObj, index)/* +'\n'*/;
    else
        subsVal = strVal /*+ '{\n'*/;
    return subsVal;
}
function parseStatmentsPart2(statmentToParse, tmpVal, withEval, parseObj, index) {
    if (withEval)
        return parseStatmentsWithEval(statmentToParse, tmpVal);
    else {
        let strVal = '', subsVal = '';
        strVal = parseStatmentsPart2Plus(tmpVal);
        subsVal = parseStatmentsPart2PlusPlus(statmentToParse, strVal, parseObj, index);
        return subsVal;
    }
}

function parseStatments(statmentToParse, type, withEval, parseObj, index) {
    let varType = '';
    if (type == 'Vars')
        varType = statmentToParse.Value;
    else/* if (type == 'Condition')*/
        varType = statmentToParse.Condition;
    let tmpVal = varType.match(/[A-Za-z0-9_(){}=<>[\].?!",\-*&^%$#+//[\]']+/g);
    tmpVal = arrayUnion(tmpVal);
    tmpVal = stringUnion(tmpVal);
    return parseStatmentsPart2(statmentToParse, tmpVal, withEval, parseObj, index);
}

function getArgsContPart1(i, args, parseObj, index) {
    //   if (args[i] == '')
    //       return -1;
    //   else {
    /*  flag = 0;*/
    globAndArgs[parseObj[index].Name] = parseObj[index].Name;
    argsDicitonary[parseObj[index].Name] = args[i];
    if (args[i].indexOf('[') == 0) {
        let tmpArr = args[i].substring(1, args[i].length - 1).split(',');
        for (var j = 0; j < tmpArr.length; j++) {
            globAndArgs[parseObj[index].Name + '[' + j + ']'] = parseObj[index].Name + '[' + j + ']';
            argsDicitonary[parseObj[index].Name + '[' + j + ']'] = tmpArr[j];
        }
    }
    i++;
    return i;
    // }
}

function getArgs(args, index, line, parseObj) {
    let /*flag = -1, */i = 0;
    while (index < parseObj.length) {
        if (parseObj[index].Line == line && parseObj[index].Type == 'Identifier')
            i = getArgsContPart1(i, args, parseObj, index);
        else {
            /*  if (flag == -1) return flag;
            else*/ return index;
        }
        index++;
    }
    //    return /*flag*/ -1;
}
function arrayUnion2(tmpVal, i) {
    while (i + 1 < tmpVal.length && tmpVal[i].lastIndexOf(']') != tmpVal[i].length - 1 && tmpVal[i + 1].lastIndexOf(']') != tmpVal[i + 1].length - 1) {
        tmpVal[i] = tmpVal[i] + ' ' + tmpVal[i + 1];
        tmpVal.splice(i + 1, 1);
    }
    return tmpVal;
}


function arrayUnion(tmpVal) {
    for (let i = 0; (i + 1) < tmpVal.length; i++) {
        if (tmpVal[i].indexOf('[') == 0) {
            tmpVal = arrayUnion2(tmpVal, i);
            if (i + 1 < tmpVal.length && tmpVal[i + 1].lastIndexOf(']') == tmpVal[i + 1].length - 1) {
                tmpVal[i] = tmpVal[i] + ' ' + tmpVal[i + 1];
                tmpVal.splice(i + 1, 1);
            }
        }
    }
    return tmpVal;
}

function hasReturn(statmentToParse, parseObj, i) {
    //  let start = statmentToParse.Line;
    //  let end = statmentToParse.EndLine;
    for (var j = i; j < parseObj.length && parseObj[j].Line < statmentToParse.EndLine; j++) {
        if (parseObj[j].Type == 'ReturnStatement')
            return parseObj[j].Line;
    }
    return -1;
}

function evalHandlerpart2(strVal) {
    for (let i = 0; i < strVal.length; i++) {
        strVal = strVal.split(' ');
        strVal = arrayUnion(strVal);
        strVal = stringUnion(strVal);
        for (var j = 0; j < strVal.length; j++) {
            if (argsDicitonary[strVal[j]] != undefined)
                strVal[j] = argsDicitonary[strVal[j]];
        }
        strVal = unionArray(strVal);
    }
    return strVal;
}

function evalHandler1(statmentToParse, linesToIgnoer) {
    for (let i = 0; i < linesToIgnoer.length; i++) {
        if (linesToIgnoer[i].start <= statmentToParse.Line && linesToIgnoer[i].end >= statmentToParse.EndLine)
            return '';
    }
}

function evalHandler(strVal, statmentToParse, parseObj, index) {
    let tmpFrom1 = evalHandler1(statmentToParse, linesToIgnoer);
    if (tmpFrom1 == '')
        return '';
    else {
        strVal = evalHandlerpart2(strVal);
        if (eval(strVal)) {
            let tmp = hasReturn(statmentToParse, parseObj, index);
            if (tmp != -1)
                linesToIgnoer.push({ 'start': statmentToParse.EndLine, 'end': parseObj[parseObj.length - 1].Line });
            return '@green@';
        }
        else {
            linesToIgnoer.push({ 'start': statmentToParse.Line, 'end': statmentToParse.EndLine });
            return '@red@';
        }
    }
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

function stringUnion(tmpVal) {
    for (let i = 0; (i + 1) < tmpVal.length; i++) {
        if (tmpVal[i].indexOf('\'') == 0 && tmpVal[i].charAt(tmpVal[i].length - 1) != '\'')
            tmpVal = stringUnion2(i, tmpVal);
    }
    return tmpVal;
}

function parseGlobStatmentsPart11(statmentToParse, varType) {
    if (varType.indexOf('[') != -1)
        arrayHandler(varType, 'Globals', statmentToParse.Name);
    if ((statmentToParse.Name).indexOf('[') != -1)
        arrayNameHandler(varType, 'Globals', statmentToParse.Name);
}

function parseGlobStatmentsPart1(statmentToParse, varType, strVal) {
    parseGlobStatmentsPart11(statmentToParse, varType);
    //    if (globAndArgs[statmentToParse.Name]!=undefined)
    //            globAndArgs[statmentToParse.Name] = varType;
    globAndArgs[statmentToParse.Name] = statmentToParse.Name;
    if (globAndArgs[varType] != undefined)
        argsDicitonary[statmentToParse.Name] = globAndArgs[varType];
    else
        argsDicitonary[statmentToParse.Name] = strVal;
    if (statmentToParse.Value.indexOf('[') == 0) {
        let tmpArr = statmentToParse.Value.substring(1, statmentToParse.Value.length - 1).split(',');
        for (var j = 0; j < tmpArr.length; j++) {
            globAndArgs[statmentToParse.Name + '[' + j + ']'] = statmentToParse.Name + '[' + j + ']';
            argsDicitonary[statmentToParse.Name + '[' + j + ']'] = tmpArr[j];
        }
    }
}

function parseGlobStatments(statmentToParse) {
    let tmpVal = '', strVal = '';
    let varType = statmentToParse.Value;
    if (('' + varType).indexOf(' ') == -1)
        strVal = varType;
    else {
        tmpVal = varType.match(/[A-Za-z0-9_(){}=<>[\].?!,"\-*&^%$#+/[\]]+/g);
        tmpVal = arrayUnion(tmpVal);
        tmpVal = stringUnion(tmpVal);
        for (var i = 0; i < tmpVal.length; i++) {
            if (globAndArgs[tmpVal[i]] != undefined)
                tmpVal[i] = globAndArgs[tmpVal[i]];
            if (i == 0)
                strVal = strVal + tmpVal[i];
            else
                strVal = strVal + ' ' + tmpVal[i];
        }
    }
    parseGlobStatmentsPart1(statmentToParse, varType, strVal);
}

function globalHandlerPart1(parseObj, i) {
    if (parseObj[i].Type == 'VariableDeclarator' || parseObj[i].Type == 'AssignmentExpression')
        parseGlobStatments(parseObj[i]);
    //   else
    //      return;
}

function globalHandlerPart2(i, parseObj, j) {
    while (j < parseObj.length) {
        if (parseObj[j].Type == 'VariableDeclarator' || parseObj[j].Type == 'AssignmentExpression')
            parseGlobStatments(parseObj[j]);
        //     else
        //         return;
        j++;
    }
    return i;
}

function globalHandlerPart3(parseObj, i, end) {
    let j = i;
    while (j < parseObj.length && parseObj[j].Line <= end)
        j++;
    i = globalHandlerPart2(i, parseObj, j);
    return i;
}

function globalHandler(i, parseObj, end) {
    while (i < parseObj.length && parseObj[i].Type != 'FunctionDeclaration') {
        globalHandlerPart1(parseObj, i);
        i++;
    }
    if (i < parseObj.length) {
        return globalHandlerPart3(parseObj, i, end);
    }
    return i;
}

function funcHandlerPart3(i, parseObj, mainFinal) {
    tmpglobAndArgs[conditionIndex] = Object.assign({}, globAndArgs);
    tmplocals[conditionIndex] = Object.assign({}, locals);
    conditionIndex++;
    mainFinal = 'else';
    return mainFinal;
}

function funcEndHandlerPart4(i, parseObj, mainFinal) {
    if (parseObj[i].Type.substring(0, 2) != 'END') {
        mainFinal = '}\n';
        globAndArgs = {};
        locals = {};
        conditionIndex--;
        globAndArgs = Object.assign({}, tmpglobAndArgs[conditionIndex]);
        locals = Object.assign({}, tmplocals[conditionIndex]);
        delete tmpglobAndArgs[conditionIndex];
        delete tmplocals[conditionIndex];
    }
    return mainFinal;
}

function funcHandlerPart1CheckCond1(i, parseObj, mainFinal) {
    if (parseObj[i].Type == 'IfStatemenet' || parseObj[i].Type == 'ElseIfStatement' || parseObj[i].Type == 'WhileStatement')
        mainFinal = mainFinal + parseConditionStatments(parseObj[i], parseObj, i) + '{\n';
    else if (parseObj[i].Type == 'ElseStatement')
        mainFinal = mainFinal + funcHandlerPart3(i, parseObj, mainFinal) + '{\n';
    else
        mainFinal = mainFinal + funcEndHandlerPart4(i, parseObj, mainFinal);
    return mainFinal;
}

function funcHandlerPart1CheckCond(i, parseObj, mainFinal, end, argsDict, tmpMainArray, args) {
    if (parseObj[i].Type == 'ReturnStatement' || parseObj[i].Type == 'VariableDeclarator' || parseObj[i].Type == 'AssignmentExpression') {
        var parseVS = parseVarsStatments(parseObj[i], parseObj, i);
        if (parseVS != '')
            mainFinal = mainFinal + parseVS + ';\n';
    }
    else
        mainFinal = funcHandlerPart1CheckCond1(i, parseObj, mainFinal, end, argsDict, tmpMainArray, args);
    return mainFinal;
}

function funcHandlerPart1(i, parseObj, mainFinal, end, argsDict, tmpMainArray, args, flag) {
    i = flag;
    while (i < parseObj.length && parseObj[i].Line < end + 1) {
        mainFinal = funcHandlerPart1CheckCond(i, parseObj, mainFinal, end, argsDict, tmpMainArray, args);
        i++;
    }
    return mainFinal;
}

function functionHandler(i, parseObj, mainFinal, end, argsDict, tmpMainArray) {
    i++;
    let args = extractArgs(argsDict);
    var flag = getArgs(args, i, parseObj[i].Line, parseObj);
    mainFinal = funcHandlerPart1(i, parseObj, mainFinal, end, argsDict, tmpMainArray, args, flag);
    mainFinal = mainFinal + '};\n';
    for (var j = end + 1; j < tmpMainArray.length; j++)
        mainFinal = mainFinal + tmpMainArray[j] + '\n';
    return mainFinal;
}

function extractArgs2(tmpVal, i) {
    while (i + 1 < tmpVal.length && tmpVal[i].indexOf(']') != tmpVal[i].length - 1 && tmpVal[i + 1].indexOf(']') != tmpVal[i + 1].length - 1) {
        tmpVal[i] = tmpVal[i] + ',' + tmpVal[i + 1];
        tmpVal.splice(i + 1, 1);
    }

    return tmpVal;
}

function extractArgs(argsDict) {
    var tmpVal = argsDict.split(',');
    for (var i = 0; (i + 1) < tmpVal.length; i++) {
        if (tmpVal[i].indexOf('[') == 0) {
            tmpVal = extractArgs2(tmpVal, i);
            if (i + 1 < tmpVal.length && tmpVal[i + 1].indexOf(']') == tmpVal[i + 1].length - 1) {
                tmpVal[i] = tmpVal[i] + ',' + tmpVal[i + 1];
                tmpVal.splice(i + 1, 1);
            }
        }
    }
    tmpVal = stringUnion(tmpVal);
    return tmpVal;
}

function findEndOfFunc(codeToParse) {
    var splitCode = codeToParse.split('\n');
    var endIndex = 0;
    for (var i = 0; i < splitCode.length; i++) {
        if (splitCode[i].indexOf('}') != -1)
            endIndex = i;
    }
    return endIndex;
}

function colorHandle(mainFinal) {
    let finalMainFinal = '';
    let tmpMain = mainFinal.split('\n');
    for (let i = 0; i < tmpMain.length; i++) {
        if (tmpMain[i].includes('@red@')) {
            tmpMain[i] = tmpMain[i].replace('@red@', '');
            tmpMain[i] = '<span style="background-color:red;">' + tmpMain[i] + '</span>' + '</br>';
        }
        else if (tmpMain[i].includes('@green@')) {
            tmpMain[i] = tmpMain[i].replace('@green@', '');
            tmpMain[i] = '<span style="background-color:lightgreen;">' + tmpMain[i] + '</span>' + '</br>';
        }
        else
            tmpMain[i] = tmpMain[i] + '</br>';
    }
    for (let i = 0; i < tmpMain.length; i++)
        finalMainFinal = finalMainFinal + tmpMain[i];
    return finalMainFinal;
}

function subsLast(mainFinal, debug, i, parseObj, end, argsDict, tmpMainArray) {
    if (i < parseObj.length && parseObj[i].Type == 'FunctionDeclaration')
        mainFinal = functionHandler(i, parseObj, mainFinal, end, argsDict, tmpMainArray);
    let forTests = mainFinal.split('\n');
    mainFinal = colorHandle(mainFinal);
    if (debug)
        return forTests;
    else
        return (mainFinal);
}

function substitution(argsDict, codeToparse, parseObj, debug) {
    var i = 0;
    conditionIndex = 0;
    var tmpMainArray = codeToparse.split('\n');
    globAndArgs = [], locals = [], argsDicitonary = {}, tmpglobAndArgs = [], tmplocals = [], linesToIgnoer = [];
    var mainFinal = '';
    let end = findEndOfFunc(codeToparse);
    i = globalHandler(i, parseObj, end);
    if (i < parseObj.length) {
        for (let z = 0; z < parseObj[i].Line; z++)
            mainFinal = mainFinal + tmpMainArray[z] + '\n';
    }
    else {
        for (let z = 0; z < parseObj[i - 1].Line; z++)
            mainFinal = mainFinal + tmpMainArray[z] + '\n';
    }
    return subsLast(mainFinal, debug, i, parseObj, end, argsDict, tmpMainArray);
}

export { substitution };