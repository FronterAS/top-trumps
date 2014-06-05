app.factory('Events', function () {
    return function ($scope) {
        return {
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
    };
});
