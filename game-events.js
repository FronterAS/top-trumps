app.service('GameEvents', function () {
    return {
        READY_TO_PLAY: 'readyToPlay',
        PROPERTY_CHOSEN: 'propertyChosen',
        CARD_RECEIVED_FROM_OPPONENT: 'cardReceivedFromOpponent'
    };
});
