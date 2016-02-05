/*eslint-env node, es6*/
'use strict';

const test = require('tape');

test('public API', (t) => {
    t.plan(7);

    const obj = require('./index');

    t.equals(typeof obj.keyvalue, 'function', 'Should expose "keyvalue"');
    t.equals(typeof obj.gauge, 'function', 'Should expose "gauge"');
    t.equals(typeof obj.timer, 'function', 'Should expose "timer"');
    t.equals(typeof obj.counter, 'function', 'Should expose "counter"');
    t.equals(typeof obj.set, 'function', 'Should expose "set"');

    t.equals(typeof obj.multi, 'function', 'Should expose "multi"');
    t.equals(typeof obj.send, 'function', 'Should expose "send"');
});

test('multi() public method', (t) => {
    t.plan(2);

    const obj = require('./index');

    const oldSend = obj.send;
    obj.send = (message) => {
        t.equal(message, 'prefix.test:1|c\nprefix.sad:4|h\n', 'Multi should send data divided by "\\n"');
    };

    const multi = obj.multi('prefix');

    t.ok(multi.send &&
         multi.keyvalue &&
         multi.gauge &&
         multi.timer &&
         multi.counter &&
         multi.set,
         'multi() should return an hashset of functions');

    multi
        .counter('test', 1)
        .timer('sad', 4)
        .send();
});
