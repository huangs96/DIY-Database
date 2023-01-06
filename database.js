const net = require('net');
const fs = require('fs');

class Socket {
  constructor(sock) {
    sock.setEncoding('utf-8');
    this.sock = sock;
  };

  onData() {
    return new Promise((resolve, reject) => {
      const cb = res => resolve([res, cb]);
      this.sock.on('data', cb);
    }).then(([res, cb]) => {
      this.sock.removeListener('data', cb);
      return res;
    });
  };

  write(data) {
    this.sock.write(data)
  };
};

class Server {
  constructor(cb) {
    this.server = net.createServer(async (sock) => {
      const socket = new Socket(sock);
      while (true) {
        await cb(socket);
      };
    });
  };
  
  listen(port, cb) {
    return this.server.listen(port, cb); 
  };
};

const getToken = (data) => {

  const tokens = [];
  let curr = 0;
  let isData = false;

  for (let i of data) {
    if (i === '[') {
      isData = true;
    } else if ( i === ']') {
      isData = false;
    } else if (i === ' ') {
      if (isData) {
        tokens[curr] = ((tokens[curr] || '') + i)
      } else if (tokens[curr]) {
        curr += 1;
      };
    } else {
      tokens[curr] = ((tokens[curr] || '') + i);
    };
  };
  return tokens;
};

function getData(file, key) {
  let path = `./${file}/${key}`;
  console.log(path);
  if (!fs.existsSync(path)) {
    return 'Use SET method to create and set data';
  } else {
    return fs.readFileSync(path).toString('utf-8');
  };
};

function setData(file, key, payload) {
  let path = `./${file}/${key}`;
  if (fs.existsSync(path)) {
    fs.appendFile(path, payload, function(err){
      if (err) throw err;
      console.log('Saved Data');
    });
  } else {
    fs.writeFileSync(path, payload);
    console.log('File created, saved data');
  };
  return `SET ${key}`;
};

const server = new Server(async (sock) => {
  const data = await sock.onData();
  const tokens = getToken(data);
  if (tokens[0] === 'GET') {
    sock.write(getData(tokens[1], tokens[2]));
    console.log('Data Sent');
  } else if (tokens[0] === 'SET') {
    sock.write(setData(tokens[1], tokens[2], tokens[3]));
  } else {
    sock.write('No Command, check syntax "method folder key [data]"');
  };
});

server.listen(8124, () => {
  console.log('server bound');
});
