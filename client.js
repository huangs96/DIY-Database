// const myArgs = require('./entries');
const net = require('net');
const readline = require('readline');

var client = new net.Socket();
client.setEncoding("utf8");
client.connect(8124, '127.0.0.1', function() {
  console.log('Connected');

  //store entries
  let dataEntry = '';

  //input for adding data into database
  const input = readline.createInterface(
    process.stdin, process.stdout
  );
  
  input.setPrompt(`> `);
  input.prompt();
  input.on('line', (data) => {
    client.write(data);
    // input.close();
  });

});

client.on('data', function(data){
  console.log(data);
  // client.destroy();
});
