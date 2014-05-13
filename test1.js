var possibleChoicesComputer = [];
var allChoices = [];
var alreadyChosen = "6";
var fieldsComputer = ["2","7","6","9","5","1","4","3","8"];
var winningNumbers = ["1","5","9","1","6","8","2","4","9","2","5","8","2","6","7","3","4","8","3","5","7","4","5","6"];

function allPossibleChoices() {
    remainingChoices(alreadyChosen);
    document.getElementById("test").innerHTML = winningNumbers;
}

function remainingChoices(alreadyChosen){
    for(var i=0;i<winningNumbers.length;++i){
        var choice = winningNumbers[i];

        if( choice == alreadyChosen){
          if (alreadyChosen != "4" && alreadyChosen != "6"){
            manageStandardCases(alreadyChosen);
          }
          else {
            manageEdgeCases(alreadyChosen);
          }
        }
    }
}

function manageStandardCases(){
  if (alreadyChosen <= "3"){
    winningNumbers.splice(i, 3);
    remainingChoices(alreadyChosen);
  }
  else if (alreadyChosen == 5){
    winningNumbers.splice(i-1, 3);
    remainingChoices(alreadyChosen);
  }
  else {
    winningNumbers.splice(i-2, 3);
    remainingChoices(alreadyChosen);
  }
}

function manageEdgeCases(){
  if (alreadyChosen == 4 && winningNumbers[i+1]>="8"){
    winningNumbers.splice(i-1, 3);
  }
  else if (alreadyChosen == 4 && winningNumbers[i+1]=="5"){
    winningNumbers.splice(i, 3);
  }
  else if(alreadyChosen == 6 && winningNumbers[i+1]>="7"){
    winningNumbers.splice(i-1, 3);
  }
  else {
    winningNumbers.splice(i-2, 3);
  }
}

//erste ziffer: 1, 2, 3
//zweite ziffer: 5,
//dritte ziffer: 7,8,9

//Ausnahmen:
//erste und zweite: 4
//zweite und dritte: 6