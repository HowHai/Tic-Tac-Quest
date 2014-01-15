app.controller("MainController", function($scope){
  var playerOneMoves = [];
  var playerTwoMoves = [];
  var gameBoard = [];
  $scope.rowOne = [0,1,2];
  $scope.rowTwo = [3,4,5];
  $scope.rowThree = [6,7,8];

  var winCondition = [
                          [0,1,2], [3,4,5], [6,7,8],
                          [0,3,6], [1,4,7], [2,5,8],
                          [0,4,8], [2,4,6]
                        ];

  $scope.selectedDiv = function(selected){
    var getDiv = $("#" + selected);
    var occupiedTerritory = isNaN(getDiv.html());
    var XorO = gameBoard.length % 2 == 0 ? "X" : "O";

    if (XorO == 'X' && !occupiedTerritory)
    {
      playerOneMoves.push(selected);
      gameBoard.push(selected);
      getDiv.html(XorO);
    }
    else if (!occupiedTerritory)
    {
      playerTwoMoves.push(selected);
      gameBoard.push(selected);
      getDiv.html(XorO);
    }

    console.log(playerOneMoves);
    console.log(occupiedTerritory);
    winCheck(winCondition, playerOneMoves);
  }

  function winCheck(winCondition, playerMoves) {
    for (var i = 0; i < winCondition.length; i++){
      var winComb = winCondition[i].filter(function(value){
        return playerMoves.indexOf(value) != -1;
      })
      if (winComb.length == 3)
        alert("You won!");
    }
  }

});
