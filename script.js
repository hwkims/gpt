document.addEventListener("DOMContentLoaded", function() {
    const grid=document.querySelector(".grid");
    let width=8;
    let squares=[];
    let score=0;
    let numMoves=0;
    let hasMoved=false;

    const candyColors = [
        "radial-gradient(circle at 65% 15%, #fff 1px, #FFA07A 3%, #FF9900 60%, #FFA07A 100%)", // Warm Orange
        "radial-gradient(circle at 65% 15%, #fff 1px, #4CAF50 3%, #3E8E41 60%, #4CAF50 100%)", // Fresh Green
        "radial-gradient(circle at 65% 15%, #fff 1px, #2196F3 3%, #1A73E8 60%, #2196F3 100%)", // Sky Blue
        "radial-gradient(circle at 65% 15%, #fff 1px, #9C27B0 3%, #7B1FA2 60%, #9C27B0 100%)", // Deep Purple
      ];
      
      const specialColors = [
        "radial-gradient(circle at 65% 15%, #fff 1px, #444 3%, #555 60%, #444 100%)"
      ];

    function createBoard(){
        for(i=0; i<(width*width); i++){
            const square=document.createElement('div');
            let randomColor=Math.floor(Math.random()*candyColors.length);
            square.style.background=candyColors[randomColor];
            square.setAttribute('id', i);
            square.setAttribute('draggable', true);

            //square.innerHTML=i;  //Temporär
            //square.classList.add("cen"); //Temporär

            grid.appendChild(square);
            squares.push(square);
        }

    }
    createBoard();
    setScoreBoard(); //Lägger till värden i scoreboard



      // Add animation to candies when moved
  function moveCandy(candyId) {
    const candy = document.getElementById(candyId);
    candy.classList.add('moved');
    setTimeout(() => {
      candy.classList.remove('moved');
    }, 500); // remove class after 500ms
  }

  // Add sound effects
  const soundEffects = {
    move: new Audio('sounds/move.wav'),
    score: new Audio('sounds/score.wav'),
    drop: new Audio('sounds/drop.wav')
  };

    //Dragging stuff around... and... stuff.
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));
    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));
    squares.forEach(square => square.addEventListener('dragleave', dragLeave));
    squares.forEach(square => square.addEventListener('drop', dragDrop));
    
    squares.forEach(square => square.addEventListener('touchstart', touchStart));
    squares.forEach(square => square.addEventListener('touchend', touchEnd));
    squares.forEach(square => square.addEventListener('touchmove', touchMove));
    
    let dragSquareId;
    let dragColor;
    let touchSquareId;
    let touchColor;
    
    function dragStart(event) {
      dragSquareId = parseInt(event.target.id);
      dragColor = event.target.style.background;
    }
    
    function dragEnd(event) {
      let validMoves = [
        dragSquareId - 1,
        dragSquareId - width,
        dragSquareId + 1,
        dragSquareId + width
      ];
      let validMove = validMoves.includes(parseInt(event.target.id));
      if (validMove) {
        soundEffects.move.play();
        hasMoved = true;
      } else {
        soundEffects.drop.play();
        event.target.style.background = dragColor;
        hasMoved = false;
      }
    }
    
    function dragOver(event) {
      event.preventDefault();
    }
    
    function dragEnter(event) {
      event.preventDefault();
    }
    
    function dragLeave(event) {
      
    }
    
    function dragDrop(event) {
      event.preventDefault();
      let dropSquareId = parseInt(event.target.id);
      let dropColor = event.target.style.background;
      event.target.style.background = dragColor;
      squares[dragSquareId].style.background = dropColor;
    }
    
    function touchStart(event) {
      touchSquareId = parseInt(event.target.id);
      touchColor = event.target.style.background;
    }
    
    function touchEnd(event) {
        let validMoves = [
          touchSquareId - 1,
          touchSquareId - width,
          touchSquareId + 1,
          touchSquareId + width
        ];
        let validMove = validMoves.includes(parseInt(event.target.id));
        if (validMove) {
          soundEffects.move.play();
          hasMoved = true; // Set hasMoved to true here
        } else {
          soundEffects.drop.play();
          event.target.style.background = touchColor;
          hasMoved = false;
        }
      }
    
    function touchMove(event) {
      event.preventDefault();
      let touchSquare = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
      if (touchSquare && touchSquare.id!== touchSquareId) {
        touchSquare.style.background = touchColor;
        squares[touchSquareId].style.background = touchSquare.style.background;
      }
    }
    function dragStart(){
        colorBeingDragged=this.style.background;
        squareIdBeingDragged=parseInt(this.id);
    }
    function dragEnd() {
        let validMoves = [
          squareIdBeingDragged - 1,
          squareIdBeingDragged - width,
          squareIdBeingDragged + 1,
          squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);
        if (squareIdBeingReplaced && validMove) {
          soundEffects.move.play();
          hasMoved = true;
        } else if (squareIdBeingReplaced && !validMove) {
          soundEffects.drop.play();
          squares[squareIdBeingReplaced].style.background = colorBeingReplaced;
          squares[squareIdBeingDragged].style.background = colorBeingDragged;
          hasMoved = false;
        } else {
          soundEffects.drop.play();
          squares[squareIdBeingDragged].style.background = colorBeingDragged;
          hasMoved = false;
        }
      }
    function dragOver(e){
        e.preventDefault();   
    }
    function dragEnter(e){
        e.preventDefault();
    }
    function dragLeave(){
        
    }

    function dragDrop(){
        colorBeingReplaced=this.style.background;
        squareIdBeingReplaced=parseInt(this.id);
        this.style.background=colorBeingDragged;
        squares[squareIdBeingDragged].style.background=colorBeingReplaced;
    }

    function checkMove(checkCase, points){
        for(i=0;i<width*width;i++){
            switch(checkCase){
                case "threerow":
                    arrCase=[i, i+1, i+2];
                    arrNoGo=[6,7,14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
                    break;
                case "threecolumn":
                    arrCase=[i, i+width, i+width*2];
                    arrNoGo=[48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63];
                    break;
                case "fourrow":
                    arrCase=[i, i+1, i+2, i+3];
                    arrNoGo=[5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,61,62,63];
                    break;
                case "fourcolumn":
                    arrCase=[i, i+width, i+width*2, i+width*3];
                    arrNoGo=[40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63];
                    break;
                case "fiverow":
                    arrCase=[i, i+1, i+2, i+3, i+4];
                    arrNoGo=[4,5,6,7,12,13,14,15,20,21,22,23,28,29,30,31,36,37,38,39,44,45,46,47,52,53,54,55,60,61,62,63];
                    break;
                case "fivecolumn":
                    arrCase=[i, i+width, i+width*2, i+width*3, i+width*4];
                    arrNoGo=[32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63];
                    break;
                case "pool":
                    //  X X
                    //  X X
                    arrCase=[i, i+1, i+width, i+width+1];
                    arrNoGo=[7, 15, 23, 31, 39, 47, 55,56,57,58,59,60,61,62, 63];
                    break;
                case "diamond":
                    arrCase=[i, i+width-1, i+width+1, i+width*2];
                    arrNoGo=[0, 7, 8, 15, 16, 23, 24, 31, 32, 39, 40, 47, 48,49,50,51,52,53,54, 55, 56,57,58,59,60,61,62, 63];
                    //    X
                    //  X   X
                    //    X
                    break;
                case "fourleftdiagonal":
                    //  X
                    //    X
                    //      X
                    //        X
                    break;
                case "fourrightdiagonal":
                    //        X
                    //      X
                    //    X
                    //  X
                    break;    
                default:
            }


            let decidedColor=squares[i].style.background;
            const isBlank=squares[i].style.background === "";

            if(arrNoGo.includes(i)) continue; 

            if (arrCase.every(index => squares[index].style.background === decidedColor &&!isBlank)) {
                if (hasMoved) {
                  score += points;
                  numMoves++;
                  setScoreBoard();
                  soundEffects.score.play();
                }
                arrCase.forEach(index => {
                  squares[index].style.background = "";
                })
              }
    }
}

function moveDown() {
    for (i = 0; i < width; i++) {
      if (squares[i].style.background === "") {
        let randomColor = Math.floor(Math.random() * candyColors.length);
        squares[i].style.background = candyColors[randomColor];
      }
    }
    for (i = 0; i < width * width; i++) {
      if (squares[i].style.background === "") {
        let randomColor = Math.floor(Math.random() * candyColors.length);
        squares[i].style.background = candyColors[randomColor];
        if (squares[i].style.background !== "") {
          soundEffects.drop.play();
        }
      }
    }
  }

    function setScoreBoard(){
        document.getElementById('score').innerHTML=score;
        document.getElementById('moves').innerHTML=numMoves;
    }

    window.setInterval(function() {
        checkMove("diamond", 1000);
        checkMove("pool", 200);
        checkMove("fiverow", 100);   
        checkMove("fivecolumn", 100);
        checkMove("fourrow", 50);
        checkMove("fourcolumn", 50);
        checkMove("threerow", 10);
        checkMove("threecolumn", 10);
        moveDown();    
    }, 100);
   
})
