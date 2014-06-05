app.service('Utils', function ($q) {
    var makeNumber = function () {
            return Math.floor(Math.random() * 10);
        };

    this.makeCard = function () {
        return {
            'age': makeNumber(),
            'height': makeNumber()
        };
    };

    // A draw is null
    this.calculateWinner = function (property, opponentCard, myCard) {
        var winLoseDraw = opponentCard[property] === myCard[property] ?
            null :
            opponentCard[property] > myCard[property]

        return $q.when();
    };
})
