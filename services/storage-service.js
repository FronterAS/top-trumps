// Remember that service is a singleton
app.service('Storage', function ($window) {
        this.retrieveStoredIds = function () {
            var opponentId = $window.localStorage.getItem('opponentId'),
                myId = $window.localStorage.getItem('myId'),
                ids = {};

            // urgh - sorry
            if (myId) ids.myId = myId;
            if (opponentId) ids.opponentId = opponentId;

            return ids;
        };

        this.clear = function () {
            var idTypes = ['opponentId', 'myId'];

            idTypes.forEach(function (idType) {
                $window.localStorage.removeItem(idType);
            });
        };

        this.saveMyId = function (id) {
            $window.localStorage.setItem('myId', id);
            return id;
        };

        this.saveOpponentId = function (id) {
            $window.localStorage.setItem('opponentId', id);
            return id;
        };
    });
