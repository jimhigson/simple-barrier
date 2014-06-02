simple-barrier
==============

An ultra-simple, callback-based implementation of the Barrier flow control pattern in Javascript

This is useful for when you want to wait for several things to execute in parallel,
then handle the results all together.

For people too lazy to learn [async](https://github.com/caolan/async).

Waiting for several async tasks
-------------------------------

```javascript

var simpleBarrier = require('simple-barrier'),
    fs = require('fs');

// create a barrier instance
var barrier = simpleBarrier();

// load some files, let the barrier handle the callbacks:
fs.readFile('foo.txt', barrier.waitOn());
fs.readFile('bar.txt', barrier.waitOn());
fs.readFile('baz.txt', barrier.waitOn());

// add a callback for when all files are loaded
barrier.endWith(function( results ){
   
   // Results is an array of the values given by fs.readFile
   // the array is in the order that barrier.waitOn() was called, regardless of the 
   // order they were loaded in
   console.log('foo, bar, and baz are:', results.join('\n'));
});
```

Actioning results one-by-one
----------------------------

```javascript

// in this example we fetch two JSON files from the web,
// extracting just the part that we want:

var simpleBarrier = require('simple-barrier'),
    request = require('request');

var barrier = simpleBarrier();

function extractUsefulPart (err, data){
   // err, data are the standard arguments from request

   if( !err ){
      // the value we return will be added to the result array passed to the .endWith
      // callback. Here, we extract one small part of the whole JSON:
      return JSON.parse(data).usefulBit;
   }
   return null;
}

request('http://example.com/foo.json', barrier.waitOn( extractUsefulPart ));
request('http://example.com/baz.json', barrier.waitOn( extractUsefulPart ));

barrier.endWith(function( usefulBits ){
   usefulBits.forEach(function( bit ){
      console.log(bit + ' is useful');
   });
});
```
