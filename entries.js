const readline = require('readline');

const input = readline.createInterface(
  process.stdin, process.stdout
);

input.setPrompt(`What data would you like to add? `);
input.prompt();
input.on('line', (data) => {
  console.log(`Data received by users: ${data}`);
  input.close();
});


const myArgs = process.argv.slice(2);
let data = [];



module.exports = data;