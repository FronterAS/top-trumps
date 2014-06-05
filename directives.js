app.directive('status', function () {
        return {
            restrict: 'E',
            template: '<span>{{status}}</span>',
            link: function (scope) {
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
            templateUrl: 'connection-interface.html'
        };
    })

    .directive('cards', function () {
        return {
            restrict: 'E',
            templateUrl: 'cards.html'
        };
    })

    .directive('card', function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },

            // to have nested templates one needs to use the templateCache
            templateUrl: 'card.html',

            controller: function ($scope, GameEvents) {
                $scope.chooseProperty = function (propertyName) {
                    $scope.$emit(GameEvents.PROPERTY_CHOSEN, propertyName);
                };

                // Opponents have not sent their card data yet.
                if ($scope.data) {
                    $scope.imageUrl = $scope.data.imageUrl;
                }
            },

            link: function (scope, element) {
                element.addClass('card-directive');

                scope.$watch('data', function (value) {
                    debugger;
                });
            }
        };
    })

    .directive('scores', function () {
        return {
            restrict: 'E',
            templateUrl: 'scores.html'
        };
    });
