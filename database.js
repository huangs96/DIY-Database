const net = require('net');
const fs = require('fs');

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
  let path = `./data/${key}`;
  if (!fs.existsSync(path)) {
    console.log('Use SET method to create and set data');
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
}


const server = net.createServer((sock) => {
  // 'connection' listener.
  sock.setEncoding("utf8"); //set data encoding (either 'ascii', 'utf8', or 'base64')
  sock.on('data', function(data) {
    
    const tokens = (getToken(data));

    if (tokens[0] === 'GET') {
      //if data type is undefined, return after console log msg
      if (getData(tokens) === undefined) {
        return;
      };
      console.log(getData(tokens[1]));
      sock.write(getData(tokens[1]));
      console.log('Data Sent');
    } else if (tokens[0] === 'SET') {
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