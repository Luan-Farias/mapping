const express = require('express');

const routes = require('./routes');
const getIP = require('external-ip')();
const port = 8000;
const app = express();
app.use(express.json());
app.use(routes);
const shell = require('shelljs');
const internalIpf = require('internal-ip');

var ip = getIP((err, ip) => {
    if (err) {
        // every service in the list has failed
        throw err;
    }
    console.log(
        '\nExternalIp = ' +
            ip +
            ':' +
            port +
            '\n\nTo external access the application'
    );

    shell.exec('upnpc.exe -a ' + ip + ' ' + port + ' ' + port + ' TCP');
    return ip;
});

const NatAPI = require('nat-api');

const client = new NatAPI();

client.map(
    {
        publicPort: port,
        privatePort: port,
        ttl: 100000,
        protocol: 'TCP',
        description: 'Mapping',
    },
    function (err) {
        if (err) return console.log('Error', err);
    }
);

console.log('Port mapped :' + port + ' TCP!');

app.listen(port, ip, function () {
    console.log('\nListening to port: ' + port + ' - PID: ' + process.pid);
});
