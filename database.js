const net = require('net');
const fs = require('fs');

//make sure data folder exists

class Socket {
  constructor(sock) {
    sock.setEncoding('utf-8');
    this.sock = sock;
  }

  onData() {
    return new Promise((resolve, reject) => {
      const cb = res => resolve([res, cb]);
      this.sock.on('data', cb);
    }).then(([res, cb]) => {
      this.sock.removeListener('data', cb);
      return res;
    })
  }

  write(data) {
    this.sock.write(data)
  }
}

class Server {
  constructor(cb) {
    //take sock as perimeter to modify it and work with it
    this.server = net.createServer(async (sock) => {
      const socket = new Socket(sock);
      //cb takes socket as a parameter, in addition to createServer(cb)
      while (true) {
        await cb(socket);
      }
    })
  }

  listen(port, cb) {
    return this.server.listen(port, cb); 
  }
}

const getToken = (data) => {

  const tokens = [];
  let curr = 0;
  let isData = false;

  for (let i of data) {
    //beginning of data entry
    if (i === '[') {
      isData = true;
    //end of data entry
    } else if ( i === ']') {
      isData = false;
    //add characters one by one into tokens array
    } else if (i === ' ') {
      if (isData) {
        tokens[curr] = ((tokens[curr] || '') + i)
      } else if (tokens[curr]) {
        curr += 1;
      }
    } else {
      tokens[curr] = ((tokens[curr] || '') + i);
    }
  }

  return tokens;
};

//get all data pertaining to key file path
function getData(key) {
  //make path more dynamic
  let path = `./data/${key}`;
  if (!fs.existsSync(path)) {
    return 'Use SET method to create and set data';
  } else {
    return fs.readFileSync(path).toString('utf-8');
  };
};

//set payload into key file path
function setData(key, payload) {
  let path = `./data/${key}`;
  if (fs.existsSync(path)) {
    fs.appendFile(path, payload, function(err){
      if (err) throw err;
      console.log('Saved Data');
    });
  } else {
    fs.writeFileSync(path, payload);
    console.log('File created, saved data');
  }
  return `SET ${key}`;
};

const server = new Server(async (sock) => {
  //just this connection sits and wait for data to come in, to enable multi-connection
  const data = await sock.onData();
  const tokens = getToken(data);
  if (tokens[0] === 'GET') {
    sock.write(getData(tokens[1]));
    console.log('Data Sent');
  } else if (tokens[0] === 'SET') {
    sock.write(setData(tokens[1], tokens[2]));
  } else {
    sock.write('No Command, check syntax "method folder [key]"');
  }
});

server.listen(8124, () => {
  console.log('server bound');
});