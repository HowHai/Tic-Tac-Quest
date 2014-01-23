app.controller("MainController", function($scope, $firebase){
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
  var botMode = false;
  var playerMode = false;

  $scope.gameArray = [[0,1,2],[3,4,5],[6,7,8]];

  var winCondition = [
                          [0,1,2], [3,4,5], [6,7,8],
                          [0,3,6], [1,4,7], [2,5,8],
                          [0,4,8], [2,4,6]
                     ];

  function displayStatus(status){
    $("#turn-box").html(status);
  };

  $scope.playerMode = function(){
    gameOver = false;
    playerMode = true;
    $("#message-box").hide();
    displayStatus("France's Turn");
  };

  $scope.botMode = function(){
    gameOver = false;
    botMode = true;
    $("#message-box").hide();
    displayStatus("France's Turn");
  };

  $scope.mainMenu = function(){
    gameOver = true;
    botMode = false;
    playerMode = false;
    $("#message-box").show();
    displayStatus("Main Menu");
    $scope.restartGame();
  };

  $scope.restartGame = function(){
    displayStatus("France's Turn");
    playerOneMoves = [];
    playerTwoMoves = [];
    botMoves = [];
    gameBoard = [];
    gameOver = false;

    // Replaces all Xs and Os with starting numbers
    // TODO: don't need a loop for this dude...
    var boardArray = [0,1,2,3,4,5,6,7,8];
    for (var i = 0; i < boardArray.length; i++){
      var getTerritory = $("#" + i);
      getTerritory.html(i);
    }
  };

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
    }
  };

  // Return true if area is taken
  function areaTaken(territory){
    var getTerritory = $("#" + territory).html();
    return isNaN(getTerritory);
  };

  $scope.selectedTerritory = function(selected){
    var getDiv = $("#" + selected);
    var areaTaken = isNaN(getDiv.html());
    var XorO = gameBoard.length % 2 == 0 ? "X" : "O";

    function playerAction(player, turn){
      player.push(selected);
      gameBoard.push(selected);
      getDiv.html("<span>" + XorO + "</span>");
      displayStatus(turn);
    };

    if (XorO == 'X' && !areaTaken && !gameOver)
    {
      playerAction(playerOneMoves, "Holland's Turn");
      if (botMode)
      {
        // TODO: Require another click to show victory when timer used
        setTimeout(function() { botAI(); }, 2000);
        displayStatus("Holland is thinking...");
      }
    }
    else if (!areaTaken && !gameOver && playerMode)
      playerAction(playerTwoMoves, "France's Turn");

    winCheck(winCondition, playerOneMoves, "France won!");
    winCheck(winCondition, playerTwoMoves, "Holland won!");
    winCheck(winCondition, botMoves, "Holland won!");
  };

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
  };

  // AI MADNESSSSSS BELOWWWWW!!!@#!@
  // GO BACK NOWWWW!!!
  // BEEP BEEP BEEP!!!
  // Calculate bot's move by using player, bot, and windCondition
  // TODO: Remove all winCondition... do not need.
  function botMoveChecker(winCondition, player, decision){
    for (var i = 0; i < winCondition.length; i++)
    {
      var winningComb = winCondition[i].filter(function(value){
        return player.indexOf(value) != -1;
      })

      var winningMove = winCondition[i].filter(function(value){
        return player.indexOf(value) == -1;
      })

      if (winningComb.length == 2 && !areaTaken(winningMove))
      {
        return fatalBlow = winningMove;
        break;
      }

      // Decision is true when player makes trap/odd moves
      if (decision && winningComb.length == 1)
      {
        var moveOne = Math.abs(botMoves.last() - winningMove[0]);
        var moveTwo = Math.abs(botMoves.last() - winningMove[1]);

        var moveToTake = moveOne > moveTwo ? winningMove[0] : winningMove[1];
        if (areaTaken(winningComb) && !areaTaken(winningMove[0]) && !areaTaken(winningMove[1]))
        {
          // Hacky solution to bot's only weakness
          fatalBlow = (areaTaken(1) && areaTaken(8) && gameBoard.length == 5) ? 6 : moveToTake;
          break;
        }
        else if (areaTaken(winningMove[0]) && areaTaken(winningMove[1]))
          fatalBlow = areaTaken(3) ? 1 : 3
      }
    }
  };

  function calculateBotMove(player, bot){
    // Make winning move if available
    botMoveChecker(winCondition, bot);

    // Bot reacts to player's move
    if (fatalBlow.length == 0)
      botMoveChecker(winCondition, player);
  };

  // AI MADNESS
  function botAI(){






    function pushData(data){
      $("#" + data).html("<span>O</span>");
      botMoves.push(data);
      gameBoard.push(data);
      displayStatus("France's Turn");
      fatalBlow = [];
    }

    var randMove = [0,2,6,8][Math.floor(Math.random() * [0,2,6,8].length)];

    // Take random corner if center is taken on first move
    if (gameBoard.length == 1)
      areaTaken(4) ? pushData(randMove) : pushData(4);
    else if (playerOneMoves.length < 5)
    {
      calculateBotMove(playerOneMoves, botMoves);
      if (fatalBlow.length == 1 && !isNaN(fatalBlow))
        pushData(fatalBlow[0]);
      else
      {
        botMoveChecker(winCondition, botMoves, true);
        pushData(fatalBlow);
      }
    }
  };
});
