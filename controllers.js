app.controller('MainController', function ($scope, Events, Utils, Storage, Connection) {
    var callbacks = Events($scope);

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

    // You can clear out the storage
    // Storage.clear();

    // It might not exist, but if it does it will save you some time.
    $scope.opponentId = Storage.retrieveStoredIds().opponentId;

    Connection.init(callbacks);
});
