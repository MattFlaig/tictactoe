//TICTACTOE GAME OBJECT
var ticTacToe = {
  round : 0,
  ending : false,
  turn : " ",
  WINNING_SUM : 15,
  styles :  {
    "chaotic" : "maroon",
    "balanced" : "orange",
    "strategic" : "teal"
  },

  setPlayingStyle : function(oldStyle, newStyle){
    computer.playingStyle = newStyle;
    $('#playingStyle').text("Computer playing style: " + newStyle);
    board.setColour(ticTacToe.styles[newStyle]);
    board.resetButtons(oldStyle, newStyle);
    ticTacToe.setDefaultValues(oldStyle);
  },
  setDefaultValues : function(oldStyle){
    ticTacToe.backToDefault();
    ticTacToe.emptyChoices();
    ticTacToe.hideMessage(oldStyle);
    ticTacToe.enableButtons();
    board.resetFields();
  },
  backToDefault : function(){
    ticTacToe.round = 0;
    ticTacToe.ending = false;
    ticTacToe.turn = " ";
  },
  emptyChoices : function(){
    computer.choices = [];
    user.choices = [];
    computer.possibleChoices = [];
    user.possibleChoices = [];
  },
  hideMessage : function(oldStyle){
    $('#message').text('');
    $('#message').removeClass(ticTacToe.styles[oldStyle] + '-message');
    $('#message').css('display', 'none');
  },
  enableButtons : function(){
    $('.btn').removeClass('disabled');
    $('.btn').removeAttr('disabled');
  },
  whoBegins : function(nextPlayer){
    if(ticTacToe.round === 0){
      ticTacToe.disableButtons();
      ticTacToe.prepareFirstMove(nextPlayer);
    }
  },
  disableButtons : function(){
    $(".begin").addClass('disabled').prop('disabled',true);
  },
  prepareFirstMove : function(player){
    ticTacToe.turn = player;
    board.prepare();
    if(player === 'computer') {
      setTimeout(function(){ ticTacToe.computerTurn(); }, 1000);
    }
  },
  userTurn : function(field){
    var fieldNumber = field[5];
    board.loadImage(field, user.colour);
    ticTacToe.pushValue(fieldNumber);
    if(ticTacToe.round>=4){ ticTacToe.computeResult(user.choices); }
    ticTacToe.endOfRound(fieldNumber);
  },
  computerTurn : function(){
    var fieldNumber = ticTacToe.determineFieldNumber();
    board.loadImage("field" + fieldNumber, computer.colour);
    ticTacToe.pushValue(fieldNumber);
    if(ticTacToe.round>=4){ ticTacToe.computeResult(computer.choices); }
    ticTacToe.endOfRound(fieldNumber);
  },
  determineFieldNumber : function(){
    if(computer.playingStyle === 'chaotic') {
      var fieldNumber = ticTacToe.getChaoticField();
    }
    else if(computer.playingStyle === 'balanced') {
      var fieldNumber = ticTacToe.getBalancedField();
    }
    else{
      var fieldNumber = ticTacToe.getStrategicField();
    }
    return fieldNumber;
  },
  getChaoticField : function(){
    return ticTacToe.computeRandomField();
  },
  getBalancedField : function(){
    if(ticTacToe.round <= 1){ var fieldNumber = computer.getRandomChoice(board.fields); }
    else{ var fieldNumber = computer.balancedStrategy(); }
    return fieldNumber;
  },
  getStrategicField : function(){
    if(ticTacToe.round <= 1){var fieldNumber = computer.findFirstMove();}
    else if(ticTacToe.round == 2 || ticTacToe.round == 3){var fieldNumber = computer.findSecondMove();}
    else {var fieldNumber = computer.findStrategicMove();}
    return fieldNumber;
  },
  computeRandomField : function(){
    var fields = board.fields;
    var choiceIndex = Math.floor(Math.random() * (fields.length));
    var fieldNumber = fields[choiceIndex];
    return fieldNumber;
  },
  endOfRound : function(fieldNumber){
    ticTacToe.manageDeletion(fieldNumber);
    ticTacToe.round += 1;
    ticTacToe.managePlayerTurn();
  },
  manageDeletion : function(fieldNumber){
    if(computer.playingStyle !== 'chaotic'){
      if(ticTacToe.turn === 'user'){ computer.clearPossibleChoices(user.choices); }
      else{ computer.clearPossibleChoices(computer.choices); }
    }
    board.deleteFields(fieldNumber);
  },
  managePlayerTurn : function(){
    if (ticTacToe.turn === 'computer'){
      ticTacToe.setUserTurn();
    }
    else {
      ticTacToe.setUserTurn();
      if(!ticTacToe.ending){ ticTacToe.setComputerTurn(); }
      else{ ticTacToe.manageEnding(); }
    }
  },
  setComputerTurn : function(){
    ticTacToe.turn = 'computer';
    board.disable();
    setTimeout(function(){ ticTacToe.computerTurn(); }, 1000);
  },
  setUserTurn : function(){
    ticTacToe.turn = 'user';
    board.prepare();
    if(ticTacToe.ending){
      ticTacToe.manageEnding();
    }
  },
  manageEnding: function(){
    board.setDefaultCursor();
    board.disable();
  },
  pushValue : function(fieldNumber){
    if(ticTacToe.turn === 'user'){ user.choices.push(fieldNumber); }
    else{ computer.choices.push(fieldNumber); }
  },
  computeResult : function(playerChoices){
    if(ticTacToe.round === 4 || ticTacToe.round === 5){
      ticTacToe.computeFirstResult(playerChoices);
    }
    else {
      ticTacToe.computeNextResult(playerChoices);
    }
  },
  computeFirstResult : function(playerChoices){
    var result = 0;
    for(var i in playerChoices) { result += parseInt(playerChoices[i]); }
    if(result === ticTacToe.WINNING_SUM) { ticTacToe.winner(); }
  },
  computeNextResult : function(playerChoices){
    for(var i=0;i<playerChoices.length-1;++i){
      var winner = ticTacToe.manageNextResult(i, playerChoices);
      if (winner){ ticTacToe.winner(); break; }
    }
    ticTacToe.checkForTie();
  },
  manageNextResult : function(i, playerChoices){
    var winner = false;
    for(var j = i+1;j<playerChoices.length-1;++j){
      var firstChoice = playerChoices[i], secondChoice = playerChoices[j];
      var combinedWithLast = parseInt(firstChoice) + parseInt(secondChoice)
                           + parseInt(playerChoices[playerChoices.length - 1]);
      if (combinedWithLast === ticTacToe.WINNING_SUM){ winner = true; }
    }
    return winner;
  },
  checkForTie : function(){
    if(!ticTacToe.ending && ticTacToe.round === 8){
      ticTacToe.ending = true;
      $('#message').addClass(ticTacToe.styles[computer.playingStyle] +'-message');
      ticTacToe.scrollToNav();
      $('#message').html("No Winner!");
      $('#message').fadeIn(2000);
    }
  },
  winner : function(){
    ticTacToe.ending = true;
    $('#message').addClass(ticTacToe.styles[computer.playingStyle] +'-message');
    ticTacToe.scrollToNav();
    $('#message').html("The " + ticTacToe.turn + " wins!")
    $('#message').fadeIn(2000);

  },
  scrollToBoard : function(){
    $("html, body").animate({ scrollTop: $('#board').offset().top }, 'slow');
  },
  scrollToNav : function(){
    $('html, body').animate({scrollTop:0}, 'slow');
  },
  restart : function(){
    ticTacToe.setDefaultValues(computer.playingStyle);
  }

}

$(document).ready(function(){
  $('#userBegins').on('click', function(){
    ticTacToe.whoBegins('user');
    ticTacToe.scrollToBoard();
  });

  $('#computerBegins').on('click', function(){
    ticTacToe.whoBegins('computer');
    ticTacToe.scrollToBoard();
  });

  $('#restart').on('click', function(){
    ticTacToe.restart();
  });

  $('#board').on('click', '.fields', function(e){
    var id = e.target.id;
    ticTacToe.userTurn(id);
  });

  $('#setPlayingStyle li a').on('click', function(){
    var oldStyle = computer.playingStyle;
    var newStyle = $(this).attr('id');
    ticTacToe.setPlayingStyle(oldStyle, newStyle);
  });
});