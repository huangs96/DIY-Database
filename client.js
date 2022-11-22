// const myArgs = require('./entries');
const net = require('net');
const myArgs = process.argv.slice(2);

var client = new net.Socket();
client.connect(8124, '127.0.0.1', function() {
    console.log('Connected');
    console.log('myArgs----', myArgs);

  // client.write('GET [key]')
  client.write('GET data [table_a]');
  // client.write('GET test' + '[' + myArgs + ']');
  // client.write('SET test' + '[' + myArgs + ']');
  // client.write(`${myArgs}`);
});

client.on('data', function(data){
  console.log(data);
  client.destroy();
})

module.exports = myArgs;