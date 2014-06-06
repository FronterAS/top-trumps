app.factory('GameEventHandlers', function ($timeout, Utils) {
    return function ($scope) {
        var flipOpponentsCard = function (show) {
                show = show || false;
                angular.element(document.body).toggleClass('property-chosen', show);
            },

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

            sendCard = function () {
                $scope.status = 'Sending a card';
                $scope.sendCard($scope.myCard);
            },

            init = function () {
                // Create your first card.
                $scope.myCard         = Utils.makeCard();
                $scope.win            = null;
                $scope.state          = null;
                $scope.myGo           = false;

                $scope.scores = {
                    'me'        : 0,
                    'opponent'  : 0
                };
            };

        init();

        return {
            scope: $scope,

            onReadyToPlay: function (event) {
                $scope.status = 'Opponent is ready to play';
            },

            onPropertyChosen: function (event, propertyName) {
                if ($scope.myGo) {
                    $scope.status = 'You chose to play with ' + propertyName;
                    $scope.myCard.chosenProperty = propertyName;

                    sendCard();
                }

                $scope.myGo = false;
            },

            onCardReceived: function (event, cardData) {
                var chosenProperty;

                // Setting the opponent card is important for the opponent's card
                // to display correctly in it's card directive.
                $scope.opponentCard = cardData;

                flipOpponentsCard(true);

                // Avoid an infinite loop yes :)
                if (!$scope.myGo) {
                    sendCard();
                }

                // What property did you/opponent choose?
                chosenProperty = $scope.myGo ?
                    $scope.myCard.chosenProperty :
                    cardData.chosenProperty;

                Utils.calculateWinner(
                    chosenProperty,
                    cardData.cardDetails,
                    $scope.myCard.cardDetails
                ).then(handleResult);
            }
        };
    };
});
