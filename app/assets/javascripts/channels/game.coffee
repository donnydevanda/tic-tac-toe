App.game = App.cable.subscriptions.create "GameChannel",
  connected: ->
    $('#status').html("Waiting for an other player")

  disconnected: ->

  received: (data) ->
    switch data.action
      when "game_start"
        $('#status').html("Player found")
        App.gamePlay = new Game('#board', data.msg, data.name)

      when "take_turn"
        App.gamePlay.move data.move
        App.gamePlay.getTurn()

      when "new_game"
        App.gamePlay.newGame()

      when "opponent_withdraw"
        $('#status').html("Opponent withdraw, You win!")
        $('#new-match').removeClass('hidden');

  take_turn: (move) ->
    @perform 'take_turn', data: move

  new_game: () ->
    @perform 'new_game'
