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

//get all data pertaining to key file path
function getData(key) {
  return fs.readFileSync(`./data/${key}`);
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
    fs.writeFileSync(`./data/${key}`, payload);
    console.log('File created, saved data');
  }
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
      console.log(tokens[0]);
      console.log((getData(tokens[1]).toString('utf8')));
      sock.write(getData(tokens[1]));
    } else if (tokens[0] === 'SET') {
      console.log(tokens[0]);
      sock.write(setData(tokens[1], tokens[2]));
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