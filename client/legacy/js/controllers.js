/**
 * Created by sbunke on 3/27/2015.
 */
var app = angular.module('myModule', ['ui.bootstrap', 'ui.bootstrap.accordion']);

app.controller('ChatController', ['$scope',

    function ChatController($scope) {
        var serverUrl = 'http://localhost:3001';
        var socket = io.connect(serverUrl);

        $scope.messages = [];
        $scope.roster = [];
        $scope.name = '';
        $scope.text = '';
        $scope.rangeValue = 50;

        $scope.machineCounters = [];

        $scope.isCollapsed = false;


        socket.on('connect', function () {
            $scope.setName();
        });

        socket.on('message', function(data) {
            console.log('received message');
            console.log(data);
        });

        socket.on('counter', function (msg) {
            console.log('received counter message ------------');
            console.log(msg);


            var copiedMsg = angular.copy(msg);


            //$scope.machineCounters.push(copiedMsg);

            var index = getCounterIndex(msg);

            console.log('returned index ' + index);

            if (index === -1) {
                $scope.machineCounters.push(copiedMsg);
            }
            else {
                $scope.machineCounters[index] = copiedMsg;
            }

            $scope.$apply();

            //$scope.counters[msg.machine] = msg;

            //console.log($scope.counters);

        });

        function getCounterIndex(counter) {
            var index = -1;
            var arrayLength = $scope.machineCounters.length;
            for (var i = 0; i < arrayLength; i++) {
                console.log($scope.machineCounters[i].machine);
                if ($scope.machineCounters[i].machine === counter.machine) {
                    index = i;
                    break
                }
            }
            return index;
        }


        socket.on('message', function (msg) {
            $scope.messages.push(msg);

            var num = parseFloat(msg.text);

            if (!isNaN(num)) {
                $scope.rangeValue = num;
            }
            //if (msg.name === '/api/notify') {
            //      $scope.rangeValue = msg.text;
            // }
            $scope.$apply();
        });

        socket.on('roster', function (names) {
            $scope.roster = names;
            $scope.$apply();
        });

        $scope.send = function send() {
            console.log('Sending message:', $scope.text);
            socket.emit('message', $scope.text);
            $scope.text = '';
        };

        $scope.setName = function setName() {
            socket.emit('identify', $scope.name);
        };
    }]);
