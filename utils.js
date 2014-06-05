app.service('Utils', function ($q) {
    var makeNumber = function (multiplier) {
            return Math.floor(Math.random() * (multiplier || 10));
        };

    this.makeCard = function () {
        return {
            'age': makeNumber(200),
            'height': makeNumber(100)
        };
    };

    // A draw is null
    this.calculateWinner = function (property, opponentCard, myCard) {
        var winLoseDraw = opponentCard[property] === myCard[property] ?
            null :
            opponentCard[property] > myCard[property]

        return $q.when(winLoseDraw);
    };
})
