//COMPUTER PLAYER OBJECT (BALANCED MODE)
var computer = {
  choices : [],
  colour : "orange",
  playingStyle : "balanced",
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
      if(user.choices[0] === "5"){ var firstMove = computer.findPossibleEdgeField(); }
      else{ var firstMove = "5"; }
    }
    else{ var firstMove = "5"; }
    return firstMove;
  },
  findSecondMove : function(){
    var secondMove = user.searchForWin();
    if(secondMove === "noSuccess"){
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
    else {
      var secondMove = computer.managePossibleDilemma();
    }
    return secondMove;
  },
  managePossibleDilemma: function(){
    var secondMove = user.findDilemmaMoves();
    if (typeof secondMove === "undefined"){
      secondMove = computer.consultChoiceTree();
    }
    return secondMove;
  },
  consultChoiceTree : function(){
    if(user.choices[0] % 2 != 0 && user.choices[1] % 2 != 0){
      var secondMove = computer.chooseWhenNoEdgeField();
    }
    else{
      var secondMove = computer.chooseWhenEdgeField();
    }
    return secondMove;
  },
  chooseWhenNoEdgeField : function(){
    if (user.choices[0] != 5){
      var secondMove = computer.findPossibleEdgeField();
    }
    else {
      var secondMove = computer.findPossibleOddField();
    }
    return secondMove;
  },
  chooseWhenEdgeField : function(){
    if(parseInt(user.choices[0])+ parseInt(user.choices[1]) % 2 != 0){
      var secondMove = computer.findPossibleEdgeField();}
    else {
      var secondMove = computer.findPossibleOddField();
    }
    return secondMove;
  },
  findPossibleOddField : function(){
    var fieldOkay = false;
    while (!fieldOkay){
      var possibleIndex = Math.floor(Math.random() * board.fields.length);
      var possibleField = board.fields[possibleIndex];
      if (possibleField % 2 != 0){ fieldOkay = true; return possibleField };
    }
  },
  findPossibleEdgeField : function(){
    var fieldOkay = false;
    while (!fieldOkay){
      var possibleIndex = Math.floor(Math.random() * board.fields.length);
      var possibleField = board.fields[possibleIndex];
      if (possibleField % 2 == 0){ fieldOkay = true; return possibleField };
    }
  },
  findStrategicMove : function(){
    computer.prepareChoices();
    var nextChoice = computer.searchForWin();
    if (nextChoice === "noSuccess"){
      nextChoice = user.searchForWin();
      if (nextChoice === "noSuccess"){
        nextChoice = computer.findDilemmaMoves();
        if (typeof nextChoice === "undefined"){
          nextChoice = user.findDilemmaMoves();
          if (typeof nextChoice === "undefined"){
            nextChoice = computer.findAlternativeChoices();
          }
        }
      }
    }
    return nextChoice;
  },
  balancedStrategy : function(){
    computer.prepareChoices();
    var nextChoice = computer.searchForWin();
    if (nextChoice === "noSuccess"){
      nextChoice = user.searchForWin();
      if (nextChoice === "noSuccess"){
        nextChoice = computer.findAlternativeChoices();
      }
    }
    return nextChoice;
  },
  findDilemmaMoves : function(){
    computer.prepareChoices();
    var dilemmaMoves = computer.getDoubledElements(computer.chooseDilemma());
    var dilemmaIndex = Math.floor(Math.random() * (dilemmaMoves.length));
    return dilemmaMoves.length <= 3 ? dilemmaMoves[dilemmaIndex] : undefined;
  },
  prepareChoices : function(){
    computer.possibleChoices = computer.makeUnique(computer.possibleChoices);
    computer.findEgocentricChoices();
  },
  chooseDilemma : function(){
    var possibleDilemmaMoves = [];
    for(var i=0;i<computer.possibleChoices.length;++i){
      for(var j=i+1;j<computer.possibleChoices.length;++j){
        var first = computer.possibleChoices[i], second = computer.possibleChoices[j];
        computer.checkDilemma(first, second).concat(possibleDilemmaMoves);
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