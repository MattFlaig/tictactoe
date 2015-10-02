var start = {
	chaotic : function(){
	    location.href = "chaotic.html";
	},
	balanced : function(){
	    location.href = "balanced.html";
	},
	strategic : function(){
	    location.href = "strategic.html";
	}
}

$(document).ready(function(){
  $('#chaotic').on('click', function(){
    start.chaotic();
  });

  $('#balanced').on('click', function(){
    start.balanced();
  });

  $('#strategic').on('click', function(){
    start.strategic();
  });

});




