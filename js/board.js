//BOARD OBJECT
var board = {
  fields : ["2","9","4","7","5","3","6","1","8"],

  setColour : function(newColour){
    $('body').css('background-color', newColour);
    computer.colour = newColour;
  },
  resetButtons : function(oldStyle, newStyle){
    $('.btn').removeClass('btn-' + ticTacToe.styles[oldStyle]);
    $('.btn').addClass('btn-' + ticTacToe.styles[newStyle]);
  },
  resetFields : function(){
    board.fields = ["2","9","4","7","5","3","6","1","8"];
    $('td div').css('background-color', 'white');
    $('td div').addClass('fields');
  },
  prepare : function(){
    if(ticTacToe.turn === 'user'){
      board.enablePointerCursor();
    }
    else{
      board.setDefaultCursor();
    }
  },
  disable : function(){
    $('.fields').off('click');
  },
  setDefaultCursor : function(){
    $('td div').css('cursor', 'default');
  },
  enablePointerCursor : function(){
    $('.fields').css('cursor', 'pointer');
  },
  loadImage : function(field, colour){
    $('#' + field).css('background-color', colour);
  },
  deleteFields : function(fieldNumber){
    var index = board.fields.indexOf(fieldNumber + '');
    if (index >= 0){
      board.fields.splice(index,1);
      $('#field' + fieldNumber).removeClass('fields');
    }
  }
}