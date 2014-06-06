app.factory('GameEventHandlers', function ($timeout, Utils) {
    return function ($scope) {
        var flipOpponentsCard = function (show) {
                show = show || false;
                angular.element(document.body).toggleClass('property-chosen', show);
            },

            nextTurn = function (wonLastRound) {
                flipOpponentsCard();

                $scope.win    = null;

                //wonLastRound == 1 if won, 0 if draw, -1 if lost
                if (wonLastRound !== 0) {
                    $scope.myGo = wonLastRound === 1 ? true : false;
                }
                $scope.myCard = Utils.makeCard();
            },

            handleResult = function (whoWon) {
                var winner;

                // draw logic
                if (whoWon === 'draw') {
                    $scope.status = 'Draw!';
                    winner = 0;

                    $scope.drawScore += 1;

                    $timeout(function () {
                        nextTurn(winner); //needs to be the same person
                    }, 2500);


                // win lose logic
                } else {
                    winner = whoWon === 'me' ? 1 : -1;

                    $scope.scores[whoWon] += 1;
                    $scope.scores[whoWon] += $scope.drawScore;
                    $scope.drawScore = 0;

                    $scope.state = winner === 1 ? 'You win' : 'You lost';

                    $scope.status = $scope.state;

                    // Do we need to celebrate for too long?
                    $timeout(function () {
                        nextTurn(winner);
                    }, 2500);
                }
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
                $scope.drawScore      = 0;

                // $scope.myGo is initialised in the main controller

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
