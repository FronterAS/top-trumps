app.controller('MainController', function ($scope, Utils, Connection) {
        var callbacks = {
                onRegisterIdWithPeerServer: function (id) {
                    $scope.myId = id;
                    $scope.status = 'You are registered as ' + id;
                    $scope.$apply();
                },

                onPeerConnectToYou: function (conn) {
                    $scope.connected = true;

                    conn.send({
                        'type': 'turnCheck',
                        'value': $scope.myGo
                    });

                    $scope.status = 'Someone connected to you!';
                    $scope.$apply();
                },

                onDataReceivedFromPeer: function (data) {
                    $scope.status = 'Ta da, a message came in!';

                    switch (data.type) {
                        case 'turnCheck':
                            // check the turn against the handshake
                            $scope.myGo = !data.value;
                            break;

                        case 'card':
                            $scope.yourCard = data.value;
                    }


                    $scope.$apply();
                },

                onConnectionToPeerSuccess: function (conn) {
                    $scope.status = 'Connected to ' + conn.peer;
                    $scope.connected = true;
                    $scope.$apply();
                }
            };

        // Click connect button and fire this
        $scope.connect = function (opponentId) {
            $scope.opponentId = Connection.connectToPeer(opponentId);

            $scope.status = 'Connecting to ' + opponentId;
            $scope.myGo = true;
        };

        // Send the card!
        $scope.sendCard = function () {
            $scope.status = 'Sending a card';

            Connection.sendData('card', $scope.myCard);
        };

        // Create your first card.
        $scope.myCard     = Utils.makeCard();
        $scope.myGo       = false;
        $scope.connnected = false;

        Connection.init(callbacks);
    });
