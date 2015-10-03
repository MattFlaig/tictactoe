//COMPUTER PLAYER OBJECT (BALANCED MODE)
var computer = {
  choices : [],
  colour : "orange",
  possibleChoices : [],

  clearPossibleChoices : function(chosen){
    computer.possibleChoices = computer.makeUnique(computer.possibleChoices);
    for(var i=0; i<chosen.length;++i){
      var index = computer.possibleChoices.indexOf(chosen[i]);
      if(index >= 0){ computer.possibleChoices.splice(index,1); }
    }
  },
  makeUnique : function(array){
    var hash = {}, uniqueArray = [];
    for ( var i = 0; i < array.length; ++i ) {
      if ( !hash.hasOwnProperty(array[i]) ) {
          hash[ array[i] ] = true;
          uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  },
  balancedStrategy : function(){
    computer.prepareChoices();
    var nextChoice = computer.searchForWin();
    if (nextChoice == "noSuccess"){
      nextChoice = computer.findBestMove();
    }
    return nextChoice;
  },
  findBestMove : function(){
    var nextChoice = user.searchForWin();
    if (nextChoice == "noSuccess"){
      nextChoice = computer.findAlternativeChoices();
    }
    return nextChoice;
  },
  findAlternativeChoices : function(){
    if(computer.possibleChoices.length > 0){
      var nextChoice = computer.getNextChoice(computer.possibleChoices);
    }
    else{ nextChoice = computer.getNextChoice(board.fields); }
    return nextChoice;
  },
  getNextChoice : function(array){
    return computer.getRandomChoice(array);
  },
  getRandomChoice : function(array){
    var possibleIndex = Math.floor(Math.random() * (array.length));
    return array[possibleIndex];
  },
  prepareChoices : function(){
    computer.possibleChoices = computer.makeUnique(computer.possibleChoices);
    computer.findEgocentricChoices();
  },
  findEgocentricChoices : function(){
    for(var i=0;i<board.fields.length;++i){
      for(var j=0;j<board.fields.length;++j){
        var firstPossible = board.fields[i], secondPossible = board.fields[j];
        if(secondPossible !== firstPossible){
          computer.manageChoices(firstPossible,secondPossible);
        }
      }
    }
  },
  manageChoices : function(first, second){
    var adder = parseInt(computer.getAdder());
    if(adder > 0 && parseInt(first) + parseInt(second) === adder){
      computer.possibleChoices.push(first, second);
      computer.possibleChoices = computer.makeUnique(computer.possibleChoices);
    }
  },
  getAdder : function(){
    var ai;
    ticTacToe.round<=3 ? ai = 0 : ai = Math.floor(ticTacToe.round/3);
    return ticTacToe.WINNING_SUM - parseInt(computer.choices[ai]);
  },

  searchForWin : function(){
    var nextChoice = computer.getWinningMove();
    return nextChoice ? nextChoice : "noSuccess";
  },
  getWinningMove : function(){
    for(var i = 0;i < board.fields.length; ++i){
      var nextChoice = computer.winInNextRounds(board.fields[i]);
      if (nextChoice === board.fields[i]){ break; }
    }
    return nextChoice;
  },
  winInNextRounds : function(possibleWin){
    var winner = false;
    for(var k = 0;k < computer.choices.length; ++k){
      for(var l = k + 1;l < computer.choices.length; ++l){
        if((parseInt(parseInt(computer.choices[k])
          + parseInt(computer.choices[l]))
          + parseInt(possibleWin)) === ticTacToe.WINNING_SUM){ winner = true; break; }
      }
    }
    return winner ? possibleWin : "noSuccess";
  }

}