//USER PLAYER OBJECT
var user = {
  choices : [],
  colour : "black",
  possibleChoices : [],

  clearPossibleChoices : function(chosen){
    user.possibleChoices = user.makeUnique(user.possibleChoices);
    for(var i=0; i<chosen.length;++i){
      var index = user.possibleChoices.indexOf(chosen[i]);
      if(index >= 0){ user.possibleChoices.splice(index,1); }
    }
  },
  findEgocentricChoices : function(){
    for(var i=0;i<board.fields.length;++i){
      for(var j=0;j<board.fields.length;++j){
        var firstPossible = board.fields[i], secondPossible = board.fields[j];
        if(secondPossible != firstPossible){
          user.manageChoices(firstPossible,secondPossible);
        }
      }
    }
  },
  manageChoices : function(first, second){
    var adder = parseInt(user.getAdder());
    if(adder > 0 && parseInt(first) + parseInt(second) === adder){
      user.possibleChoices.push(first, second);
      user.possibleChoices = user.makeUnique(user.possibleChoices);
    }
  },
  getAdder : function(){
    var ai;
    ticTacToe.round<=3 ? ai = 0 : ai = Math.floor(ticTacToe.round/3);
    return ticTacToe.WINNING_SUM - parseInt(user.choices[ai]);
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
    var dilemmaMoves = user.getDoubledElements(user.chooseDilemma());
    var dilemmaIndex = Math.floor(Math.random() * (dilemmaMoves.length));
    return dilemmaMoves.length <= 3 ? dilemmaMoves[dilemmaIndex] : undefined;
  },
  prepareChoices : function(){
    user.possibleChoices = computer.makeUnique(computer.possibleChoices);
    user.findEgocentricChoices();
  },
  chooseDilemma : function(){
    var possibleDilemmaMoves = [];
    for(var i=0;i<user.possibleChoices.length;++i){
      for(var j=i+1;j<user.possibleChoices.length;++j){
        var first = user.possibleChoices[i], second = user.possibleChoices[j];
        user.checkDilemma(first, second).concat(possibleDilemmaMoves);
      }
    }
    return possibleDilemmaMoves;
  },
  checkDilemma : function(first, second){
    var alt1 = parseInt(first) + parseInt(second) + parseInt(user.choices[0]);
    var alt2 = parseInt(first) + parseInt(second) + parseInt(user.choices[1]);
    if(alt1 == ticTacToe.WINNING_SUM || alt2 == ticTacToe.WINNING_SUM){
      return [first, second];
    }
    else {
      return [];
    }
  },
  searchForWin : function(){
    var nextChoice = user.getWinningMove();
    return nextChoice ? nextChoice : "noSuccess";
  },
  getWinningMove : function(){
    for(var i = 0;i < board.fields.length; ++i){
      var nextChoice = user.winInNextRounds(board.fields[i]);
      if (nextChoice === board.fields[i]){ break; }
    }
    return nextChoice;
  },
  winInNextRounds : function(possibleWin){
    var winner = false;
    for(var k = 0;k < user.choices.length; ++k){
      for(var l = k + 1;l < user.choices.length; ++l){
        if((parseInt(parseInt(user.choices[k])
          + parseInt(user.choices[l]))
          + parseInt(possibleWin)) === ticTacToe.WINNING_SUM){ winner = true; break; }
      }
    }
    return winner ? possibleWin : "noSuccess";
  }
}