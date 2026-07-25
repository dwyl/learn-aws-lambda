import tap, { Test } from 'tap';
import { add } from './add.ts';

tap.test('add two numbers', (t: Test) => {
  t.equal(add(1, 2), 3);
  t.end();
})

tap.test('add a negative number should work', (t: Test) => {
  t.equal(add(1, -2), -1);
  t.end();
})