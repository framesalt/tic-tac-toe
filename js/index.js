$(document).ready(function(){
  
  var firstPlayer = 'X';
  var secondPlayer = 'O';
  
  var computer = secondPlayer;
  var aiEnabled = false;
  
  var onTurn = firstPlayer;
  
  var board = [[0,0,0], [0,0,0], [0,0,0]];
  
  
  var sizeOfColumn = 3;

  var moveCount = 0;
  
  var win = "win";
  var draw = "draw";
  var nothing = "nothing";
  var prevent = "prevent";
  
  var doubleChecker = new doubleChancesChecker();
  var isFirstMove = true;
  
  var working = false;
  
  var checkPanel = {
	  
	  bestFirstMove: true,
	  winFeature: true,
	  preventLossFeature: true,
	  makeChanceFeature: true,
	  blockChanceFeature: true
	  
  };
  
  $("#enableAI").click(function(){
    if ( moveCount > 0 )
      isFirstMove = false;
	  aiEnabled = !aiEnabled;
	  var checkBoxes = $(".features");
	  for( var i = 0; i < checkBoxes.length; i ++ ){
		  checkBoxes[i].checked = this.checked;
		  $(checkBoxes[i]).attr("disabled", false);
	  }
  });
  
  $(".features").click(function(){
	  checkPanel[$(this).attr("id")] = this.checked;
  });
  
  $(".field").click(function(){
   
	
    if ( $(this).html() != "")
      return;
    
	if ( working )
		return;
	
	working = true;
   
	// 00000000000000000000000000
	
	
	// PROCESSing both players clicking or just firstPlayer if ai enabled
	
    $(this).html(onTurn);
	
    var positions = $(this).attr('id').split(' ');
    var x = parseInt(positions[0]);
    var y = parseInt(positions[1]);
    
    board[x][y] = onTurn;
	
    var state = checking(x,y, onTurn);
	if ( state == nothing)
		state = countingMovesAndCheckingDrawing();
	
    reportState(state, onTurn);
    if ( state != nothing ){
		working = false;
	  return;
	}
	
	//
	
	//00000000000000000000000000
    
    
 	 
	
	// if ai is disabled then onTurn  auto change
    if ( !aiEnabled )
      onTurn = (onTurn == 'X') ? 'O' : 'X'; // change automatically players
    else
	    reportState(aiHead(), computer);
	
		working = false;
		//console.log("IM DONE");
    
  });
  // add counting draw into program
  
  
  // for debug purpose
  function initBoard(){
    
    isFirstMove = false;
    
    for ( var i = 0 ; i < sizeOfColumn; i ++ )
      for (var y=0; y < sizeOfColumn; y ++ )
        $("[id='" +  i + ' ' + y  + "']").html(board[i][y]);
  }
  
  // 00000000000000 this function below are tight connected
  function reportState(state, sign){
	  if ( state == nothing )
		  return;
	  
	  // at this stage state can be win or draw
	  
	  $('#state').html((state == win ? sign : '') +' '+state );
	  
	  resetBoard();
	
  } 
  // returning draw state if true
  function countingMovesAndCheckingDrawing(){
	  moveCount++;
	  $("#movenum").html(9-moveCount); 
	  return isDraw();
	  
  }
  
  function isDraw(){
    // draw
	if ( moveCount == (Math.pow(sizeOfColumn, 2)) )
		return draw;
	else 
		return nothing;
  }
  // reset all
  function resetBoard(){
	  
	  updatePrevBoard();
	  
	  for ( var i = 0 ; i < sizeOfColumn; i ++ )
		  for ( var y = 0; y < sizeOfColumn; y ++ ){
			  board[i][y] = 0;
			  $("[id='" + i + ' ' + y + "']").html('');
		  }
		  
		  moveCount = 0;
		  isFirstMove = true;
    	  $("#movenum").html(9);
		  
  }
  // 00000000000000 this function above are tight connected
  
  
  
  
  
  // done
  function checking(x,y, sign){
	
	
	
	// column
	for ( let i = 0; i < sizeOfColumn; i ++ ){
		if ( board[x][i] != sign )
			break;
    
		if ( i == sizeOfColumn-1)
      return win;
   
	}
    
	//row
	for ( let i = 0; i < sizeOfColumn; i++ ){
		
		if ( board[i][y] != sign )
      break;
      
		if ( i == sizeOfColumn-1)
      return win;
		
	}
    
	//  diag
	for ( let i = 0; i < sizeOfColumn; i++ ){
		
		if ( board[i][i] != sign )
      break;
      
		if ( i == sizeOfColumn-1)
      return win;
		
	}
    
    //anti-diag
	for ( let i = 0; i < sizeOfColumn; i++ ){
		if ( board[i][ (sizeOfColumn-1) - i]  != sign )
      break;
      
		if ( i == sizeOfColumn-1)
      return win;
	}
	
	
	return nothing;
	}
  // this above use both side



  // done
  function doubleChancesChecker(){
		
	var case1 = [
	
		[1,0,0],
		[0,1,0],
		[1,0,0]
	
	];
	
	var case2 = [
	
		[1,0,0],
		[0,0,0],
		[0,1,1]
	
	];
	
	var case3 = [
	
		[1,0,0],
		[0,0,0],
		[1,0,1]
	
	];
		
	var cases = [case1, case2, case3];
	
	this.sizeOfColumng = 3;
	
	// alocate arrReadyForRotating so we have ready array to use in rotate function, pros we do not allocate every time when we call rotate new array with sizeOfColumn * sizeOfColumn
	function allocateArray(row){
		
		var arr = new Array(row || 0);
		
		var i = row;
		if ( arguments.length == 2 )
			while( i-- )
				arr[row-i -1] = allocateArray(arguments[1]);
		
		return arr;
	}
	
	// check for dobule chances via provided patterns in cases array
	this.checker = function doubleChances(board, sign){
		
		var numberOfRotation = 4;
		
	  	for ( var i = 0; i <cases.length;  i ++ ){
			
			var myCase = cases[i];
			for ( var y = 0; y < numberOfRotation; y++ ){
				
				var count = 0;
				var coords = [];
				for ( var x = 0; x < sizeOfColumn; x++){
					for ( var c = 0; c < sizeOfColumn; c++)
						if ( myCase[x][c] == 1 && board[x][c] == sign ){
							
							coords.push([x,c]);
							
							if ( ++count == 3 )
								return [myCase, coords];
							
						}
          
        }
				
				
				
				myCase = rotate(myCase);
				
			}
			
		}
		
		return null;
		
	}
		
	// rotate array 90 degres
	function rotate(caseBoard){
		var ret = allocateArray(sizeOfColumn, sizeOfColumn);
		for ( var i =0; i < sizeOfColumn; i ++ ){
			for ( var y= 0; y < sizeOfColumn; y++ ){
				ret[i][y] = caseBoard[sizeOfColumn - y -1][i];
			}
		    //console.log(caseBoard[i]);
		}
		
		return ret;
		
	}
		
}
  // this above is object wery strong
  
  
  
  
  
  // 00000000000000000000000000
  // AI 
  // made in same manner as meMakeOrBlockDp and meDP
  function meWinOrPreventLoss(){
    
	
	if ( checkPanel.winFeature ){
		var makeWin = meWinLoss(computer, win);
		if ( makeWin != nothing )
			return makeWin;
	
	}
	
	if ( checkPanel.preventLossFeature ){
		
		var makePrevent = meWinLoss(firstPlayer, prevent);
		if ( makePrevent != nothing )
			return makePrevent;
		
	}
   
    
    return nothing;
    
  }
  
  function meWinLoss(player, job){
		 for ( var i = 0; i < sizeOfColumn; i ++ )
		  for ( var y = 0; y < sizeOfColumn; y ++ ){
			if ( board[i][y] == 0 ){
			  
			  
				  board[i][y] = player;
				  var playerWin = checking(i,y, player);
				  board[i][y] = 0;
				  
				  if ( playerWin == win )
					return { todo: job, where: [i, y]};
			}
		  }
		  
		  return nothing;
  }
 

 // using meDP in this function for both side
  function meMakeOrBlockDP(){
    
	if ( checkPanel.makeChanceFeature ){
		
		var block = meDP(firstPlayer);
		if ( block != null ){
		//console.log("block: " + block);
		  return block;
		}
		
	}
	
	if ( checkPanel.blockChanceFeature ){
		
		var make = meDP(computer);
		
		if ( make != null ){
		//console.log("make: " + make);
		  return make;
		}
		
	}
    
    return null;
    
  }
  // checking DP nevermind if it enemy or other one
  function meDP(player){
    
    for ( let i = 0; i < sizeOfColumn; i ++ )
      for ( let y = 0; y < sizeOfColumn; y ++ ){
        if ( board[i][y] == 0 ){
          board[i][y] = player;
          var dp = doubleChecker.checker(board, player);
          board[i][y] = 0;
          if ( dp != null)
            return [i,y];
        }
      }
    
    return null;
    
  }
 
  // 00000000000000000000000000
  
  
  
  
  // respetivly
  function printBoard(){
    
  //console.log("Board: ");
    for ( var i = 0 ; i < sizeOfColumn; i ++ ){
      for ( var y = 0; y < sizeOfColumn; y++ );
    //console.log(board[i]+',');
    }
  }
  
  
  function aiHead(){

	//console.log("TOP of aiHEAD");
    printBoard();
	//console.log("!!!TOP of aiHEAD!!!");
	
	
	
	
	if ( countingMovesAndCheckingDrawing()  == draw )
		return draw;
	

    if ( isFirstMove){
		
    //console.log("Enter firstMove");
      let dp = firstMove();
    //console.log("End firstMove");
	  
      $("[id='"+ (dp[0] + ' ' + dp[1])  + "']").html(computer);
      board[dp[0]][dp[1]] = computer;
	  
      isFirstMove =false;
	  
      return nothing;
    }
    
	
	
	/////////// ME WIN OR PREVENT LOSS
	
    //console.log("Enter meWinOrPreventLoss");
    var thirdNode = meWinOrPreventLoss();
    //console.log("End meWinOrPreventLoss");
	  
    if ( thirdNode != nothing ){
      
      if ( thirdNode.todo == win ){
        
      //console.log("Win at: " + thirdNode.where);
        $("[id='"+ (thirdNode.where[0] + ' ' + thirdNode.where[1])  + "']").html(computer);
        board[thirdNode.where[0]][thirdNode.where[1]] = computer;
        return win;
      } else {
        //
      //console.log("Prevent at: " + thirdNode.where);
        $("[id='"+ (thirdNode.where[0] + ' ' + thirdNode.where[1])  + "']").html(computer);
        board[thirdNode.where[0]][thirdNode.where[1]] = computer;
      }
        return nothing;
      
    }
	
	
	/////////// ME WIN OR PREVENT LOSS ABOVE
	
	
	
	////////// ME MAKE OR BLOCK DP 
	
    //console.log("Enter meMakeOrBlockDP");
    var dp = meMakeOrBlockDP();
    //console.log("End meMakeOrBlockDP");
    
    if ( dp != null ){
    //console.log("[id='"+ (dp[0] + ' ' + dp[1])  + "']");
      $("[id='"+ (dp[0] + ' ' + dp[1])  + "']").html(computer);
      board[dp[0]][dp[1]] = computer;
      return nothing;
    }
    
	////////// ME MAKE OR BLOCK DP ABOVE
	
	
	
    //console.log("Enter randomPlace");
    var rand= randomPlace();
    //console.log("End randomPlace");
    
    $("[id='"+ (rand[0] + ' ' + rand[1])  + "']").html(computer);
	board[rand[0]][rand[1]] = computer;
    
	
	
		return nothing;
	
	
	
  }
  
  function randomPlace(){
    
	printBoard();
    var free = [];
    
    for ( var i = 0; i < board.length; i ++ )
      for ( var y = 0; y < board[i].length; y ++ )
        if ( board[i][y] == 0 )
          free.push([i,y]);
    
    var randomNum = Math.floor(Math.random() * (free.length - 1));
    
    return free[randomNum];
    
  }
  
  function firstMove(){
	printBoard();
	
	
	var selectBest = checkPanel.bestFirstMove ? 0 : Math.random();
	if ( selectBest < 0.4 )
		if ( board[1][1] == 0 )
			return [1,1];
    
   
       
		var corner = Math.floor(Math.random() * 4 ) + 1;
		switch( corner ){
			
			case 1:
        if ( board[0][0] == 0 )
          return [0,0];
			case 2:
        if ( board[0][sizeOfColumn-1] == 0)
			return [0, sizeOfColumn-1];
			case 3:
        if ( board[sizeOfColumn-1][sizeOfColumn-1] == 0)
			return [sizeOfColumn-1, sizeOfColumn-1];
			case 4:
        if ( board[sizeOfColumn-1][0] == 0)
			return [sizeOfColumn-1, 0];
			
		}

}

  
  var offsetMin = 3;
  var offsetMax = 6;
  function updatePrevBoard(){
	  
	  for ( var i = offsetMin; i  < offsetMax; i ++ )
		  for ( var y = 0; y < 3; y ++){
			  let val = board[i - offsetMin][y];
        $("[id='" + i + ' '+ y + "']").html( val == 0 ? '' : val);
      }
  }

});