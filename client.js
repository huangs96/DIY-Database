// const myArgs = require('./entries');
const net = require('net');
const readline = require('readline');
const myArgs = process.argv.slice(2);

const input = readline.createInterface(
  
)

var client = new net.Socket();
client.connect(8124, '127.0.0.1', function() {
  console.log('Connected');
  console.log('myArgs----', myArgs);

  client.write('GET table_a.txt [hi]');
  client.write('SET table_a.txt [heyyy]');
  // client.write(`${myArgs}`);
});

client.on('data', function(data){
  client.destroy();
})

module.exports = myArgs;