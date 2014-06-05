app.controller('MainController',
    function ($scope, $timeout, GameEvents, ConnectionEvents, Utils, Storage, Connection) {
        var callbacks = ConnectionEvents($scope),

            flipOpponentsCard = function (show) {
                show = show || false;
                angular.element(document.body).toggleClass('property-chosen', show);
            },

            sendCard = function () {
                $scope.status = 'Sending a card';

                Connection.sendData('card', $scope.myCard);
            }

            nextTurn = function (wonLastRound) {
                flipOpponentsCard();

                $scope.win    = null;
                $scope.myGo   = wonLastRound;
                $scope.myCard = Utils.makeCard();
            },

            handleResult = function (didIwin) {
                var winner = didIwin ? 'me' : 'opponent';

                $scope.scores[winner] += 1;

                $scope.state = didIwin ? 'You win' : didIwin === null ? 'You drew' : 'You lost';

                $scope.status = $scope.state;

                // Do we need to celebrate for too long?
                $timeout(function () {
                    nextTurn(didIwin);
                }, 1500);
            },

            init = function () {
                // Create your first card.
                $scope.myCard         = Utils.makeCard();
                $scope.myGo           = false;
                $scope.connected      = false;
                $scope.scores = {
                    'me': 0,
                    'opponent': 0
                };

                // It might not exist in storage, but if it does the last person you played will be already
                // entered in the connection id input.
                // You can clear out the storage if it's annoying you. See below for more detail.
                // Just uncomment the following line.
                // Storage.clear();
                $scope.opponentId = Storage.retrieveStoredIds().opponentId;
            },

            bindEvents = function () {
                $scope.$on(GameEvents.READY_TO_PLAY, function (event) {
                    $scope.status = 'Opponent is ready to play';
                });

                $scope.$on(GameEvents.PROPERTY_CHOSEN, function (event, propertyName) {
                    if ($scope.myGo) {
                        $scope.status = 'You chose to play with ' + propertyName;
                        $scope.myCard.chosenProperty = propertyName;
                        sendCard();
                    }
                });

                $scope.$on(GameEvents.CARD_RECEIVED_FROM_OPPONENT, function (event, cardData) {
                    $scope.opponentCard = cardData.cardDetails;

                    flipOpponentsCard(true);

                    // Avoid an infinite loop yes :)
                    if (!$scope.myGo) {
                        sendCard();
                    }

                    Utils.calculateWinner(
                        $scope.myGo ? $scope.myCard.chosenProperty : cardData.chosenProperty,
                        cardData.cardDetails,
                        $scope.myCard.cardDetails
                    ).then(handleResult);
                });
            };

        // Click connect button and fire this
        $scope.connect = function (opponentId) {
            $scope.opponentId = Connection.connectToPeer(opponentId);

            $scope.status = 'Connecting to ' + opponentId;
            $scope.myGo = true;
        };

        // Setup our connection events
        Connection.init(callbacks);

        // Setup our game
        init();
        bindEvents();
    }
);
