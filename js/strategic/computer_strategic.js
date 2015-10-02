//COMPUTER PLAYER OBJECT (STRATEGIC MODE)
var computer = {
  choices : [],
  results : [],
  colour : "teal",
  possibleChoices : [],

  clearPossibleChoices : function(chosen){
    computer.possibleChoices = computer.makeUnique(computer.possibleChoices);
    for(var i=0; i<chosen.length;++i){
      var choice = chosen[i];
      for (var j=0;j<computer.possibleChoices.length;++j){
        var possible = computer.possibleChoices[j];
        if(possible == choice){
          computer.possibleChoices.splice(j,1);
        }
      }
    }
  },
  makeUnique : function(array){
    var hash = {}, uniqueArray = [];
    for ( var i = 0; i < array.length; ++i ) {
      if (!hash.hasOwnProperty(array[i])) {
          hash[ array[i] ] = true;
          uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  },
  getDoubledElements : function(array){
    var hash = {}, doubledArray = [];
    for ( var i = 0; i < array.length; ++i ) {
      if (hash.hasOwnProperty(array[i])) {
          hash[ array[i] ] = true;
          doubledArray.push(array[i]);
      }
    }
    return doubledArray;
  },
  findFirstMove : function(){
    if(user.choices.length > 0){
      if(user.choices[0] == "5"){var firstMove = computer.findPossibleEdgeField();}
      else{var firstMove = "5";}
    }
    else{var firstMove = "5";}
    return firstMove;
  },
  findSecondMove : function(){
    var secondMove = user.searchForWin();
    if(secondMove == "noSuccess"){
      secondMove = computer.findNonReactiveMove();
    }
    return secondMove;
  },
  findNonReactiveMove : function(){
    if(computer.choices[0] == 5 && user.choices[0] % 2 == 0 && user.choices[1] % 2 == 0){
      var secondMove = computer.findPossibleOddField();
    }
    else if (computer.choices[0] == 5 && user.choices[0] % 2 == 0){
      var secondMove = (ticTacToe.WINNING_SUM - 5) - parseInt(user.choices[0]);
    }
    else{
      var secondMove = user.findDilemmaMoves();
      if (typeof secondMove == "undefined"){
        secondMove = computer.consultChoiceTree();
      }
    }
    return secondMove;
  },
  consultChoiceTree : function(){
    if(user.choices[0] % 2 != 0 && user.choices[1] % 2 != 0){
      if (user.choices[0] != 5){var secondMove = computer.findPossibleEdgeField();}
      else {var secondMove = computer.findPossibleOddField();}
    }
    else{
      if(parseInt(user.choices[0])+parseInt(user.choices[1]) % 2 != 0){
        var secondMove = computer.findPossibleEdgeField();}
      else {var secondMove = computer.findPossibleOddField();} 
    }
    return secondMove;
  },
  findPossibleOddField : function(){
    var fieldOkay = false;
    while (!fieldOkay){
      var possibleIndex = Math.floor(Math.random() * board.fields.length);
      var possibleField = board.fields[possibleIndex];
      if (possibleField % 2 != 0){fieldOkay = true; return possibleField};
    }
  },
  findPossibleEdgeField : function(){
    var fieldOkay = false;
    while (!fieldOkay){
      var possibleIndex = Math.floor(Math.random() * board.fields.length);
      var possibleField = board.fields[possibleIndex];
      if (possibleField % 2 == 0){fieldOkay = true; return possibleField};
    }
  },
  findStrategicMove : function(){
    computer.prepareChoices();
    var nextChoice = computer.searchForWin();
    if (nextChoice == "noSuccess"){
      nextChoice = user.searchForWin();
      if (nextChoice == "noSuccess"){
        nextChoice = computer.findDilemmaMoves();
        if (typeof nextChoice == "undefined"){
          nextChoice = user.findDilemmaMoves();
          if (typeof nextChoice == "undefined"){
            nextChoice = computer.findAlternativeChoices();
          }
        }
      }
    }
    return nextChoice;
  },
  findDilemmaMoves : function(){
    var possibleDilemmaMoves = computer.chooseDilemma();
    var dilemmaMoves = computer.getDoubledElements(possibleDilemmaMoves);
    var dilemmaIndex = Math.floor(Math.random() * (dilemmaMoves.length));
    var nextChoice = dilemmaMoves[dilemmaIndex];
    if (dilemmaMoves.length<=3){return nextChoice;}//check if this is necessary
    else {return undefined};
  },
  chooseDilemma : function(){
    var possibleDilemmaMoves = [];
    for(var i=0;i<computer.possibleChoices.length;++i){
      var first = computer.possibleChoices[i]; 
      for(var j=i+1;j<computer.possibleChoices.length;++j){
      var second = computer.possibleChoices[j];
      var firstPossible = parseInt(first) + parseInt(second) + parseInt(computer.choices[0]);
      var secondPossible = parseInt(first) + parseInt(second) + parseInt(computer.choices[1]);
        if(firstPossible == ticTacToe.WINNING_SUM || secondPossible == ticTacToe.WINNING_SUM){
          possibleDilemmaMoves.push(first, second);
        }
      }
    }
    return possibleDilemmaMoves;
  },
  findAlternativeChoices : function(){
    if(computer.possibleChoices.length > 0){ 
      var nextChoice = computer.getNextChoice(computer.possibleChoices);
      if(nextChoice == "stillNoAlternative"){nextChoice = computer.getNextChoice(board.fields);}
    }
    else{nextChoice = computer.getNextChoice(board.fields);}
    return nextChoice;
  },
  getNextChoice : function(array){
    var nextChoice = computer.getRandomChoice(array);
    if(parseInt(nextChoice) > 0){
      return nextChoice;
    }
    else{
      var stillNoAlternative = "stillNoAlternative";
      return stillNoAlternative;
    }
  },
  getRandomChoice : function(array){
    var possibleIndex = Math.floor(Math.random() * (array.length));
    var nextChoice = array[possibleIndex];
    return nextChoice;
  },
  prepareChoices : function(){
    computer.possibleChoices = computer.makeUnique(computer.possibleChoices);
    computer.findEgocentricChoices();
  },
  findEgocentricChoices : function(){
    for(var i=0;i<board.fields.length;++i){
    var firstPossible = board.fields[i];
      for(var j=0;j<board.fields.length;++j){
        var secondPossible = board.fields[j];
        if(secondPossible != firstPossible){
          computer.manageChoices(firstPossible,secondPossible);
        }
      } 
    }
  },
  manageChoices : function(firstPossible,secondPossible){
    var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
    var adder = parseInt(computer.getAdder());
    if(adder > 0 && possibleAddedFields == adder){
      computer.possibleChoices.push(firstPossible, secondPossible);
      computer.possibleChoices = computer.makeUnique(computer.possibleChoices);
    }
  },
  getAdder : function(){
    if (ticTacToe.round<=3){var adderIndex=0;}
    else {var adderIndex = Math.floor(ticTacToe.round/3);}
    var adder = ticTacToe.WINNING_SUM - parseInt(computer.choices[adderIndex]);
    return adder;
  },
  searchForWin : function(){
    var noSuccess = "noSuccess";
    var nextChoice = computer.getWinningMove(noSuccess);
    if(nextChoice){return nextChoice;}
    else{return noSuccess;}
  },
  getWinningMove : function(noSuccess){
    for(var i = 0;i < board.fields.length; ++i){
      var possibleWin = parseInt(board.fields[i]);
      if(ticTacToe.round == 5 || ticTacToe.round == 6){
        var nextChoice = computer.winInNextRounds(possibleWin);
        if (nextChoice == possibleWin){break;}
      }
      else if(ticTacToe.round < 5){
        var addedChoices = parseInt(computer.choices[0]) + parseInt(computer.choices[1]);
        if(possibleWin + addedChoices == ticTacToe.WINNING_SUM){var nextChoice = possibleWin;break;}
        else{var nextChoice = noSuccess;}
      }
      else{
        var nextChoice = computer.winInLastRounds(possibleWin);
        if (nextChoice == possibleWin){break;}
      }
    }
    return nextChoice;
  },
  winInNextRounds : function(possibleWin){
    for(var j = 0;j < computer.results.length; ++j){
      var addedChoices = parseInt(computer.results[j]); 
      if(possibleWin + addedChoices == ticTacToe.WINNING_SUM){
        var nextChoice = possibleWin;break;
      }
    }
    var stillNoSuccess = "noSuccess";
    if(nextChoice == possibleWin){return nextChoice;} 
    else {return stillNoSuccess;} 
  },
  winInLastRounds : function(possibleWin){
    for(var k = 0;k < computer.choices.length; ++k){
      var firstChoice = computer.choices[k];
      for(var l = k + 1;l < computer.choices.length; ++l){
        var secondChoice = computer.choices[l];
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

// Last Move:

// firstResult, nextResult, lastResult(chaotic)
// winInNextRounds, winInLastRounds
// loop over choices for findDilemmaMoves
// checkForTie in round 8 (chaotic)