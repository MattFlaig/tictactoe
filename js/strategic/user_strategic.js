//USER PLAYER OBJECT (STRATEGIC MODE)
var user = {
  choices : [],
  results : [],
  colour : "black",
  possibleChoices : [],

  clearPossibleChoices : function(chosen){
    user.possibleChoices = user.makeUnique(user.possibleChoices);
    for(var i=0; i<chosen.length;++i){
      var choice = chosen[i];
      for (var j=0;j<user.possibleChoices.length;++j){
        var possible = user.possibleChoices[j];
        if(possible == choice){
          user.possibleChoices.splice(j,1);
        }
      }
    }
  },
  prepareChoices : function(){
    user.possibleChoices = computer.makeUnique(computer.possibleChoices);
    user.findEgocentricChoices();
  },
  findEgocentricChoices : function(){
    for(var i=0;i<board.fields.length;++i){
    var firstPossible = board.fields[i];
      for(var j=0;j<board.fields.length;++j){
        var secondPossible = board.fields[j];
        if(secondPossible != firstPossible){
          user.manageChoices(firstPossible,secondPossible);
        }
      } 
    }
  },
  manageChoices : function(firstPossible,secondPossible){
    var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
    var adder = parseInt(user.getAdder());
    if(adder > 0 && possibleAddedFields == adder){
      user.possibleChoices.push(firstPossible, secondPossible);
      user.possibleChoices = user.makeUnique(user.possibleChoices);
    }
  },
  getAdder : function(){
    if (ticTacToe.round<=3){var adderIndex=0;}
    else {var adderIndex = Math.floor(ticTacToe.round/3);}
    var adder = ticTacToe.WINNING_SUM - parseInt(user.choices[adderIndex]);
    return adder;
  },
  makeUnique : function(array){
    var hash = {}, uniqueArray = [];
    for (var i = 0; i < array.length; ++i) {
      if (!hash.hasOwnProperty(array[i])) { 
          hash[ array[i] ] = true;
          uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  },
  getDoubledElements : function(array){
    var hash = {}, doubledArray = [];
    for (var i = 0; i < array.length; ++i) {
      if (hash.hasOwnProperty(array[i])) { 
          hash[ array[i] ] = true;
          doubledArray.push(array[i]);
      }
    }
    return doubledArray;
  },
  findDilemmaMoves : function(){
    user.prepareChoices();
    var possibleDilemmaMoves = user.chooseDilemma();
    var dilemmaMoves = user.getDoubledElements(possibleDilemmaMoves);
    var dilemmaIndex = Math.floor(Math.random() * (dilemmaMoves.length));
    var nextChoice = dilemmaMoves[dilemmaIndex];
    if (dilemmaMoves.length<=3){return nextChoice;}
    else {return undefined};
  },
  chooseDilemma : function(){
    var possibleDilemmaMoves = [];
    for(var i=0;i<user.possibleChoices.length;++i){
      var first = user.possibleChoices[i]; 
      for(var j=i+1;j<user.possibleChoices.length;++j){
      var second = user.possibleChoices[j];
      var firstPossible = parseInt(first) + parseInt(second) + parseInt(user.choices[0]);
      var secondPossible = parseInt(first) + parseInt(second) + parseInt(user.choices[1]);
        if(firstPossible == ticTacToe.WINNING_SUM || secondPossible == ticTacToe.WINNING_SUM){
          possibleDilemmaMoves.push(first, second);
        }
      }
    }
    return possibleDilemmaMoves;
  },
  searchForWin : function(){
    var noSuccess = "noSuccess";
    var nextChoice = user.getWinningMove(noSuccess);
    if(nextChoice){return nextChoice;}
    else{return noSuccess;}
  },
  getWinningMove : function(noSuccess){
    for(var i = 0;i < board.fields.length; ++i){
      var possibleWin = parseInt(board.fields[i]);
      if(ticTacToe.round == 5 || ticTacToe.round == 6){
        var nextChoice = user.winInNextRounds(possibleWin);
        if (nextChoice == possibleWin){break;}
      }
      else if(ticTacToe.round < 5){
        var addedChoices = parseInt(user.choices[0]) + parseInt(user.choices[1]);
        if(possibleWin + addedChoices == ticTacToe.WINNING_SUM){var nextChoice = possibleWin;break;}
        else{var nextChoice = noSuccess;}
      }
      else{
        var nextChoice = user.winInLastRounds(possibleWin);
        if (nextChoice == possibleWin){break;}
      }
    }
    return nextChoice;
  },
  winInNextRounds : function(possibleWin){
    for(var j = 0;j < user.results.length; ++j){
      var addedChoices = parseInt(user.results[j]); 
      if(possibleWin + addedChoices == ticTacToe.WINNING_SUM){
        var nextChoice = possibleWin;break;
      }
    }
    var stillNoSuccess = "noSuccess";
    if(nextChoice == possibleWin){return nextChoice;} 
    else {return stillNoSuccess;} 
  },
  winInLastRounds : function(possibleWin){
    for(var k = 0;k < user.choices.length; ++k){
      var firstChoice = user.choices[k];
      for(var l = k + 1;l < user.choices.length; ++l){
        var secondChoice = user.choices[l];
        var combined = parseInt(firstChoice) + parseInt(secondChoice);
        var combinedChoice = possibleWin + combined;
        if(combinedChoice === ticTacToe.WINNING_SUM){
          var nextChoice = possibleWin;break;
        }
      }
    }
    var stillNoSuccess = "noSuccess";
    if(nextChoice == possibleWin){return nextChoice;} 
    else {return stillNoSuccess;} 
  }
}