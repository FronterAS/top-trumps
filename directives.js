app.directive('status', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/status.html',
            link: function (scope, element) {
                element.addClass('status-directive');
                // Use ($)scope.status to print to console log and add a message to the screen.
                scope.$watch('status', function (value) {
                    if (value !== undefined) {
                        console.log(value);
                    }
                });
            }
        };
    })

    .directive('connection', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/connection-interface.html'
        };
    })

    .directive('cards', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/cards.html'
        };
    })

    .directive('card', function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },

            // to have nested templates one needs to use the templateCache
            templateUrl: 'partials/card.html',

            controller: function ($scope, GameEvents) {
                $scope.chooseProperty = function (propertyName) {
                    $scope.$emit(GameEvents.PROPERTY_CHOSEN, propertyName);
                };
            },

            link: function (scope, element) {
                element.addClass('card-directive');
            }
        };
    })

    .directive('scores', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/scores.html',
            link: function (scope, element) {
                element.addClass('scores-directive');
            }
        };
    });
