//TICTACTOE GAME OBJECT (STRATEGIC MODE)
var ticTacToe = {
  round : 0,
  ending : false,
  turn : " ",
  WINNING_SUM : 15,

  whoBegins : function(nextPlayer){
    if(ticTacToe.round === 0){
      ticTacToe.disableButtons();
      if (nextPlayer === "computer") {
        ticTacToe.turn = "computer";
        board.prepare();
        setTimeout(function(){ticTacToe.computerTurn()}, 1000);
      }
      else{
        ticTacToe.turn = "user";
        board.prepare();
      }
    }
  },
  disableButtons : function(){
    $(".btn-group .begin").addClass('disabled').prop('disabled',true);
  },
  userTurn : function(field){
    var fieldNumber = field[5];
    board.loadImage(field, user.colour);
    ticTacToe.pushValue(fieldNumber);
    if(ticTacToe.round >= 4){ticTacToe.computeResult(user.choices, user.results);}
    ticTacToe.manageDeletion(fieldNumber);
    ticTacToe.round += 1;
    ticTacToe.managePlayerTurn();
  },
  computerTurn : function(){
    if(ticTacToe.round <= 1){var fieldNumber = computer.findFirstMove();}
    else if(ticTacToe.round == 2 || ticTacToe.round == 3){var fieldNumber = computer.findSecondMove();}
    else {var fieldNumber = computer.findStrategicMove();}
    var field = 'field' + fieldNumber;
    board.loadImage(field, computer.colour);
    ticTacToe.pushValue(fieldNumber);
    if(ticTacToe.round >= 4){ticTacToe.computeResult(computer.choices, computer.results);}
    ticTacToe.manageDeletion(fieldNumber);
    ticTacToe.round += 1;
    ticTacToe.managePlayerTurn();
  },
  manageDeletion : function(fieldNumber){
    if(ticTacToe.turn === 'user'){var playerChoices = user.choices;}
    else{var playerChoices = computer.choices;}
    computer.clearPossibleChoices(playerChoices);
    user.clearPossibleChoices(playerChoices);
    board.deleteFields(fieldNumber);
  },
  managePlayerTurn : function(){
    if (ticTacToe.turn === 'user'){
      if(!ticTacToe.ending){
        ticTacToe.turn = 'computer';
        board.disable();
        setTimeout(function(){ticTacToe.computerTurn()}, 1000);
      }
      else{
        board.setDefaultCursor();
        board.disable();
      }
    }
    else {
      ticTacToe.turn = 'user';
      board.prepare();
      if(ticTacToe.ending){
        board.setDefaultCursor();
        board.disable();
      }
    }
  },
  pushValue : function(fieldNumber){
    if(ticTacToe.turn === 'user'){var playerChoices = user.choices;}
    else{var playerChoices = computer.choices;}
    playerChoices.push(fieldNumber);
  },
  computeResult : function(playerChoices, playerResults){
    if(ticTacToe.round === 4 || ticTacToe.round === 5){
      var result = 0;
      for(var i in playerChoices) { result += parseInt(playerChoices[i]); }
      if(result === ticTacToe.WINNING_SUM){ticTacToe.winner();}
      else{ ticTacToe.addFirstResults(playerChoices, playerResults);}
    }
    else if(ticTacToe.round === 6 || ticTacToe.round === 7){ 
      var nextResult = ticTacToe.computeNextResult(playerChoices, playerResults);
    }
    else {
      var endResult = ticTacToe.computeEndResult(playerChoices, playerResults);
    }
  },
  addFirstResults : function(playerChoices, playerResults){
    for(var i=0;i<playerChoices.length;++i){
      var first = playerChoices[i];
      for(var j=i+1;j<playerChoices.length;++j){
        var second = playerChoices[j];
        var addChoices = parseInt(first) + parseInt(second);
        playerResults.push(addChoices);
      }
    }
  },
  computeNextResult : function(playerChoices, playerResults){
    for(var i=0;i<playerResults.length;++i){
      var oldResult = playerResults[i];
      var newResult = parseInt(oldResult) + parseInt(playerChoices[3]);
      if (newResult === ticTacToe.WINNING_SUM){ticTacToe.winner(); break;}
    }
  },
  computeEndResult : function(playerChoices, playerResults){
    for(var i=0;i<playerChoices.length-1;++i){
      var firstChoice = playerChoices[i];
      for(var j = i+1;j<playerChoices.length-1;++j){
        var secondChoice = playerChoices[j];
        var combined = parseInt(firstChoice) + parseInt(secondChoice);
        var combinedWithLast = parseInt(playerChoices[4]) + parseInt(combined);
        if (combinedWithLast === ticTacToe.WINNING_SUM){ticTacToe.winner(); break;}
      }
    }  
    if(!ticTacToe.ending){
      ticTacToe.checkForTie();
    }
  },
  checkForTie : function(){
    ticTacToe.ending = true;
      document.getElementById("message").innerHTML ="<div class=" + "'alert alert-info'" +  "id='ending'></div>";
      document.getElementById("ending").innerHTML = "No Winner!" ;
  },
  winner : function(){
    ticTacToe.ending = true;
    if(ticTacToe.turn === 'user'){document.getElementById("message").innerHTML ="<div class=" + "'alert alert-success'" +
                                                                   "id='ending'></div>";}
    else{document.getElementById("message").innerHTML ="<div class=" + "'alert alert-error'" +
                                                       "id='ending'></div>";}
    document.getElementById("ending").innerHTML = "The " + ticTacToe.turn + " wins!";
  },
  backToMenu : function(){
    location.href = "index.html";
  },
  restart : function(){
    location.href = "strategic.html";
  } 
  
}