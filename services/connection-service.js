/**
 * Use this to manage connection to webRTC signalling server.
 */
app.service('Connection', function (Storage) {
    'use strict';

    var connection,
        Me,
        callbacks,

        sendData = function (type, data) {
            if (!connection) {
                console.error('No, you don\'t have a connection');
                return;
            }

            connection.send({
                'type': type,
                'value': data
            });
        },

        bindEvents = function (callbacks) {
            // When your id is registered with the peer server
            connection.on('open', function () {
                callbacks.onConnectionToPeerSuccess(connection);
            });
            // When data is receieved
            connection.on('data', callbacks.onDataReceivedFromPeer);
        },

        onPeerConnectToYou = function (conn) {
            connection = conn;
            bindEvents(callbacks);
            Storage.saveOpponentId(conn.peer);

            callbacks.onPeerConnectToYou(conn);
        },

        onRegisterIdWithPeerServer = function (id) {
            Storage.saveMyId(id);
            callbacks.onRegisterIdWithPeerServer(id);
        },

        connectToPeer = function (opponentId) {
            if (!Me) {
                console.error('You need to set up a Peer instance. Run Connection.init().');
                return;
            }

            Storage.saveOpponentId(opponentId);

            connection = Me.connect(opponentId);
            bindEvents(callbacks);
        },

        init = function (_callbacks) {
            var storedIds = Storage.retrieveStoredIds(),

                peerOptions = {
                    'host': 'localhost',
                    'port': 9000,
                    'path': '/toptrumps'
                };

            callbacks = _callbacks;

            // This is your PeerJS object which controls all your connections
            Me = storedIds.myId ?
                new Peer(storedIds.myId, peerOptions) :
                new Peer(peerOptions);

            // This is when you have registered with the peerjs server
            Me.on('open', onRegisterIdWithPeerServer);

            // When someone else initialises a connection to you,
            Me.on('connection', onPeerConnectToYou);

            return Peer;
        };

    // API
    this.init          = init;
    this.sendData      = sendData;
    this.connectToPeer = connectToPeer;
});
