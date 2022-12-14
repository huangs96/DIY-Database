const net = require('net');
const readline = require('readline');

class Client {
  constructor() {
    this.sock = new net.Socket();
    this.sock.setEncoding("utf8");
  }
  
  //function(method) inside class which resolves if connection is established
  connect() {
    return new Promise((resolve, reject) => {
      this.sock.connect(8124, '127.0.0.1', resolve)
    })
  }

  write(data) {
    return new Promise((resolve, reject) => {
      this.sock.write(data);
      const cb = res => resolve([res, cb]);
      this.sock.on('data', cb);
    }).then(([res, cb]) => {
      this.sock.removeListener('data', cb);
      return res;
    })
  }
};

class Input {
  constructor() {
    this.input = readline.createInterface(
      process.stdin, process.stdout
    );
  }

  readline() {
    return new Promise((resolve, reject) => {
      this.input.setPrompt(`> `);
      this.input.prompt();
      this.input.on('line', resolve);
    })
  }
};

//Continuously ask for input, send to database, and ask for response
const main = async () => {
  const client = new Client();
  const input = new Input();

  await client.connect();
  while (true) {
    const data = await input.readline();
    const res = await client.write(data);
    console.log(res);
  }
}

main();
