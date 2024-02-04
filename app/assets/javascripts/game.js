$(function () {});

var Game = function (element, playerType, playerName) {
  this.element = $(element);

  this.init = function () {
    this.over = false;
    this.moves = 0;
    this._winPiece = [];
    this.startTime = Date.now();
    this.Player = [];
    this.Board = null;
    this.activePlayer = 0;
    this.currentPlayer = playerType == "cross" ? 0 : 1;
    this.playerName = playerName;

    this.bindEvents();
  };

  this.bindEvents = function () {
    var self = this;

    $("#new-match", this.element).click(function (e) {
      e.preventDefault();
      location.reload();
    });

    $("#restart", this.element).click(function (e) {
      e.preventDefault();
      App.game.new_game();
      self.newGame();
    });

    $("#game tr td", this.element).click(function (el, a, b) {
      if (self.over) return;
      if (self.activePlayer !== self.currentPlayer) return;
      var col = $(this).index();
      var row = $(this).closest("tr").index();
      App.game.take_turn(row + " " + col);
      self.move(row + " " + col);
    });

    $("#game tr td", this.element).hover(
      function () {
        if (self.activePlayer !== self.currentPlayer) return;
        if (self.over) return;
        $(this).addClass("hover-" + self.activePlayer);
      },
      function () {
        if (self.over) return;
        if (self.activePlayer !== self.currentPlayer) return;
        $(this).removeClass("hover-0 hover-1");
      }
    );

    $(this.element).on(
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
      "td.X",
      function () {
        $(this).attr("class", "X");
      }
    );

    $(this.element).on(
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
      "td.O",
      function () {
        $(this).attr("class", "O");
      }
    );
  };

  this.start = function () {
    this.init();
    $("#game tr td").attr("class", "");
    this.getTurn();
    this.Player.push(new Player(0));
    this.Player.push(new Player(1));
    this.Board = new Board();
    this.Board.update();
    this.startTime = Date.now();
  };

  this.newGame = function (element) {
    if (self.moves < 1) return;
    $("#restart").addClass("hidden");
    $("td.X, td.O", this.element).addClass("animated zoomOut");
    this.start();
  };

  this.getTurn = function () {
    if (this.over) return;
    if (this.activePlayer === this.currentPlayer) {
      $("#status").html("Your turn");
    } else {
      $("#status").html("Opponent's turn");
    }
  };

  this.parseInput = function (v) {
    v = v.split(" ");
    var pos = Number(v[1]);
    if (v[0] == 1) pos = pos + 3;
    if (v[0] == 2) pos = pos + 6;
    return {
      row: v[0],
      col: v[1],
      index: pos,
    };
  };

  this.tryMove = function (input) {
    if (this.Board.board[input] == "_") return true;
    return false;
  };

  this.move = function (v) {
    var Player = this.Player[this.activePlayer];
    v = this.parseInput(v);
    if (!this.tryMove(v.index)) return false;

    Player.moves.push(v.index);
    this.moves++;
    this.Board.board[v.index] = Player.symbol;
    this.activePlayer = Player._id ? 0 : 1;
    this.getTurn();
    this.Board.update();

    if (this.hasWon(Player)) {
      this.gameOver(Player);
      return true;
    }

    if (this.moves >= 9) this.gameOver(null);

    return true;
  };

  this.gameOver = function (Player) {
    if (!Player) {
      $("td.X, td.O", this.element).addClass("animated swing");
      $("#restart").removeClass("hidden");
      $("#status").text("It's a Draw!").addClass("show");
      return true;
    }

    var elements = "";
    for (var i = 0; i < this._winPiece.length; i++) {
      var p = this._winPiece[i];
      if (p < 3) {
        elements += "tr:eq(0) td:eq(" + p + "),";
      } else if (p < 6) {
        elements += "tr:eq(1) td:eq(" + (p - 3) + "),";
      } else {
        elements += "tr:eq(2) td:eq(" + (p - 6) + "),";
      }
    }

    elements = elements.substring(0, elements.length - 1);

    var x = $(elements).addClass("animated rubberBand");

    $("#status")
      .text("Player " + Player.symbol + " Wins!")
      .addClass("show");
    $("#restart").removeClass("hidden");
    this.over = true;
  };

  this.hasWon = function (Player) {
    var won = false;
    var wins = Player.moves.join(" ");
    var self = this;

    this.Board.wins.forEach(function (n) {
      if (wins.includes(n[0]) && wins.includes(n[1]) && wins.includes(n[2])) {
        won = true;
        self._winPiece = n;
        return true;
      }
    });

    return won;
  };

  this.start();
};

var Player = function (id, computer) {
  this._id = id;
  this.symbol = id == 0 ? "X" : "O";
  this.computer = computer ? computer : false;
  this.moves = [];
};

var Board = function () {
  // empty board (3x3)
  this.board = ["_", "_", "_", "_", "_", "_", "_", "_", "_"];

  this.wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  this.update = function () {
    var board = this.board;
    $("#game tr").each(function (x, el) {
      $("td", el).each(function (i, td) {
        var pos = Number(i);
        if (x == 1) pos = pos + 3;
        if (x == 2) pos = pos + 6;
        var txt = board[pos] == "_" ? "" : board[pos];
        $(this).html(txt).addClass(txt);
      });
    });
  };
};
