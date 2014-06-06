app.service('GameEvents', function () {
    return {
        init: function (handlers) {
            handlers.scope.$on(this.READY_TO_PLAY, handlers.onReadyToPlay);
            handlers.scope.$on(this.PROPERTY_CHOSEN, handlers.onPropertyChosen);
            handlers.scope.$on(this.CARD_RECEIVED_FROM_OPPONENT, handlers.onCardReceived);
        },

        // Event constants, useful to avoid typos
        // Beware of throwing undefined as an event name...
        READY_TO_PLAY: 'readyToPlay',
        PROPERTY_CHOSEN: 'propertyChosen',
        CARD_RECEIVED_FROM_OPPONENT: 'cardReceivedFromOpponent'
    };
});



