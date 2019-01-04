import assert from 'assert';
import {parseCode, initialParser, clearTable} from '../src/js/code-analyzer';
import {parseJSon} from '../src/js/code-analyzer';
import {substitution} from '../src/js/partB';
import { part3 , delSpaces ,  removeExceptionsForDot , getString, getNodeIndex, makeString} from '../src/js/partC';


describe('The javascript parser', () => {
    it('is parsing an VariableDec function correctly', () => {
        clearTable();
        let parsedCode = parseCode("let x=1;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected =`[{\"Line\":1,\"Type\":\"VariableDeclarator\",\"Name\":\"x\",\"Condition\":\"\",\"Value\":\"1\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an VariableDec&&BinaryExp function correctly', () => {
        clearTable();
        let parsedCode = parseCode("let x=a+4*5;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = '[{\"Line\":1,\"Type\":\"VariableDeclarator\",\"Name\":\"x\",\"Condition\":\"\",\"Value\":\"( a + ( 4 * 5 ) )\"}]';
        assert.equal(actual,expected);
    });
    
        it('is parsing an VariableDec&&BinaryExp function correctly', () => {
        clearTable();
        let parsedCode = parseCode("switch(expression) {case a:x=3;break;case b:x=2;break;default:x=3;}");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"SwitchStatement","Name":"","Condition":"","Value":""},{"Line":1,"Type":"SwitchCase","Name":"","Condition":"a","Value":""},{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"3"},{"Line":1,"Type":"BreakStatement","Name":"","Condition":"","Value":""},{"Line":1,"Type":"SwitchCase","Name":"","Condition":"b","Value":""},{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"2"},{"Line":1,"Type":"BreakStatement","Name":"","Condition":"","Value":""},{"Line":1,"Type":"SwitchCase","Name":"","Condition":"default","Value":""},{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"3"}]);
        assert.equal(actual,expected);
    });
        it('is parsing an VariableDec&&BinaryExp function correctly', () => {
        clearTable();
        let parsedCode = parseCode("do{x=2;}while(x>2);");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"DoWhileStatement\",\"Name\":\"\",\"Condition\":\"( x > 2 )\",\"Value\":\"\",\"EndLine\":1},{\"Line\":1,\"Type\":\"AssignmentExpression\",\"Name\":\"x\",\"Condition\":\"\",\"Value\":\"2\"}]`;
        assert.equal(actual,expected);
    });
    
    it('is parsing an For function correctly', () => {
        clearTable();
        let parsedCode = parseCode("for(var i=0;i<4 && s>23;i++){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"ForStatement\",\"Name\":\"\",\"Condition\":\"(var i=0;( ( i < 4 ) && ( s > 23 ) );i ++)\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an For function correctly', () => {
        clearTable();
        let parsedCode = parseCode("for(i=0;i<4 && s>23;i++){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"ForStatement\",\"Name\":\"\",\"Condition\":\"(i = 0;( ( i < 4 ) && ( s > 23 ) );i ++)\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an For function correctly', () => {
        clearTable();
        let parsedCode = parseCode("for(;i<4 && s>23;i++){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"ForStatement\",\"Name\":\"\",\"Condition\":\"(;( ( i < 4 ) && ( s > 23 ) );i ++)\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an For function correctly', () => {
        clearTable();
        let parsedCode = parseCode("for(i;i<2;i++){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"ForStatement\",\"Name\":\"\",\"Condition\":\"(i;( i < 2 );i ++)\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an Identifier function correctly', () => {
        clearTable();
        let parsedCode = parseCode("a;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = '[{\"Line\":1,\"Type\":\"Identifier\",\"Name\":\"a\",\"Condition\":\"\",\"Value\":\"\"}]';
        assert.equal(actual,expected);
    });
    it('is parsing an Binary function correctly', () => {
        clearTable();
        let parsedCode = parseCode("1+2%d;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"BinaryExpression\",\"Name\":\"( 1 + ( 2 % d ) )\",\"Condition\":\"\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an Literal function correctly', () => {
        clearTable();
        let parsedCode = parseCode("4;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected =`[{\"Line\":1,\"Type\":\"Literal\",\"Name\":\"4\",\"Condition\":\"\",\"Value\":\"\"}]`;
         assert.equal(actual,expected);
    });
    it('is parsing an CallFunc function correctly', () => {
        clearTable();
        let parsedCode = parseCode("func(a,1+s,func(1));");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected =`[{\"Line\":1,\"Type\":\"Identifier\",\"Name\":\"a\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":1,\"Type\":\"BinaryExpression\",\"Name\":\"( 1 + s )\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":1,\"Type\":\"Literal\",\"Name\":\"1\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":1,\"Type\":\"CallExpression\",\"Name\":\"func( undefined )\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":1,\"Type\":\"CallExpression\",\"Name\":\"func( undefined,undefined,undefined )\",\"Condition\":\"\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an LogicalExpression function correctly', () => {
        clearTable();
        let parsedCode = parseCode("a||b;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"LogicalExpression\",\"Name\":\"( a || b )\",\"Condition\":\"\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an UpdateExpression function correctly', () => {
        clearTable();
        let parsedCode = parseCode("++i;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"UpdateExpression\",\"Name\":\"++ i\",\"Condition\":\"\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an MemberExpression function correctly', () => {
        clearTable();
        let parsedCode = parseCode("a[a+3];");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"MemberExpression\",\"Name\":\"a[( a + 3 )]\",\"Condition\":\"\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an UnaryExpression function correctly', () => {
        clearTable();
        let parsedCode = parseCode("-1;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"UnaryExpression\",\"Name\":\"1\",\"Condition\":\"\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an Assign&Array function correctly', () => {
        clearTable();
        let parsedCode = parseCode("a = [\"a\",\"b\",\"c\"];");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"AssignmentExpression\",\"Name\":\"a\",\"Condition\":\"\",\"Value\":\"[\\\"a\\\",\\\"b\\\",\\\"c\\\"]\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an Object function correctly', () => {
        clearTable();
        let parsedCode = parseCode("x = {};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"{}"}]);
        assert.equal(actual,expected);
    });
    it('is parsing an MemberExp function correctly', () => {
        clearTable();
        let parsedCode = parseCode("N[a+3];");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected =`[{\"Line\":1,\"Type\":\"MemberExpression\",\"Name\":\"N[( a + 3 )]\",\"Condition\":\"\",\"Value\":\"\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an NewExp function correctly', () => {
        clearTable();
        let parsedCode = parseCode("var x = new Object();");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"VariableDeclarator\",\"Name\":\"x\",\"Condition\":\"\",\"Value\":\"new Object(  )\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an Object function correctly', () => {
        clearTable();
        let parsedCode = parseCode("x = {a,b};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"{a,b}"}]);
        assert.equal(actual,expected);
    });
    it('is parsing an New function correctly', () => {
        clearTable();
        let parsedCode = parseCode("var x = new Object(a, 3);");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"VariableDeclarator\",\"Name\":\"x\",\"Condition\":\"\",\"Value\":\"new Object( a,3 )\"}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an empty function correctly', () => {
        clearTable();
        let parsedCode = parseCode("//comment");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([]);
        assert.equal(actual,expected);
    });
    it('is parsing an IfStatment function correctly', () => {
        clearTable();
        let parsedCode = parseCode("if(x<2){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"IfStatemenet\",\"Name\":\"\",\"Condition\":\"( x < 2 )\",\"Value\":\"\",\"EndLine\":1},{\"Line\":1,\"Type\":\"ENDIF\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":1}]`;
        assert.equal(actual,expected);
    });

    it('is parsing an += Assignemnt function correctly', () => {
        clearTable();
        let parsedCode = parseCode("if (x>3){x+=a;}");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"IfStatemenet\",\"Name\":\"\",\"Condition\":\"( x > 3 )\",\"Value\":\"\",\"EndLine\":1},{\"Line\":1,\"Type\":\"AssignmentExpression\",\"Name\":\"x\",\"Condition\":\"\",\"Value\":\"+=a\"},{\"Line\":1,\"Type\":\"ENDIF\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":1}]`;
        assert.equal(actual,expected);
    });
    
    it('is parsing an WhileStatement function correctly', () => {
        clearTable();
        let parsedCode = parseCode("while(a>(4*func(2))){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"WhileStatement\",\"Name\":\"\",\"Condition\":\"( a > ( 4 * func( 2 ) ) )\",\"Value\":\"\",\"EndLine\":1},{\"Line\":1,\"Type\":\"ENDWHILE\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":1}]`;
        assert.equal(actual,expected);
    });
    it('is parsing an FunctionDeclatrion&If&While&all function correctly', () => {
        clearTable();
        let parsedCode = parseCode("function binarySearch(X, V, n){ let low, high, mid;low = 0;high = n - 1;while (low <= high) { mid = (low + high)/2;if (X < V[mid])high = mid - 1; else if (X > V[mid]) low = mid + 1;else return mid;}return -1;};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"FunctionDeclaration\",\"Name\":\"binarySearch\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":1,\"Type\":\"Identifier\",\"Name\":\"X\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":1,\"Type\":\"Identifier\",\"Name\":\"V\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":1,\"Type\":\"Identifier\",\"Name\":\"n\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":1,\"Type\":\"VariableDeclarator\",\"Name\":\"low\",\"Condition\":\"\",\"Value\":\"null\"},{\"Line\":1,\"Type\":\"VariableDeclarator\",\"Name\":\"high\",\"Condition\":\"\",\"Value\":\"null\"},{\"Line\":1,\"Type\":\"VariableDeclarator\",\"Name\":\"mid\",\"Condition\":\"\",\"Value\":\"null\"},{\"Line\":1,\"Type\":\"AssignmentExpression\",\"Name\":\"low\",\"Condition\":\"\",\"Value\":\"0\"},{\"Line\":1,\"Type\":\"AssignmentExpression\",\"Name\":\"high\",\"Condition\":\"\",\"Value\":\"( n - 1 )\"},{\"Line\":1,\"Type\":\"WhileStatement\",\"Name\":\"\",\"Condition\":\"( low <= high )\",\"Value\":\"\",\"EndLine\":1},{\"Line\":1,\"Type\":\"AssignmentExpression\",\"Name\":\"mid\",\"Condition\":\"\",\"Value\":\"( ( low + high ) / 2 )\"},{\"Line\":1,\"Type\":\"IfStatemenet\",\"Name\":\"\",\"Condition\":\"( X < V[mid] )\",\"Value\":\"\",\"EndLine\":0},{\"Line\":1,\"Type\":\"AssignmentExpression\",\"Name\":\"high\",\"Condition\":\"\",\"Value\":\"( mid - 1 )\"},{\"Line\":0,\"Type\":\"ENDIF\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":1},{\"Line\":1,\"Type\":\"ElseIfStatement\",\"Name\":\"\",\"Condition\":\"( X > V[mid] )\",\"Value\":\"\",\"EndLine\":0},{\"Line\":1,\"Type\":\"AssignmentExpression\",\"Name\":\"low\",\"Condition\":\"\",\"Value\":\"( mid + 1 )\"},{\"Line\":0,\"Type\":\"ENDELIF\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":1},{\"Line\":1,\"Type\":\"ElseStatement\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":1},{\"Line\":1,\"Type\":\"ReturnStatement\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"mid\"},{\"Line\":1,\"Type\":\"ENDELSE\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":1},{\"Line\":1,\"Type\":\"ENDWHILE\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":1},{\"Line\":1,\"Type\":\"ReturnStatement\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"1\"}]`;
        assert.equal(actual,expected );
    });
    it('is parsing an sequence statement correctly', () => {
        clearTable();
        let parsedCode = parseCode(`x=1, y=2;`);
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"AssignmentExpression\",\"Name\":\"x\",\"Condition\":\"\",\"Value\":\"1\"},{\"Line\":1,\"Type\":\"AssignmentExpression\",\"Name\":\"y\",\"Condition\":\"\",\"Value\":\"2\"}]`;
        assert.equal(actual,expected );
    });
    it('is parsing an sequence statement correctly', () => {
        clearTable();
        let parsedCode = parseCode(`function foo(x,y){
            {x=2;
            if (true){
            if (false){
            x=2;}
            else if (2==2){
            return 2;}
            }}}
            `);
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = `[{\"Line\":1,\"Type\":\"FunctionDeclaration\",\"Name\":\"foo\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":1,\"Type\":\"Identifier\",\"Name\":\"x\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":1,\"Type\":\"Identifier\",\"Name\":\"y\",\"Condition\":\"\",\"Value\":\"\"},{\"Line\":2,\"Type\":\"AssignmentExpression\",\"Name\":\"x\",\"Condition\":\"\",\"Value\":\"2\"},{\"Line\":3,\"Type\":\"IfStatemenet\",\"Name\":\"\",\"Condition\":\"true\",\"Value\":\"\",\"EndLine\":8},{\"Line\":4,\"Type\":\"IfStatemenet\",\"Name\":\"\",\"Condition\":\"false\",\"Value\":\"\",\"EndLine\":5},{\"Line\":5,\"Type\":\"AssignmentExpression\",\"Name\":\"x\",\"Condition\":\"\",\"Value\":\"2\"},{\"Line\":5,\"Type\":\"ENDIF\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":7},{\"Line\":6,\"Type\":\"ElseIfStatement\",\"Name\":\"\",\"Condition\":\"( 2 == 2 )\",\"Value\":\"\",\"EndLine\":7},{\"Line\":7,\"Type\":\"ReturnStatement\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"2\"},{\"Line\":7,\"Type\":\"ENDELIF\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":7},{\"Line\":8,\"Type\":\"ENDIF\",\"Name\":\"\",\"Condition\":\"\",\"Value\":\"\",\"EndLine\":8}]`;
        assert.equal(actual,expected );
    });

    
});

describe('The substitution parser', () => {
    
    it('check arr global', () => {
        let codeToParse ='let arr = [1,2,3];';
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[0];
        let expected = 'let arr = [1,2,3];';
        assert.equal(actual,expected);
    });
    it('sub of a lot of globals and one array', () => {
        let codeToParse ='let arr = [1,2,3];\n' +
        'let x;\n' +
        'let y=8;\n' +
        'let xr=8;\n' +
        'let x=-1;\n' +
        'let x = y+xr;\n' +
        'let p = arr[0];\n' +
        'function b(){\n' +
        'arr[0]=1;\n' +
        '}\n' +
        '\n';
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[6];
        let expected = "let p = arr[0];";        ;
        assert.equal(actual,expected);
    });
        it('global locals and array, while if and if', () => {
        let codeToParse =
        `function foo(x, y, z, arr){
            let b = ['mama mia', true];
            let c = [x, z, 'hay', true, b[0]];
                while( arr[2] ) {
                    if( arr[0] == 'hello' ){
                       y=arr[1]+1;
                    if(y>2){
                        x=3;
                    }
                    }
                    else{
                       x=x+' bye';
                    }
                    c = arr[1];
                    z = c * 2;
                }
                
                return z;
            };
            `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='"hello",1,1,["hello",5,true]';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[3];
        let expected = 'y = ( arr[1] + 1 );';
        assert.equal(actual,expected);
    });
    it('if inside while', () => {
        let codeToParse =
        'function foo(x, y, z, arr){'+'\n' +
            'let b = ["mama mia", true];'+'\n' +
            'let c = [x, z, "hay", true, b[0]];'+'\n' +
            'while( arr[2] ) {'+'\n' +
            'if( arr[0] == "hello" ){'+'\n' +
            'y=arr[1]+1;'+'\n' +
            'if(y>2){'+'\n' +
            'x=3;'+'\n' +
            '}'+'\n' +
            '}'+'\n' +
            'else{'+'\n' +
            'x=x+" bye";'+'\n' +
            '}'+'\n' +
            'c = arr[1];'+'\n' +
            'z = c * 2;'+'\n' +
            '}'+'\n'+
            '};';
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='"hello",1,1,["hello",5,false]';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[4];
        let expected ='if ( ( arr[1] + 1 ) > 2 ){';
        assert.equal(actual,expected);
    });
    it('is with arrays and assigments', () => {
        let codeToParse =
        'function foo(x, y, z, arr){'+'\n' +
            'let b = ["mama mia", true];'+'\n' +
            'let c = [x, z, "hay", true, b[0]];'+'\n' +
            'while( arr[2] ) {'+'\n' +
            'if( arr[0] == "hello" ){'+'\n' +
            'y=arr[1]+1;'+'\n' +
            'if(y>2){'+'\n' +
            'x=3;'+'\n' +
            '}'+'\n' +
            '}'+'\n' +
            'else{'+'\n' +
            'x=x+" bye";'+'\n' +
            '}'+'\n' +
            'c = arr[1];'+'\n' +
            'z = c * 2;'+'\n' +
            '}'+'\n'+
            '};';
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='"hello",1,1,["hello",5,false]';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[1];
        let expected = 'while arr[2]@red@{';
        assert.equal(actual,expected);
    });
    it('while->if->if', () => {
        let codeToParse =
        `function foo(x, y, z, arr){
            let b = ["mama mia", true];
            let c = [x, z, "hay", true, b[0]];
            while( arr[2] ) {
            if( arr[0] == "hello" ){
            arr = [];
            arr[0]=2;
            if(arr[0]==2){
            x=3;
            }
            }
            else{
            x=x+" bye";
            }
            c = arr[1];
            z = c * 2;
            }
            }
            `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='"hello",1,1,["hello",5,true]';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[5];
        let expected = 'if ( 2 == 2 )@green@{';
        assert.equal(actual,expected);
    });
    
    it('check arrays', () => {
        let codeToParse =
        `function foo(x, y, z, arr){
            let b = ["mama mia", true];
            let c = [x, z, "hay", true, b[0]];
            while( arr[2] ) {
            if( arr[0] == "hello" ){
            b=[];
            b = ["mama mia", true];
            arr = [];
            arr[0]=2;
            if( b[1] ){
            x=3;
            }
            }
            else{
            x=x+" bye";
            }
            c = arr[1];
            z = c * 2;
            }
            }
            `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='"hello",1,1,["hello",5,true]';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[5];
        let expected = 'if true@green@{';
        assert.equal(actual,expected);
    });
    it('check html', () => {
        let codeToParse =
        `let x = [1,2,3];`;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='';
        let x = substitution(args, codeToParse, globalTable, false);
        let actual = x;
        let expected = 'let x = [1,2,3];</br></br>';
        assert.equal(actual,expected);
    }); 
    it('is subs an  function correctly', () => {
        let codeToParse =
        `function foo(x, y, z, arr){
            let b = ["mama mia", true];
            let c = [x, z, "hay", true, b[0]];
            while( arr[2] ) {
            if( arr[0] == "hello" ){
            b[0]=['mama'];
            arr = [];
            arr[0]=2;
            if(b[0]=="mama"){
            x=3;
            }
            }
            else{
            x=x+" bye";
            }
            c = arr[1];
            z = c * 2;
            }
            }
            `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='"hello",1,1,["hello world",5,true]';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[2];
        let expected = 'if ( arr[0] == "hello" )@red@{';
        assert.equal(actual,expected);
    });
    it('check while and if insinde if', () => {
        let codeToParse =
        `function foo(x, y, z, arr){
            let hay = 'hay hay hay';
                        let b = ["mama mia", true];
                        let c = [x, z, "hay", true, b[0]];
                        while( arr[2] ) {
                        if( arr[0] == "hello world" ){
                        b=['mama'];
                        arr = [];
                        arr[0]=2;
                        if(b[0]=="mama"){
                        x=3;
                        }
                        }
                        else{
                        x=x+" bye";
                        }
                        c = arr[1];
                        z = c * 2;
                        }
                        }
            `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='"hello",1,1,["hello world",5,true]';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[3];
        let expected = 'arr = [];';
        assert.equal(actual,expected);
    });
    it('return cases - check colors', () => {
        let codeToParse =
        `let c = ['ay', 'dfg', 3.5];
        c[0] = 3;
        let b = c[0] + " sheli";
        function foo (x,y){
        let h = ['hay hay', 3, c[0], true];
        if (d==3){
        return 2;
        } else if (c[0] <3){
        return x;
        } else {
        return y;
        }
        }
        let d =c[0];
            `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='1,2';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[4];
        let expected = `if ( d == 3 )@green@{`;
        assert.equal(actual,expected);
    });
    it('ass couple times of array', () => {
        let codeToParse =
        `function foo(x, y, z, arr){
            let h = 'hay hay hay';
                        let b = ["mama mia", true];
                        let c = [x, z, "hay", true, b[0]];
                        while( arr[2] ) {
                        if( arr[0] == "hello world" ){
                        b=['mama'];
                        arr = [];
                        arr[0]=2;
                        if(b[0]=="mama"){
                        x=3;
                        }
                        }
                        else{
                        x=x+" bye";
                        }
                        c = arr[1];
                        z = c * 2;
                        }
                        }
            `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='"hello",1,1,["hello world",5,true]';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[3];
        let expected = 'arr = [];';
        assert.equal(actual,expected);
    });
    it('with return', () => {
        let codeToParse =
        `function foo(x, y, z){
            let a = x + 1;
            let b = a + y;
            let c = 0;
            
            if (b < z) {
                c = c + 5;
                return x + y + z + c;
            } else if (b < z * 2) {
                c = c + x + 5;
                return x + y + z + c;
            } else {
                c = c + z + 5;
                return x + y + z + c;
            }
        }
            `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='1,2,3';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[1];
        let expected = 'if ( ( ( x + 1 ) + y ) < z )@red@{';
        assert.equal(actual,expected);
    });
    it('assigments of global arr', () => {
        let codeToParse =
        `let c = ['ay', 'dfg', 3.5];
        c[0] = 3;
        let b = c[0] + ' sheli';
        function foo (x,y){
        let h = ['hay hay hay', 3, c[0], true];
        if (d==3){
        return 2;
        }
        else if (c[0] <3){
        return x;
        }
        else {
        return y;
        }
        }
        let d =c[0];
            `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='1,2';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[4];
        let expected = 'if ( d == 3 )@green@{';
        assert.equal(actual,expected);
    });
    it('check locals arrays', () => {
        let codeToParse =
        `let c = ['ay', 'dfg', 3.5];
        let s = 3;
        s = 5;
        let b = c[0] + ' sheli';
        function foo (x,y){
        let h = ['hay'];
        h[0]=3;
        if (h[0]==3){
        return d;
        }
        else if (c[0] <3){
        return x;
        }
        else {
        return y;
        }
        }
        let d =c[0];
        d=3;
            `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args ='1,2';
        let x = substitution(args, codeToParse, globalTable, true);
        let actual = x[5];
        let expected = 'if ( 3 == 3 )@green@{';
        assert.equal(actual,expected);
    });
}); 

describe('The cfg maker', () => {
    it('check unit test delspace function', () => {
        let codeToParse =`n1 -> n2 [ label = "true" ]`;
        let actual = delSpaces(codeToParse);
        let expected = 'n1->n2[label=\"true\"]';
        assert.equal(actual,expected);
    });
    it('check unit test removeExceptionsForDot function', () => {
        let codeToParse =[`n1 -> n2 [ label = "exception color="red" ]`];
        let actual = removeExceptionsForDot(codeToParse);
        let expected = '';
        assert.equal(actual,expected);
    });
    it('check unit test getString function', () => {
        let codeToParse =`n1 -> n2 [ label = "true" ]`;
        let actual = getString(codeToParse);
        let expected = `true`;
        assert.equal(actual,expected);
    });
    it('check unit test getNodeIndex function', () => {
        let codeToParse =`n1 -> n2 [ label = "true" ]`;
        let actual = getNodeIndex(codeToParse);
        let expected = `n1 -> n2`;
        assert.equal(actual,expected);
    });
    it('check unit test makeString function', () => {
        let codeToParse = ['hay','bay'];
        let actual = makeString(codeToParse);
        let expected =``;
        assert.equal(actual,expected);
    });
    it('check spart3 function - system test 1', () => {
        let codeToParse =`function foo(x, y, z, arr) {
            let i=0;
                while (i<2) {
                    if (y < 0) {
                        y = arr[1] + 1
                        if (y > 2) {
                            x = 3;
                        }
                    }
                    else {
                        x = x + ' shani';
                    }
                    let c = arr[1];
                    z = c * 2;
                    arr[2] = false;
            i++;
                }
                return z;
            }`;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args =`'hi', 5, 2, [1,2,true]`;
        let x = (part3(parsedCode, codeToParse, args, globalTable)).split('\n');
        let actual = x[10];
        let expected = `y = arr[1] + 1\" , shape = \"box\"]`;
        assert.equal(actual,expected);
    });
    it('check spart3 function - system test 2', () => {
        let codeToParse =`function foo(x, y, z, arr) {
            let i=0;
                while (i<2) {
                    if (y < 0) {
                        y = arr[1] + 1
                        if (y > 2) {
                            x = 3;
                        }
                    }
                    else {
                        x = x + ' shani';
                    }
                    let c = arr[1];
                    z = c * 2;
                    arr[2] = false;
            i++;
                }
                return z;
            }`;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args =`'hi', 5, 2, [true]`;
        let x = (part3(parsedCode, codeToParse, args, globalTable)).split('\n');
        let actual = x[8];
        let expected = `y < 0\" , shape = \"diamond\" , style = \"filled\" , color = \"green\"]`;
        assert.equal(actual,expected);
    });
    it('check spart3 function - system test 3', () => {
        let codeToParse =`function foo(x, y, arr, z) {
            let i=0;
                while (i<2) {
                    if (y < 0) {
                        y =  1;
                        if (y > 2) {
                            x = 3;
                        }
                    }
                    else {
                        x = x + ' shani';
                    }
                    var c = arr[0];
                    var b = c * 2;
                    let a = 3;
                    arr[0] = false;
            i++;
                }
                return z;
            }`;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args =`'hi la', 5, [true], 2`;
        let x = (part3(parsedCode, codeToParse, args, globalTable)).split('\n');
        let actual = x[7];
        let expected = `n3 [label=\"(4)`;
        assert.equal(actual,expected);
    });
    it('check spart3 function - system test 4', () => {
        let codeToParse =`function foo(x, y, arr, z) {
            let i=0;
                while (i<2) {
                    if (y < 0) {
                        y =  1;
                        if (y > 2) {
                            x = 3;
                        }
                    }
                    else {
                        x = x + ' shani';
                    }
                    var c = arr[0];
                    var b = c * 2;
                    let a = 3;
                    arr[0] = false;
            i++;
                }
                return z;
            }`;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args =`'hi la', 5, [true], 2`;
        let x = (part3(parsedCode, codeToParse, args, globalTable)).split('\n');
        let actual = x[12];
        let expected = `y > 2\" , shape = \"diamond\"]`;
        assert.equal(actual,expected);
    });
    it('check spart3 function - system test 5', () => {
        let codeToParse =`function foo(x, y, z, arr) {
                let i=0;
                if (arr[2]){
                    while (i<2) {
                        if (y > 0) {
                            y = arr[1] + 1
                            if (y > 2) {
                                x = 3;
                            }
                x = 4;
                        }
                        else {
                            x = x + ' hila';
                        }
                        let c = arr[1];
                        z = c * 2;
                        arr[2] = false;
                i++;
                    }
                }
                    return z;
                }
                `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args =`'shani', 5, 2, [1,2,true]`;
        let x = (part3(parsedCode, codeToParse, args, globalTable)).split('\n');
        let actual = x[12];
        let expected = `y = arr[1] + 1\" , shape = \"box\" , style = \"filled\" , color = \"green\"]`;
        assert.equal(actual,expected);
    });
    it('check spart3 function - system test 6', () => {
        let codeToParse =`function foo(x, y, z, arr) {
                    return z;
                }
                `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args =`'shani', 5, 2, [1,2,true]`;
        let x = (part3(parsedCode, codeToParse, args, globalTable)).split('\n');
        let actual = x[1];
        let expected = `n1 [label=\"(1)`;
        assert.equal(actual,expected);
    });
    it('check spart3 function - system test 7', () => {
        let codeToParse =`function foo(x, y, z, arr) {
                let i=0;
                if (arr[2]){
                    while (i<2) {
                        if (y > 0) {
                            y = arr[1] + 1
                            if (y > 2) {
                                x = 3;
                            }
                x = 4;
                        }
                        else {
                            x = x + ' hila';
                        }
                        let c = arr[1];
                        z = c * 2;
                        arr[2] = false;
                i++;
                    }
                }
                    return z;
                }
                `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args =`'shani', 5, 2, [1,2,false]`;
        let x = (part3(parsedCode, codeToParse, args, globalTable)).split('\n');
        let actual = x[12];
        let expected = `y = arr[1] + 1\" , shape = \"box\"]`;
        assert.equal(actual,expected);
    });
    it('check spart3 function - system test 8', () => {
        let codeToParse =`function foo(x, y, z, arr) {
                let i=0;
                if (arr[2]){
                    while (i<2) {
                        if (y > 0) {
                            y = arr[1] + 1
                            if (y > 2) {
                                x = 3;
                            }
                x = 4;
                        }
                        else {
                            x = x + ' hila';
                        }
                        let c = arr[1];
                        z = c * 2;
                        arr[2] = false;
                i++;
                    }
                }
                    return z;
                }
                `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args =`'shani', 5, 2, [1,2,false]`;
        let x = (part3(parsedCode, codeToParse, args, globalTable)).split('\n');
        let actual = x[5];
        let expected = `n30 [label=\"(3)`;
        assert.equal(actual,expected);
    });
    it('check spart3 function - system test 9', () => {
        let codeToParse =`function foo(x, y, z, arr) {
                let i=0;
                if (arr[2]){
                    while (i<2) {
                        if (y > 0) {
                            y = arr[1] + 1
                            if (y > 2) {
                                x = 3;
                            }
                x = 4;
                        }
                        else {
                            x = x + ' hila';
                        }
                        let c = arr[1];
                        z = c * 2;
                        arr[2] = false;
                i++;
                    }
                }
                    return z;
                }
                `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args =`'shani', 5, 2, [1,2,false]`;
        let x = (part3(parsedCode, codeToParse, args, globalTable)).split('\n');
        let actual = x[8];
        let expected = `i<2\" , shape = \"diamond\"]`;
        assert.equal(actual,expected);
    });
    it('check spart3 function - system test 10', () => {
        let codeToParse =`function foo(x, y, z, arr) {
                let i=0;
                if (arr[2]){
                    while (i<2) {
                        if (y > 0) {
                            y = arr[1] + 1
                            if (y > 2) {
                                x = 3;
                            }
                x = 4;
                        }
                        else {
                            x = x + ' hila';
                        }
                        let c = arr[1];
                        z = c * 2;
                        arr[2] = false;
                i++;
                    }
                }
                    return z;
                }
                `;
        clearTable();
        let parsedCode = parseCode(codeToParse);
        let globalTable = initialParser(parsedCode);
        let args =`'shani', 5, 2, [1,2,false]`;
        let x = (part3(parsedCode, codeToParse, args, globalTable)).split('\n');
        let actual = x[10];
        let expected = `y > 0\" , shape = \"diamond\"]`;
        assert.equal(actual,expected);
    });
});


