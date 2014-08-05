//BOARD OBJECT
var board = {
  fields : ["2","9","4","7","5","3","6","1","8"],
  
  prepare : function(){
    for(var i=0;i<board.fields.length;++i){
      var field = board.fields[i];
      var stringHandler = 'handler' + field, stringField = 'field' + field;
      if(ticTacToe.turn === 'computer'){
        document.getElementById(stringHandler).innerHTML = "<div id= " + "'" + stringField + "'" + "></div>";
      } 
      else{
        document.getElementById(stringHandler).innerHTML = "<div id= '" + stringField + "' onclick =\"ticTacToe.userTurn(" +
                                                           "'field" + field + "');\"></div>";
      }
    }
    board.setDefaultCursor();
    board.enablePointerCursor();
  },
  disable : function(){
    for(var i=0;i<9; ++i){
      var fieldString = 'field' + (i+1);
      document.getElementById(fieldString).onclick = "event.cancelBubble = true;";
    }
  },
  setDefaultCursor : function(){
    var allFields = ["2","9","4","7","5","3","6","1","8"];
    for(var i=0;i<allFields.length;++i){
      var singleField = allFields[i];
      var singleString = 'field' + singleField;
      document.getElementById(singleString).style.cursor="default";
    }
  },
  enablePointerCursor : function(){
    for(var i=0;i<board.fields.length;++i){
      var singleField = board.fields[i];
      var singleString = 'field' + singleField;
      document.getElementById(singleString).style.cursor="pointer";
    }
  },
  loadImage : function(field, colour){
    document.getElementById(field).style.background = colour;
  },
  deleteFields : function(fieldNumber){
    for(var i = 0; i<board.fields.length; ++i){
      var singleField = board.fields[i];
      if(fieldNumber == singleField){board.fields.splice(i,1);}
    }
  }
}