var possibleChoicesComputer = [];
var allChoices = [];
var alreadyChosen = ["2"];
var fieldsComputer = ["2","7","6","9","5","1","4","3","8"];
var choiceIndex = [];


function allPossibleChoices() {
    
    for (var i=0; i<fieldsComputer.length;++i){
    var firstField = parseInt(fieldsComputer[i]);
      for (var j=0; j<fieldsComputer.length;++j){
      var secondField = parseInt(fieldsComputer[j]);
        for (var k=0; k<fieldsComputer.length;++k){
        var thirdField = parseInt(fieldsComputer[k]);

        computeChoices(firstField, secondField, thirdField);
        }
      } 
    }
    possibleChoicesComputer = makeUnique(allChoices);
    remainingChoices(alreadyChosen);
    document.getElementById("test").innerHTML = possibleChoicesComputer;
}

function computeChoices(firstField, secondField, thirdField){
    var addedFields = firstField + secondField + thirdField;
    if(addedFields == 15){ 
      var sortedFields = [firstField, secondField, thirdField].sort();
      if(sortedFields[0] != sortedFields[1] && sortedFields[1] != sortedFields[2]){
        allChoices.push(sortedFields);
      }
    }
}

function makeUnique(allChoices) {
    var hash = {}, possibleChoicesComputer = [];
    for ( var i = 0; i < allChoices.length; ++i ) {
        if ( !hash.hasOwnProperty(allChoices[i]) ) { 
            hash[ allChoices[i] ] = true;
            possibleChoicesComputer.push(allChoices[i]);
        }
    }
    return possibleChoicesComputer;
}

function remainingChoices(alreadyChosen){
    for(i=0;i<possibleChoicesComputer.length;++i){
      for(j=0;j<possibleChoicesComputer[i].length;++j){
        var soleChoice = possibleChoicesComputer[i][j];

        if( soleChoice == alreadyChosen){
          choiceIndex.push(i);
          alert(choiceIndex);
        }
      }
    }
    possibleChoicesComputer.splice(possibleChoicesComputer[choiceIndex], choiceIndex.length);
}