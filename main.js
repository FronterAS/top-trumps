/*global Peer */
'use strict';

angular.module('game', [])

    .controller('MainController', function ($scope) {
        var makeNumber = function () {
                return Math.floor(Math.random() * 10);
            };

        $scope.makeCard = function () {
            return {
                'age': makeNumber(),
                'height': makeNumber()
            };
        };

        // Create your first card.
        $scope.myCard = $scope.makeCard();
    })

    .directive('cards', function () {
        return {
            restrict: 'E',
            templateUrl: 'cards.html'
        };
    })

    .directive('connectionManager', function () {
        return {
            restrict: 'E',

            templateUrl: 'connection-interface.html',

            controller: function ($scope) {
                var bindConnection = function (conn) {
                        $scope.conn = conn;
                        $scope.connected = true;

                        // When data is receieved
                        $scope.conn.on('data', function (data) {
                            $scope.status = 'Ta da, a message came in!';
                            $scope.yourCard = data;
                            $scope.$apply();
                        });

                        // When the connection is opened...
                        $scope.conn.on('open', function () {
                            $scope.status = 'Connected to ' + conn.peer;
                            $scope.$apply();
                        });
                    },

                    createPeer = function () {
                        // This is you
                        $scope.peer = new Peer({key: '6cvuigpzcc0ltyb9'});

                        // This is when you have registered with the peerjs server
                        // All users will run this code and become peers.
                        $scope.peer.on('open', function (id) {
                            $scope.status = 'My peer ID is: ' + id;
                            $scope.myId = id;

                            $scope.$apply();
                        });

                        // When someone else connects to you, the connection event is thrown.
                        $scope.peer.on('connection', function (conn) {
                            bindConnection(conn);

                            $scope.status = 'Someone connected to you!';
                            $scope.$apply();
                        });
                    };

                // Click connect button and fire this
                $scope.connect = function (peerId) {
                    var conn = $scope.peer.connect(peerId);
                    $scope.status = 'Connecting to ' + peerId;
                    bindConnection(conn);
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

                $scope.connnected = false;

                createPeer();
            },

            link: function (scope) {
                // Use ($)scope.status to print to console log and add a message to the screen.
                scope.$watch('status', function (value) {
                    if (value !== undefined) {
                        console.log(value);
                    }
                });
            }
        };
    });
