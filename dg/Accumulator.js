
// base class Accumulator
//  all subclasses are expected to have
//      'accumulate' method
//      'getValue' method
function Accumulator() {
    this.val = null;
}
Accumulator.prototype.accumulate = function(val) { }
Accumulator.prototype.getValue = function() { return this.val; }


function AccumulatorGenericMin() { this.val = null; }
AccumulatorGenericMin.prototype = new Accumulator();
AccumulatorGenericMin.prototype.accumulate = function(val) {
    // the first time accumulate is called -
    //  this will initialize 'val' and forward all future accumulate calls to accumulatePostInit
    this.val = val;
    this.accumulate = this.accumulatePostInit;
}
AccumulatorGenericMin.prototype.accumulatePostInit = function(val) {
    if (val < this.val) { this.val = val; }
}


function AccumulatorGenericMax() { this.val = null; }
AccumulatorGenericMax.prototype = new Accumulator();
AccumulatorGenericMax.prototype.accumulate = function(val) {
    // the first time accumulate is called -
    //  this will initialize 'val' and forward all future accumulate calls to accumulatePostInit
    this.val = val;
    this.accumulate = this.accumulatePostInit;
}
AccumulatorGenericMax.prototype.accumulatePostInit = function(val) {
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

