var dg = (function() {
    //////////////////////////////////////////////////////////////////////////////
    // Data Types
    var _dataTypeArr = new Array();
    var _dataTypes = {};

    function _addDataType(dt) {
        _dataTypeArr.push(dt);
        _dataTypes[dt.typeName] = dt;
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
        parse: function(inputStr) {
            var d = new Date(inputStr);
            // HACK - needed for reverse date lookup!
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d;
        },
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
    var guessDataType = function(inputStr) {
        for (var type_i in _dataTypeArr) {
            type = _dataTypeArr[type_i];
            if (type.test(inputStr)) {
                return type;
            }
        }
        // should never get to this point... (string_t.test always passes)
        return _dataTypes["string_t"];
    }


    //////////////////////////////////////////////////////////////////////////////
    // Accumulators
    function Accumulator() {
        // base class Accumulator
        //  all subclasses are expected to have:
        //    'accumulate' method
        //    'getValue' method
        this.val = null;
    }
    Accumulator.prototype.accumulate = function(val) { }
    Accumulator.prototype.getValue = function() { return this.val; }


    function AccumulatorGenericMin(seed) {
        if (seed == undefined) {
            seed = Infinity;
        }
        this.val = seed;
    }
    AccumulatorGenericMin.prototype = new Accumulator();
    AccumulatorGenericMin.prototype.accumulate = function(val) {
        if (val < this.val) { this.val = val; }
    }


    function AccumulatorGenericMax(seed) {
        if (seed == undefined) {
            seed = -Infinity;
        }
        this.val = seed;
    }
    AccumulatorGenericMax.prototype = new Accumulator();
    AccumulatorGenericMax.prototype.accumulate = function(val) {
        if (val > this.val) { this.val = val; }
    }


    function AccumulatorGenericAvg() {
        this.sum = 0;
        this.count = 0;
    }
    AccumulatorGenericAvg.prototype = new Accumulator();
    AccumulatorGenericAvg.prototype.accumulate = function(val) {
        this.sum += val;
        this.count += 1;
    }
    AccumulatorGenericAvg.prototype.getValue = function() {
        return this.sum / this.count;
    }

    // create some factory methods on the original Accumulator object
    Accumulator.generic_min = function(seed) { return new AccumulatorGenericMin(seed); }
    Accumulator.generic_max = function(seed) { return new AccumulatorGenericMax(seed); }
    Accumulator.generic_avg = function() { return new AccumulatorGenericAvg(); }



    // only return public module variables
    return {
        version: 0.1,
        // data types
        guessDataType: guessDataType,
        // accumulators
        Accumulator: Accumulator,
    };
})();


