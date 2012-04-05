var dg = {
    version: 0.1
};


//////////////////////////////////////////////////////////////////////////////
// Data Types
dg._dataTypeArr = new Array();
dg._dataTypes = {};

function _addDataType(dt) {
    dg._dataTypeArr.push(dt);
    dg._dataTypes[dt.typeName] = dt;
}


var moneyType = {
    typeName: "money_t",
    isNumeric: true,
    re_money: /-?\$[0-9,]+/,
    test:  function(inputStr) { return this.re_money.test(inputStr); },
    parse: function(inputStr) {
        // strip dollar sign and commas out
        inputStr = inputStr.replace(/[$,]/g, "");
        return parseFloat(inputStr);
    },
};
_addDataType(moneyType);

var dateType = {
    typeName: "date_t",
    isNumeric: false,
    re_date1: /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/,   // e.g. 7/1/2007
    re_date2: /[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/,     // e.g. 2007-07-01
    test:  function(inputStr) {
        if (this.re_date1.test(inputStr))
            return true;
        if (this.re_date2.test(inputStr))
            return true;
        return false;
    },
    parse: function(inputStr) { return new Date(inputStr); },
};
_addDataType(dateType);


// NOTE: add stringType LAST for it to be the 'catch-all' case
var stringType = {
    typeName: "string_t",
    isNumeric: false,
    test: function(inputStr) { return true; },
    parse: function(inputStr) { return inputStr; },
};
_addDataType(stringType);


// attempt to guess the data type of the passed in string
dg.guessDataType = function(inputStr) {
    for (var type_i in dg._dataTypeArr) {
        type = dg._dataTypeArr[type_i];
        if (type.test(inputStr)) {
            return type;
        }
    }
    // should never get to this point... (string_t.test always passes)
    return _dataTypes["string_t"];
}


//////////////////////////////////////////////////////////////////////////////
// Accumulators
