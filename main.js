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
        $scope.myGo = false;
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

            controller: function ($scope, $window) {
                var retrieveStoredData = function () {
                    $scope.peerId = $window.localStorage.getItem('opponentId');
                    $scope.myId = $window.localStorage.getItem('gameId');
                },

                bindConnection = function (conn) {
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

                    createPeer = function (id) {
                        retrieveStoredData();

                        // This is your peer object which controls all your connections
                        $scope.peer = $scope.myId ?
                            new Peer($scope.myId, {key: '6cvuigpzcc0ltyb9'}) :
                            new Peer({key: '6cvuigpzcc0ltyb9'});

                        // This is when you have registered with the peerjs server
                        $scope.peer.on('open', function (id) {
                            $scope.status = 'My peer ID is: ' + id;
                            $scope.myId = id;

                            // save it for later
                            $window.localStorage.setItem('gameId', id);

                            $scope.$apply();
                        });

                        // When someone else initialises a connection to you,
                        // the 'connection' event is thrown on the 'peer' object
                        $scope.peer.on('connection', function (conn) {
                            bindConnection(conn);

                            $scope.status = 'Someone connected to you!';
                            $scope.$apply();
                        });
                    };

                // Click connect button and fire this
                $scope.connect = function (peerId) {
                    var conn = $scope.peer.connect(peerId);

                    // Store it for convenience
                    $window.localStorage.setItem('opponentId', peerId);

                    $scope.status = 'Connecting to ' + peerId;
                    $scope.myGo = true;
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
    })
    .directive('card', function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: 'card.html'
        };
    })
