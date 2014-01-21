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

      console.log(lastMove);
      console.log(gameBoard);
      console.log(playerOneMoves);
    }
  };

  $scope.selectedTerritory = function(selected){
    var getDiv = $("#" + selected);
    var occupiedTerritory = isNaN(getDiv.html());
    var XorO = gameBoard.length % 2 == 0 ? "X" : "O";

    function playerAction(player, turn){
      player.push(selected);
      gameBoard.push(selected);
      getDiv.html("<span>" + XorO + "</span>");
      displayStatus(turn);
    };

    if (XorO == 'X' && !occupiedTerritory && !gameOver)
    {
      playerAction(playerOneMoves, "Holland's Turn");
      if (botMode)
      {
        displayStatus("Holland is thinking...");
        setTimeout(function() { botAI(); }, 2000);
      }
      // Remove this and uncomment 96-97 to resume player vs player
    }
    else if (!occupiedTerritory && !gameOver && playerMode)
      playerAction(playerTwoMoves, "France's Turn");

    winCheck(winCondition, playerOneMoves, "France won!");
    winCheck(winCondition, playerTwoMoves, "Holland won!");
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

  // Return true if territory is occupied
  function occupiedTerritory(territory){
    var getTerritory = $("#" + territory).html();
    return isNaN(getTerritory);
  };
  // AI MADNESSSSS
  // TODO: fix bot's third move when player
  // Calculate bot's move by using player, bot, and windCondition
  function botMoveChecker(winCondition, player, decision){
    for (var i = 0; i < winCondition.length; i++)
    {
      var winningComb = winCondition[i].filter(function(value){
        return player.indexOf(value) != -1;
      })

      var winningMove = winCondition[i].filter(function(value){
        return player.indexOf(value) == -1;
      })

      if (winningComb.length == 2 && !occupiedTerritory(winningMove))
      {
        return fatalBlow = winningMove;
        console.log("sad face");
        break;
      }

      if (decision && winningComb.length == 1)
      {
        var testV = Math.abs(botMoves.last() - winningMove[0]);
        console.log("testV: " + testV);
        var testV2 = Math.abs(botMoves.last() - winningMove[1]);
        console.log("testV2: " + testV2);
        console.log("winningMove: " + winningMove);
        console.log("WinningComb: " + winningComb);
        var bestMove = Math.max(testV, testV2);
        if (testV == testV2)
          bestMove = winningMove[1];
        if (bestMove == testV && occupiedTerritory(winningComb) && !occupiedTerritory(winningMove[1]))
        {
          if (!occupiedTerritory(winningMove[0]))
          {
            var bestMoveEver = winningMove[0];
            fatalBlow = bestMoveEver;
            console.log(winningMove[0]);
            break;
          }
        }
        else if (!occupiedTerritory(winningMove[1]) && occupiedTerritory(winningComb) && !occupiedTerritory(winningMove[0]))
        {
           var bestMoveEver = winningMove[1];
           fatalBlow = bestMoveEver;
           console.log(fatalBlow);
           console.log("This ran");
           break;
        }
        // console.log("This ran!");
      }
    }
  };

  function calculateBotMove(player, bot){
    // Make winning move if available
    botMoveChecker(winCondition, bot);

    if (fatalBlow.length == 0)
      botMoveChecker(winCondition, player);
  };

  // AI MADNESS
  function botAI(){
    // Get random number from [0,2,6,8]
    var secondMoveArray = [0,2,6,8];
    var randMove = secondMoveArray[Math.floor(Math.random() * secondMoveArray.length)];

    if (gameBoard.length == 1 && playerOneMoves[0] == 4)
    {
      $("#" + randMove).html("<span>O</span>");
      botMoves.push(randMove);
      gameBoard.push(randMove);
      $("#turn-box").html("Haiii");
      displayStatus("France's Turn");
    }
    else if (gameBoard.length == 1 && playerOneMoves[0] != 4)
    {
      $("#4").html("<span>O</span>");
      botMoves.push(4);
      gameBoard.push(4);
      displayStatus("France's Turn");
    }
    else if (gameBoard.length >= 3)
    {
      calculateBotMove(playerOneMoves, botMoves);
      if (fatalBlow.length == 1 && !isNaN(fatalBlow))
      {
        $("#" + fatalBlow[0]).html("<span>O</span>");
        botMoves.push(fatalBlow[0]);
        gameBoard.push(fatalBlow[0]);
        displayStatus("France's Turn");
        fatalBlow = [];
      }
      else
      {
        botMoveChecker(winCondition, botMoves, true);
        $("#" + fatalBlow).html("<span>O</span>");
        botMoves.push(fatalBlow);
        gameBoard.push(fatalBlow);
        displayStatus("france's Turn");
        // console.log("This is running!");
        // console.log(fatalBlow);
        fatalBlow = [];
      }
    }
    winCheck(winCondition, botMoves, "Holland won!");
  };
});
