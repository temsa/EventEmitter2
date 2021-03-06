var simpleEvents = require('nodeunit').testCase;

var file = '../../lib/eventemitter2';

module.exports = simpleEvents({

  setUp: function (callback) {
    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require(file).EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    this.emitter = new EventEmitter2({
      wildcard : true,
      verbose : true
    });
    callback();
  },

  tearDown: function (callback) {
    //clean up?
    callback();
  },

  '1. A listener added with `once` should only listen once and then be removed.': function (test) {

    var emitter = this.emitter;
    var type = 'test1.foo.bar';
    
    emitter.once(type, function () {
      test.ok(true, 'The event was raised once');
    });

    emitter.emit(type);
    emitter.emit(type);

    test.expect(1);
    test.done();

  },
  '2. A listener with a TTL of 4 should only listen 4 times.': function (test) {

    var emitter = this.emitter;
    var type = 'test1.foo.bar';

    emitter.many(type, 4, function (value1) {
      test.ok(true, 'The event was raised 4 times.');
    });

    emitter.emit(type, 1);
    emitter.emit(type, 2);
    emitter.emit(type, 3);
    emitter.emit(type, 4);
    emitter.emit(type, 5);

    test.expect(4);
    test.done();

  },
  '3. A listener with a TTL of 4 should only listen 4 times and pass parameters.': function (test) {

    var emitter = this.emitter;
    var type = 'test1.foo.bar';

    emitter.many(type, 4, function (value1, value2, value3) {
      test.ok(typeof value1 !== 'undefined', 'got value 1');
      test.ok(typeof value2 !== 'undefined', 'got value 2');
      test.ok(typeof value3 !== 'undefined', 'got value 3');
    });

    emitter.emit(type, 1, 'A', false);
    emitter.emit(type, 2, 'A', false);
    emitter.emit(type, 3, 'A', false);
    emitter.emit(type, 4, 'A', false);
    emitter.emit(type, 5, 'A', false);

    test.done();

  },
  '4. Remove an event listener by signature.': function (test) {

    var emitter = this.emitter;
    var type = 'test1.foo.bar';
    var count = 0;

    function f1(event) {
      "event A";
      test.ok(true, 'The event was raised less than 3 times.');
    }

    emitter.on(type, f1);
    
    function f2(event) {
      "event B";
      test.ok(true, 'The event was raised less than 3 times.');  
    }    
    
    emitter.on(type, f2);

    function f3(event) {
      "event C";
      test.ok(true, 'The event was raised less than 3 times.');
    }

    emitter.on(type, f3);

    emitter.removeListener(type, f2);

    emitter.emit(type);

    test.expect(2);
    test.done();

  },
  '5. `removeListener` and `once`': function(test) {
    
    var emitter = this.emitter;
    var type = 'test1.foo.bar';
    var functionA = function() { test.ok(true, 'Event was fired'); };

    emitter.once(type, functionA);
    emitter.removeListener(type, functionA);

    emitter.emit(type);

    test.expect(0);
    test.done();
  },

  '6. Listening with a wildcard on once' : function (test) {
    var emitter = this.emitter;
    var type = 'test1.foo.*';
    var functionA = function() { test.ok(true, 'Event was fired'); };

    emitter.once(type, functionA);
    emitter.on(type,functionA);

    emitter.emit(type); //2
    emitter.emit(type); //1

    test.expect(3);
    test.done();
  },

  '7. Emitting with a wildcard targeted at once' : function (test) {
    var emitter = this.emitter;
    var type = 'test1.foo.bar';
    var type2 = 'test1.foo.*';
    var functionA = function() { test.ok(true, 'Event was fired'); };

    emitter.once(type, functionA);
    emitter.emit(type2);
    emitter.emit(type2);

    test.expect(1);
    test.done();
  }
  
});
