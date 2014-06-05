'use strict';

angular.module('game', [])
    .controller('MainController', function ($scope) {
        var makeNumber = function () {
                return Math.floor(Math.random() * 10);
            };

        $scope.makeCard = function () {
            return {
                'value': makeNumber()
            };
        };

        // This is you
        $scope.peer = new Peer({key: '6cvuigpzcc0ltyb9'});
        // This is when you have registered with the peerjs server
        $scope.peer.on('open', function (id) {
            $scope.status = 'My peer ID is: ' + id;
            $scope.myId = id;

            $scope.$apply();
        });

        $scope.myCard = $scope.makeCard();
    })

    .directive('cards', function () {
        return {
            restrict: 'E',
            templateUrl: 'cards.html',
            controller: function ($scope) {},
            link: function (scope) {}
        };
    })

    .directive('messager', function () {
        return {
            restrict: 'E',

            templateUrl: 'gameboard.html',

            controller: function ($scope) {
                // Click connect button and fire this
                $scope.connect = function (peerId) {
                    $scope.status = 'Connecting to ' + peerId;

                    // Connect to a person
                    $scope.conn = $scope.peer.connect(peerId);

                    if ($scope.conn) {
                        $scope.connected = true;

                        // Outgoing messages TO someone
                        $scope.conn.on('open', function () {
                            $scope.status = 'Connected to ' + peerId;
                            $scope.$apply();
                        });

                        $scope.conn.on('data', function (data) {
                            $scope.status = 'Ta da, a message came in!';
                            $scope.receivedMessage = data;
                        });

                    } else {
                        $scope.status = 'Your connection suffered a case of being totally shit.';
                    }
                };

                // Send the card!
                $scope.sendCard = function () {
                    if (!$scope.conn) {
                        $scope.status = 'No connection set up silly pants!';
                        return;
                    }

                    $scope.status = 'Sending a card';
                    $scope.conn.send($scope.myCard);
                };

                // Incoming messages FROM someone
                $scope.peer.on('connection', function (conn) {
                    // When I recieve a card, I send mine back.
                    conn.on('data', function (data) {
                        $scope.status = 'Data receieved';
                        $scope.yourCard = data;
                        $scope.$apply();
                    });

                    // This will only work for a one on one game
                    if (!$scope.conn) {
                        $scope.conn = $scope.peer.connect(conn.peer);
                    }

                    $scope.status = 'Someone connected to you!';
                    $scope.connected = true;

                    $scope.$apply();
                });
            },

            link: function (scope) {
                scope.$watch('status', function (value) {
                    if (value !== undefined) {
                        console.log(value);
                    }
                })
            }
        };
    });
