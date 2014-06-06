var PeerServer = require('peer').PeerServer,

    program  = require('commander')
        .version('0.0.2')
        .option(
            '--path [string]',
            'Git commit hash the shortened version',
            '/toptrumps'
        )
        .option(
            '--port [number]',
            'Run on a different port.',
            '9000'
        )
        .parse(process.argv),

    server = new PeerServer({
        port: program.port,
        path: program.path
    });

console.log('Running path ' + program.path + ' on port ' + program.port);

// When a peer connects
server.on('connection', function (id) {
    console.log(id + ' has connected');
});

// When a peer disconnects
server.on('disconnect', function (id) {
    console.log(id + ' has disconnected');
});
