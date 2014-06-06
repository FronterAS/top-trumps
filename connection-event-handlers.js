app.factory('ConnectionEventHandlers', function (GameEvents) {
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

                $scope.status = 'Opponent connected to you!';
                $scope.$apply();
            },

            onDataReceivedFromPeer: function (data) {
                $scope.status = 'Data receieved from opponent';

                switch (data.type) {
                    case 'turnCheck':
                        // Check whose turn it is against the handshake data
                        // hacky as shit but it fucking well works :)
                        $scope.myGo = !data.value;
                        break;

                    case 'card':
                        $scope.$emit(GameEvents.CARD_RECEIVED_FROM_OPPONENT, data.value);
                        break;
                }

                $scope.$apply();
            },

            onConnectionToPeerSuccess: function (conn) {
                $scope.status    = 'Connected to ' + conn.peer;
                $scope.connected = true;
                $scope.$emit(GameEvents.READY_TO_PLAY);
                $scope.$apply();
            }
        };
    };
});
