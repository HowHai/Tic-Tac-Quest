app.controller("MainController", function($scope){
  // define Array.last()
  Array.prototype.last = function(){
    return this[this.length -1];
  }

  var playerOneMoves = [];
  var playerTwoMoves = [];
  var gameBoard = [];
  var botMoves = [];
  var fatalBlow = [];
  var gameOver = true;
  $scope.statusBox = "Click start to play!";
  $scope.gameArray = [[0,1,2],[3,4,5],[6,7,8]];

  var winCondition = [
                          [0,1,2], [3,4,5], [6,7,8],
                          [0,3,6], [1,4,7], [2,5,8],
                          [0,4,8], [2,4,6]
                     ];

  function displayStatus(status){
    $scope.statusBox = status;
  }

  $scope.startGame = function(){
    gameOver = false;
    displayStatus("France's Turn");
  }

  $scope.restartGame = function(){
    displayStatus("France's Turn");
    playerOneMoves = [];
    playerTwoMoves = [];
    botMoves = [];
    gameBoard = [];
    gameOver = false;

    // Replaces all Xs and Os with starting numbers
    var boardArray = [0,1,2,3,4,5,6,7,8];
    for (var i = 0; i < boardArray.length; i++){
      var getTerritory = $("#" + i);
      getTerritory.html(i);
    }
  }

  $scope.undoMove = function(){
    var lastMove = [gameBoard.last()];

    if (!gameOver)
    {
      gameBoard = gameBoard.filter(function(value){
        return lastMove.indexOf(value) == -1;
      });

      playerOneMoves = playerOneMoves.filter(function(value){
        return lastMove.indexOf(value) == -1;
      })

      playerTwoMoves = playerTwoMoves.filter(function(value){
        return lastMove.indexOf(value) == -1;
      })

      // Replace last territory with number
      $("#" + lastMove[0]).html(lastMove[0]);

      if (gameBoard.length % 2 == 0)
        displayStatus("France's Turn");
      else if (gameBoard.length != 0)
        displayStatus("Holland's Turn");

      console.log(lastMove);
      console.log(gameBoard);
      console.log(playerOneMoves);
    }
  }

  $scope.selectedTerritory = function(selected){
    var getDiv = $("#" + selected);
    var occupiedTerritory = isNaN(getDiv.html());
    var XorO = gameBoard.length % 2 == 0 ? "X" : "O";

    function playerAction(player, turn){
      player.push(selected);
      gameBoard.push(selected);
      getDiv.html(XorO);
      displayStatus(turn);
    }

    if (XorO == 'X' && !occupiedTerritory && !gameOver)
    {
      playerAction(playerOneMoves, "Holland's Turn");
      botAI(); // Remove this and uncomment 96-97 to resume player vs player
    }
    // BOT MADNESS
    // else if (!occupiedTerritory && !gameOver)
    //   playerAction(playerTwoMoves, "France's Turn");

    winCheck(winCondition, playerOneMoves, "France won!");
    winCheck(winCondition, playerTwoMoves, "Holland won!");
  }

  function winCheck(winCondition, playerMoves, message) {
    for (var i = 0; i < winCondition.length; i++){
      var winComb = winCondition[i].filter(function(value){
        return playerMoves.indexOf(value) != -1;
      })

      if (winComb.length == 3)
        {
          displayStatus(message);
          gameOver = true;
          break;
        }
    }
    if (playerMoves.length == 5 && gameOver == false)
    {
      displayStatus("War is hell... stalemate!");
      gameOver = true;
    }
  }

  // Return true if territory is occupied
  function occupiedTerritory(territory){
    var getTerritory = $("#" + territory).html();
    return isNaN(getTerritory);
  }
  // AI MADNESSSSS
  // Calculate bot's move by using player, bot, and windCondition
  function calculateBotMove(player, bot){
    for (var i = 0; i < winCondition.length; i++)
    {
      var botWinningComb = bot.filter(function(value){
        return winCondition[i].indexOf(value) != -1;
      })

      var winningMove = winCondition[i].filter(function(value){
        return bot.indexOf(value) == -1;
      })

      if (botWinningComb.length == 2 && !occupiedTerritory(winningMove[0]))
      {
        fatalBlow = winningMove;
        console.log("winning moveee");
        break;
      }
    }

    if (fatalBlow.length == 0)
    {
      for (var i = 0; i < winCondition.length; i++)
      {
        // Check player's current moves for a 2/3 winning comb.
        var playerWinningComb = player.filter(function(value) {
          return winCondition[i].indexOf(value) != -1;
        })

        if (player.length >= 2)
        {
          var availableTerritory = winCondition[i].filter(function(value) {
            return player.indexOf(value) == -1;
          })

          if (availableTerritory.length > 1) { continue; }
        }
        // Reaction to bad/odd move
        if (player.length == 2 && playerWinningComb.length == 2 && occupiedTerritory(availableTerritory[0]))
        {
          fatalBlow = occupiedTerritory(0) ? [2] : [8];
          break;
        }

        if (playerWinningComb.length == 2 && !occupiedTerritory(availableTerritory[0]))
        {
          fatalBlow = availableTerritory;
          console.log(availableTerritory);
          break;
        }
      }
    }
  }


  // AI MADNESS
  function botAI(){
    // Get random number from [0,2,6,8]
    var secondMoveArray = [0,2,6,8];
    var randMove = secondMoveArray[Math.floor(Math.random() * secondMoveArray.length)];
    if (gameBoard.length == 1 && playerOneMoves[0] == 4)
    {
      $("#" + randMove).html("O");
      botMoves.push(randMove);
      gameBoard.push(randMove);
      displayStatus("France's Turn");
      console.log(botMoves);
    }
    else if (gameBoard.length == 1 && playerOneMoves[0] != 4)
    {
      $("#4").html("O");
      botMoves.push(4);
      gameBoard.push(4);
      displayStatus("France's Turn");
      console.log(botMoves);
    }

    if (gameBoard.length >= 3)
    {
      calculateBotMove(playerOneMoves, botMoves);
      if (fatalBlow.length == 1 && !isNaN(fatalBlow))
      {
        $("#" + fatalBlow[0]).html("O");
        botMoves.push(fatalBlow[0]);
        gameBoard.push(fatalBlow[0]);
        displayStatus("France's Turn");
        fatalBlow = [];
        console.log(botMoves);
      }
      else
        console.log("Blah");
    }
    winCheck(winCondition, botMoves, "Holland won!");
  }
});
