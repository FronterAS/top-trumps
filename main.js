'use strict';

angular.module('game', [])
    .controller('MainController', function ($scope) {
        $scope.makeNumber = function () {
            return Math.floor(Math.random() * 10);
        };

        $scope.makeCard = function () {
            return {
                'value': $scope.makeNumber();
            };
        };

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

            template: '<h2>{{myId}}</h2>' +
                '<div>' +
                    '<input type="text" ng-model="peerId" />' +
                    '<button ng-click="connect(peerId)">Connect</button>' +
                '</div>'+
                '<div>' +
                    '<button ng-click="send()">Send</button>' +
                '</div>'+
                '<div>{{status}}</div>' +
                '<div>{{receivedMessage}}</div>',

            controller: function ($scope) {
                // This is you
                $scope.peer = new Peer({key: '6cvuigpzcc0ltyb9'});

                // This is when you open a connection to someone else
                $scope.peer.on('open', function (id) {
                    $scope.status = 'My peer ID is: ' + id;
                    $scope.myId = id;
                    $scope.$apply();
                });

                // Click connect button and fire this
                $scope.connect = function (peerId) {
                    $scope.status = 'Connecting to ' + peerId;

                    // Connect to a person
                    $scope.conn = $scope.peer.connect(peerId);

                    if ($scope.conn) {
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

                // send the messages!
                $scope.send = function () {
                    if (!$scope.conn) {
                        $scope.status = 'No connection set up silly pants!';
                        return;
                    }

                    $scope.status = 'Sending a card';
                    $scope.conn.send($scope.myCard);
                };

                // Incoming messages FROM someone
                $scope.peer.on('connection', function (conn) {
                    console.log('Someone connected to you!');

                    conn.on('data', function (data) {
                        console.log(data);
                        $scope.receivedMessage = data;
                        $scope.$apply();
                    });
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
