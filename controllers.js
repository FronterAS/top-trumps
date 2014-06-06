app.controller('MainController',
    function ($scope, GameEvents, GameEventHandlers, ConnectionEventHandlers, Storage, Connection) {
        var init = function () {
                // Setup our connection event handlers
                $scope.connected = false;
                Connection.init(ConnectionEventHandlers($scope));

                // Register our game
                GameEvents.init(GameEventHandlers($scope));

                // It might not exist in storage, but if it does the last person you played will be already
                // entered in the connection id input.
                // You can clear out the storage if it's annoying you. See below for more detail.
                // Just uncomment the following line.
                // Storage.clear();
                $scope.opponentId = Storage.retrieveStoredIds().opponentId;
            };

        $scope.sendCard = function (card) {
            Connection.sendData('card', card);
        };

        // Click connect button and fire this
        $scope.connect = function (opponentId) {
            $scope.opponentId = Connection.connectToPeer(opponentId);
            $scope.status = 'Connecting to ' + opponentId;
            $scope.myGo = true;
        };

        // Setup our game
        init();
    }
);
