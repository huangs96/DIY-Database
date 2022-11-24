// const myArgs = require('./entries');
const net = require('net');
const readline = require('readline');

var client = new net.Socket();
client.connect(8124, '127.0.0.1', function() {
  console.log('Connected');

  //store entries
  let dataEntry = '';

  //input for adding data into database
  const input = readline.createInterface(
    process.stdin, process.stdout
  );
  
  input.setPrompt(`Action from Database: `);
  input.prompt();
  input.on('line', (data) => {
    if (data.includes('GET')) {
      console.log(`Retrieving data: ${data} `);
      dataEntry = data;
      client.write(dataEntry);
    } else if (data.includes('SET')) {
      console.log(`Data received by database: ${data} `);
      dataEntry = data;
      client.write(dataEntry);
    } else {
      console.log('Incorrect Syntax - please use: "method folder [key]"')
    }
    input.close();
  });

});

client.on('data', function(data){
  client.destroy();
});
