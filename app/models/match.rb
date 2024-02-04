class Match < ApplicationRecord
  def self.create(uuid)
    if !REDIS.get("matches").blank?
      opponent = REDIS.get("matches")
      opponent_name = REDIS.get("name")

      Game.start(uuid, "Name2", opponent, opponent_name)
      REDIS.set("matches", nil)
    else
      REDIS.set("matches", uuid)
      REDIS.set("name", "Name1")
    end
  end

  def self.remove(uuid)
    if uuid == REDIS.get("matches")
      REDIS.set("matches", nil)
    end
  end

  def self.clear_all
    REDIS.del("matches")
  end
end
