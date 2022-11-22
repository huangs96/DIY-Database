const net = require('net');
const fs = require('fs');

const getToken = (data) => {
  const tokens = [];
  let curr = 0;
  let information = false;

  for (const i of data) {
    if (i === '[') {
      information = true;
    } else {i === ' '} {
      if (information) {
        tokens[curr] = ((tokens[curr] || '') + i);
        console.log(tokens[curr][tokens[curr].length-1]);
        if (tokens[curr][tokens[curr].length-1] === ']') {
          return tokens;
        }
    } else if (tokens[curr]) {
        curr += 1;
      }
    }
  } return tokens;
}

function getData(key) {
  console.log('getdatakey---', key);
  return fs.readFile(`./data/${key}`)
}

function setData(key) {
  console.log('setdatakey----', key);
  fs.writeFileSync(`./data/[${key}]`, payload);
  return `SET ${key}`;
}


const server = net.createServer((sock) => {
  // 'connection' listener.
  sock.setEncoding("utf8"); //set data encoding (either 'ascii', 'utf8', or 'base64')
  sock.on('data', function(data) {
    const tokens = (getToken(data));
    console.log('token----', tokens);
    console.log(getData(tokens[0]));

    if (tokens[0] === 'GET') {
      sock.write(getData(tokens[1]));
    } else if (tokens[0] === 'SET') {
      sock.write(setData(tokens[2]));
    } else {
      console.log('No Command');
    }


  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(8124, () => {
  console.log('server bound');
});