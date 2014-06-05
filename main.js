'use strict';

angular.module('game', [])
    .controller('MainController', function () {
        console.log('BOOM');
    })
    .directive('messager', {
        restrict: 'A',
        template: '<input type="text" /><button>Send</button>'
        link: function () {
            console.log('I am linking a button thing');
        }
    })
    .directive('connection', {
        restrict: 'A',
        link: function () {
            var peer = new Peer({key: '6cvuigpzcc0ltyb9'});

            console.log('I am a connection', peer);
        }
    })
