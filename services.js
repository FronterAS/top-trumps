// Remember that service is a singleton
app

    .service('Utils', function () {
        var makeNumber = function () {
                return Math.floor(Math.random() * 10);
            };

        this.makeCard = function () {
            return {
                'age': makeNumber(),
                'height': makeNumber()
            };
        };
    })

    .service('Storage', function ($window) {
        this.retrieveStoredIds = function () {
            var opponentId = $window.localStorage.getItem('opponentId'),
                myId = $window.localStorage.getItem('myId'),
                ids = {};

            // urgh - sorry
            if (myId) ids.myId = myId;
            if (opponentId) ids.opponentId = opponentId;

            return ids;
        };

        this.saveMyId = function (id) {
            $window.localStorage.setItem('myId', id);
            return id;
        };

        this.saveOpponentId = function (id) {
            $window.localStorage.setItem('opponentId', id);
            return id;
        };
    })

    .service('Connection', function (Storage) {
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
                var storedIds = Storage.retrieveStoredIds();

                callbacks = _callbacks;

                // This is your PeerJS object which controls all your connections
                Me = storedIds.myId ?
                    new Peer(storedIds.myId, {'key': peerKey}) :
                    new Peer({'key': peerKey});

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
