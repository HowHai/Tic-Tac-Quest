app.controller("MainController", function($scope){
  var playerOneMoves = [];
  var playerTwoMoves = [];
  var gameBoard = [];
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
    gameBoard = [];
    gameOver = false;

    // Replaces all Xs and Os with starting numbers
    var boardArray = [0,1,2,3,4,5,6,7,8];
    for (var i = 0; i < boardArray.length; i++){
      var getTerritory = $("#" + i);
      getTerritory.html(i);
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
      playerAction(playerOneMoves, "Holland's Turn");
    else if (!occupiedTerritory && !gameOver)
      playerAction(playerTwoMoves, "France's Turn");

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
      displayStatus("War is hell... stalemate!");
  }
});
