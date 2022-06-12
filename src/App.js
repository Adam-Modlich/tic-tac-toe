import { useState } from 'react';
import './App.css';
import $ from 'jquery';
import blank from './images/blank.png'
import o from './images/o.png'
import x from './images/x.png'


const PLAYER_SYMBOL = 'X';
const COMPUTER_SYMBOL = 'O';
const PLAYER_WON = 1000;
const ENEMY_WON = -1000;
const DRAW = 0;


function App() {

  const [size_of_board, setSizeOfBoard] = useState(0);
  const [reactBoard, setReactBoard] = useState([]);
  const [winning_options, setWinning_options] = useState([]);

  const make_all_winning_options = (size_of_board) => {
    let temp_vector = new Array();
    let temp_winning = new Array();

    //rows winning options
    for(let i = 0; i < Math.pow(size_of_board,2); i++){
      temp_vector.push(i);
      if((i+1)%size_of_board == 0){
        temp_winning.push(temp_vector);
        temp_vector = [];
      }
    }
    temp_vector = [];

    //columns winning options
    for(let i = 0; i < size_of_board; i++){
      for(let k = 0; k < size_of_board; k++){
        temp_vector.push(i+(k*size_of_board));
      }
      temp_winning.push(temp_vector);
      temp_vector = [];
    }
    temp_vector = [];


    //diagonal winning options
    for(let k = 0; k < size_of_board; k++){
        temp_vector.push((k*(size_of_board+1)));
      }
      temp_winning.push(temp_vector);
    temp_vector = [];
    
    for(let k = 0; k < size_of_board; k++){
        temp_vector.push((size_of_board-1)+(k*(size_of_board-1)));
      }
      temp_winning.push(temp_vector);
    temp_vector = [];
    

    setWinning_options(temp_winning)
  };

  const restart_game = () => {
    setSizeOfBoard(0);    
    setReactBoard([]);
    setWinning_options([]) ; 
  };

  const init_board = (sizeOB) => {
    if(size_of_board != 0){
      alert("click restart if you want to change size")
    }
    else{
      let board = new Array(Math.pow(sizeOB,2));
      setSizeOfBoard(sizeOB);
      make_all_winning_options(sizeOB);
      for(let i = 0; i < Math.pow(sizeOB,2); i++){
        board[i] = new Image();
        board[i].src = blank;
      }
  
      setReactBoard(board);
    }
  };

  const game_is_won = (occupied_positions) => {
    let game_won = true;
    for (let i = 0; i <= winning_options.length; i++)
    {
      game_won = true;
      if (!(winning_options[i]?.every((element) => occupied_positions.includes(element))))
      {
        game_won = false;
      }
      if (game_won)
      {
        break;
      }
    }
    return game_won;
  };

  const get_occupied_pos = (player = "*") => {
    let occupied_pos = new Array();
    for(let i = 0; i < Math.pow(size_of_board,2); i++){
      if(player == '*'){
          if(reactBoard[i].src == x || reactBoard[i].src == o){
            occupied_pos.push(i);
          }
      }
      else if (player == 'X'){
          if(reactBoard[i].src == x){
            occupied_pos.push(i);
          }
      }
      else if (player == 'O'){
        if(reactBoard[i].src == o){
            occupied_pos.push(i);
          }
      }
    }
    
    return occupied_pos;
  };

  const get_free_pos = () => {
    let free_pos = new Array();
    for(let i = 0; i < Math.pow(size_of_board,2); i++){
      if(reactBoard[i].src != o && reactBoard[i].src != x){
          free_pos.push(i);
      }
    }
    return free_pos;
  };

  const is_board_full = () => {

    let is_full = false;

    if(get_occupied_pos().length == Math.pow(size_of_board,2)){
        is_full = true;
    }

    return is_full;
  };

  const check_if_pos_is_occupied = (cordinate) => {
    let occupied_pos = new Array();
    occupied_pos = get_occupied_pos();
    // console.log(occupied_pos)
    if((occupied_pos.includes(cordinate))){
        //The cordinate is free
        return true;
    }
    else{
        //The cordinate is occupied
        return false;
    }
  };

  const check_if_player_won = (player) => {
    let opponent_marker;
    if (player == PLAYER_SYMBOL)
    {
      opponent_marker = COMPUTER_SYMBOL;
    }
    else
    {
      opponent_marker = PLAYER_SYMBOL;
    }
  
    let occupied_positions = get_occupied_pos(player);
  
    let is_won = game_is_won(occupied_positions);
  
    if (is_won)
    {
      return PLAYER_WON;
    }
  
    let occupied_positions_opponent = get_occupied_pos(opponent_marker);
    let is_lost = game_is_won(occupied_positions_opponent);
  
    if (is_lost)
    {
      return ENEMY_WON;
    }
  
    let is_full = is_board_full();
    if (is_full)
    {
      return DRAW;
    }
  
    return DRAW;
  };
    
  const end_of_the_game = () => {
  
      let temp = false;
  
      if(is_board_full()){
          temp = true;
      }
  
      let anybody_won = check_if_player_won(PLAYER_SYMBOL);
  
      if(anybody_won == PLAYER_WON || anybody_won == ENEMY_WON){
          temp = true;
      }
  
    return temp;
  };
  
  const print_end_result = (result) => {
      switch (result)
      {
      case 1000:
        return ( "<h1> You Won Congrats </h1>" )
          break;
      case -1000:
        return ( "<h1> Computer Won  </h1>" )
          break;
      case 0:
        return ( "<h1> DRAW </h1>" )
          break;
      default:
          break;
      }
  };

  const minimax_optimization = (board, marker, depth, alpha, beta) =>
  {
    // let board = reactBoard;
    let best_move = -1;
    let best_score = (marker == COMPUTER_SYMBOL) ? ENEMY_WON : PLAYER_WON;
    let gamer_image = (marker == COMPUTER_SYMBOL) ? o : x;


    if (is_board_full() || end_of_the_game() || depth == 0)
    {
      best_score = check_if_player_won(COMPUTER_SYMBOL);
      return [best_score, best_move];
    }
  
    let legal_moves = new Array();

    legal_moves = get_free_pos();
  
    for (let i = 0; i < legal_moves.length; i++)
    {
      let curr_move = legal_moves[i];
      board[curr_move].src = gamer_image;
      // setReactBoard(board);
  
      if (marker == COMPUTER_SYMBOL)
      {
        let score = minimax_optimization(board, PLAYER_SYMBOL, depth - 1, alpha, beta)[0];
        board[curr_move].src = blank;
  
        if (best_score < score)
        {
          best_score = score - depth * 10;
          best_move = curr_move;
  
          alpha = Math.max(alpha, best_score);
          board[curr_move].src = blank;
          // setReactBoard(board);
          if (beta <= alpha) 
          { 
            break; 
          }
        }
  
      } 
      else
      {
        let score = minimax_optimization(board, COMPUTER_SYMBOL, depth - 1, alpha, beta)[0];
        board[curr_move].src = blank;
        // setReactBoard(board);
  
        if (best_score > score)
        {
          best_score = score + depth * 10;
          best_move = curr_move;
  
          beta = Math.min(beta, best_score);
          board[curr_move].src = blank;
          // setReactBoard(board);

          if (beta <= alpha) 
          { 
            break; 
          }
        }
  
      }
  
      board[curr_move].src = blank;
      // setReactBoard(board); 
  
    }
  
    return [best_score, best_move];
  };

  const get_max_depth = () => {
    let max_depth = 0;
    switch (size_of_board)
    {
    case 3:
        max_depth = 9;
        break;

    case 4:
        max_depth = 3;
        break;

    case 5:
        max_depth = 3;
        break;

    case 6:
        max_depth = 3;
        break;

    case 7:
        max_depth = 3;
        break;

    default:
        break;
    };

    return max_depth;
  }; 

  const make_a_move = (e,index) => {
    let board = reactBoard;

    if(!end_of_the_game()){
      if(!check_if_pos_is_occupied(index))
      {
        $(`.position${index}`).attr('src', x);
        board[index].src = x;
        setReactBoard(board);
        if(!end_of_the_game()){
          let ai_move = minimax_optimization(reactBoard ,COMPUTER_SYMBOL,get_max_depth(),ENEMY_WON,PLAYER_WON)
          $(`.position${ai_move[1]}`).attr('src', o);
          board[ai_move[1]].src = o;
          setReactBoard(board);
        }
        else{
          alert(print_end_result(check_if_player_won(PLAYER_SYMBOL)));
        }
      }
    }
    else{
      alert(print_end_result(check_if_player_won(PLAYER_SYMBOL)))
    }
    


  };

  return (
    <div className="App">
      <div className="boardSize">
        <button onClick={() => init_board(3)}>3</button>
        <button onClick={() => init_board(4)}>4</button>
        {/* <button onClick={() => init_board(5)}>5</button>
        <button onClick={() => init_board(6)}>6</button>
        <button onClick={() => init_board(7)}>7</button> */}
      </div>
      <button onClick={() => restart_game()}>Restart</button>
      {size_of_board != 0 && 
      <div>
        <div className='board' style={{display: "grid", gridTemplateColumns: `repeat(${size_of_board},1fr)`, gridTemplateRows: `repeat(${size_of_board},1fr)`}}>
        {reactBoard.map((position, index) => 
          <img key={index} className={`field position${index}`} src={position.src} onClick={(e) => make_a_move(e,index)}></img>
        )}
        </div>
      </div>
      }      
    </div>
  );
}

export default App;
