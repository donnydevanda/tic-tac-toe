class Game < ApplicationRecord
  def self.start(player1, name1, player2, name2)
    cross, nought = [[player1, name1], [player2, name2]].shuffle

    ActionCable.server.broadcast "player_#{cross.first}", {action: "game_start", msg: "cross", name: cross.last}
    ActionCable.server.broadcast "player_#{nought.first}", {action: "game_start", msg: "nought", name: nought.last}

    REDIS.set("opponent_for:#{cross.first}", nought.first)
    REDIS.set("opponent_name_for:#{cross.first}", nought.last)
    REDIS.set("opponent_for:#{nought.first}", cross.first)
    REDIS.set("opponent_name_for:#{nought.first}", cross.last)
  end

  def self.withdraw(uuid)
    if winner = opponent_for(uuid)
      ActionCable.server.broadcast "player_#{winner}", {action: "opponent_withdraw"}
    end
  end

  def self.opponent_for(uuid)
    REDIS.get("opponent_for:#{uuid}")
  end

  def self.take_turn(uuid, move)
    opponent = opponent_for(uuid)

    ActionCable.server.broadcast "player_#{opponent}", {action: "take_turn", move: move['data']}
  end

  def self.new_game(uuid)
    opponent = opponent_for(uuid)

    ActionCable.server.broadcast "player_#{opponent}", {action: "new_game"}
  end
end
