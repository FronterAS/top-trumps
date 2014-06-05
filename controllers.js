app.controller('MainController', function ($scope, GameEvents, ConnectionEvents, Utils, Storage, Connection) {
    var callbacks = ConnectionEvents($scope),

        sendCard = function () {
            $scope.status = 'Sending a card';

            Connection.sendData('card', {
                'chosenProperty': $scope.chosenProperty,
                'card': $scope.myCard
            });
        }

        nextTurn = function (wonLastRound) {
            $scope.win    = null;
            $scope.myGo   = wonLastRound;
            $scope.myCard = Utils.makeCard();
            sendCard();
        },

        displayResult = function (win) {
            $scope.state = win ? 'You win' : win === null ? 'You drew' : 'You lost';

            $scope.status = $scope.state;

            $timeout(function () {
                nextTurn();
            }, 1500);
        };

    // Click connect button and fire this
    $scope.connect = function (opponentId) {
        $scope.opponentId = Connection.connectToPeer(opponentId);

        $scope.status = 'Connecting to ' + opponentId;
        $scope.myGo = true;
    };

    // Create your first card.
    $scope.myCard         = Utils.makeCard();
    $scope.myGo           = false;
    $scope.connected      = false;
    $scope.chosenProperty = null;

    // It might not exist in storage, but if it does the last person you played will be already
    // entered in the connection id input.
    // You can clear out the storage if it's annoying you. See below for more detail.
    // Just uncomment the following line.
    // Storage.clear();
    $scope.opponentId = Storage.retrieveStoredIds().opponentId;

    $scope.$on(GameEvents.READY_TO_PLAY, function (event) {
        $scope.status = 'Opponent is ready to play';
    });

    $scope.$on(GameEvents.PROPERTY_CHOSEN, function (event, propertyName) {
        if ($scope.myGo) {
            $scope.status = 'You chose to play with ' + propertyName;
            sendCard();
        }
    });

    $scope.$on(GameEvents.CARD_RECEIVED_FROM_OPPONENT, function (event, cardData) {
        $scope.opponentCard = cardData.card;

        debugger;

        /*Utils.calculateWinner(
            cardData.chosenProperty,
            cardData.card,
            $scope.myCard
        ).then(displayResult);*/
    });

    Connection.init(callbacks);
});
