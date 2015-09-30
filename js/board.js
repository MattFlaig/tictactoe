//BOARD OBJECT
var board = {
  fields : ["2","9","4","7","5","3","6","1","8"],

  prepare : function(){
    if(ticTacToe.turn === 'user'){
      $('.fields').on('click', function(e){
        var id = e.target.id;
        ticTacToe.userTurn(id);
      });
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
    var index = board.fields.indexOf(fieldNumber);
    if (index !== undefined){
      board.fields.splice(index,1);
      $('#field' + fieldNumber).removeClass('fields');
    }
  }
}