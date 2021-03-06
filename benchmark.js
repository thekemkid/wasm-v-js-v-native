const js = require('./primes.js');
const addon = require('./build/Release/primes.node');
const wasm = require('./load-wasm.js');
const convertHrtime = require('convert-hrtime')

console.log("Hello performance friends.");
console.log();

function sanityCheck(n, expected) {
  if (js.prime(n) !== expected) {
    console.error(`Looks like your JavaScript is not right: ${js.prime(n)}`); 
  }
  if (addon.prime(n) !== expected) {
    console.error(`Looks like your C++ is not right ${addon.prime(n)}`);
  }
  if (wasm.prime(n) !== expected) {
    console.error(`Looks like your wasm is not right ${wasm.prime(n)}`);
  }
}

function run(i) {
  const primesCalcsTimes = [i];

  const jsTime = process.hrtime();
  js.prime(i);
  primesCalcsTimes.push(convertHrtime(process.hrtime(jsTime)).milliseconds);

  const addonTime = process.hrtime();
  addon.prime(i)
  primesCalcsTimes.push(convertHrtime(process.hrtime(addonTime)).milliseconds);

  const wasmTime = process.hrtime();
  wasm.prime(i)
  primesCalcsTimes.push(convertHrtime(process.hrtime(wasmTime)).milliseconds);

  console.log(primesCalcsTimes.toString())
}

// Compute lots of primes.
for(let i = 1; i < 200; i++) {
  run(i);
}

for(let i = 2; i < 10; i++) {
  run(i*100);
}

for(let i = 1; i < 10; i++) {
  run(i*1000);
}

for(let i = 1; i < 10; i++) {
  run(i*10000);
}

for(let i = 1; i < 10; i++) {
  run(i*100000);
}

run(1000000);

// Sanity checks.
const checks = [ 
  [1,2],
  [7,17],
  [10000, 104729],
  [100000, 1299709],
  [1000000, 15485863]
];

// Run the checks at the end, otherwise
// they turn on JS optimizations before we start running. 
checks.forEach(function (a) {
  sanityCheck(...a); 
});

console.log();
console.log('So long and thanks for the fish.');
