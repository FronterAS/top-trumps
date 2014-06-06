app.service('Utils', function ($q) {
    var makeNumber = function (multiplier) {
            return Math.floor(Math.random() * (multiplier || 10));
        };

    this.makeCard = function () {
        // found in images folder i.e. oldie-[*].jpg
        var numOfImages = 10;

        return {
            'cardDetails': {
                'population': makeNumber(1000000),
                'coastline (km)': makeNumber(500),
                'area (km2)': makeNumber(30000),
                'GDP': 1
            },
            'chosenProperty': null,
            'imageUrl': 'images/country-' +
                    (Math.ceil(Math.random() * numOfImages)) + '.jpg'
        };
    };

    // A draw is null
    // This is going to have to be replaced if the values become more complex
    // or different winning factors have to be taken into consideration.
    this.calculateWinner = function (property, opponentCard, myCard) {
        var didIwin = opponentCard[property] === myCard[property] ?
                null :
                myCard[property] > opponentCard[property], // true or false

            winLoseDraw = didIwin === null ? 'draw' :
                didIwin ? 'me' : 'opponent';

        return $q.when(winLoseDraw);
    };
})
