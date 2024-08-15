var args = process.argv;
console.log(args[2]);
var arg = args[2];

if (arg === "1") {
  console.log("arg is 1");
} else {
  console.log("arg is not 1");
}
console.log("done", typeof arg);
