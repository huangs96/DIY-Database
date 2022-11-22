const net = require('net');
const fs = require('fs');

const getToken = (data) => {
  
  let tokens = data.split(' ');
  console.log(tokens);
  
  if (!tokens[tokens.length-1].includes(']')) {
    console.log('Wrong syntax, please follow "method folder [key]" format.');
  } else {
    let removeFirstBracket = tokens[tokens.length-1].replace('[', '');
    let removeSecondBracket = removeFirstBracket.replace(']', '');
    tokens[tokens.length-1] = removeSecondBracket;
  };

  return tokens;

}

function getData(key) {
  return fs.readFileSync(`./data/${key}`);
}

function setData(key) {
  fs.writeFileSync(`./data/${key}`, payload);
  return `SET ${key}`;
}


const server = net.createServer((sock) => {
  // 'connection' listener.
  sock.setEncoding("utf8"); //set data encoding (either 'ascii', 'utf8', or 'base64')
  sock.on('data', function(data) {
    console.log('data---', data);
    const tokens = (getToken(data));
    console.log('token---', tokens);

    if (tokens[0] === 'GET') {
      console.log((getData(tokens[1]).toString('utf8')));
    } else if (tokens[0] === 'SET') {
      sock.write(setData(tokens[2]));
    } else {
      console.log('No Command, check syntax "method folder [key]"');
    }



  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(8124, () => {
  console.log('server bound');
});