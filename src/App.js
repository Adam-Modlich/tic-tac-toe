import { useState } from 'react';
import './App.css';
import blank from './images/blank.png'
import o from './images/o.png'
import x from './images/x.png'


const PLAYER_SYMBOL = 'X';
const COMPUTER_SYMBOL = 'O';
const PLAYER_WON = 1000;
const ENEMY_WON = -1000;
const DRAW = 0;


function App() {

  // let coords = {
  //   x_coord: 0,
  //   y_coord: 0
  // };

  const [size_of_board, setSizeOfBoard] = useState(0);
  const [board, setBoard] = useState();
  const [winning_options, setWinning_options] = useState([]);

  const make_all_winning_options = (size_of_board) => {
    setWinning_options([]);
    let temp_vector = new Array();

    //rows winning options
    for(let i = 0; i < Math.pow(size_of_board,2); i++){
      temp_vector.push(i);
      if((i+1)%size_of_board == 0){
        winning_options.push(temp_vector);
        temp_vector = [];
      }
    }
    temp_vector = [];

    //columns winning options
    for(let i = 0; i < size_of_board; i++){
      for(let k = 0; k < size_of_board; k++){
        temp_vector.push(i+(k*size_of_board));
      }
      winning_options.push(temp_vector);
      temp_vector = [];
    }
    temp_vector = [];


    //diagonal winning options
    for(let k = 0; k < size_of_board; k++){
        temp_vector.push((k*(size_of_board+1)));
      }
    winning_options.push(temp_vector);
    temp_vector = [];
    
    for(let k = 0; k < size_of_board; k++){
        temp_vector.push((size_of_board-1)+(k*(size_of_board-1)));
      }
    winning_options.push(temp_vector);
    temp_vector = [];
    
    console.log(winning_options)
  };

  const init_board = (sizeOB) => {
    let temp = new Array();
    console.log(temp.size)
    setSizeOfBoard(sizeOB);
    make_all_winning_options(sizeOB);
    for(let i = 0; i < Math.pow(sizeOB,2); i++){
      temp[i] = new Image();
      temp[i].src = blank;
    }

    
    setBoard(temp);
  };

  const game_is_won = (occupied_positions) => {
    let game_won = true;
    for (let i = 0; i < winning_options.size(); i++)
    {
      game_won = true;
      if (!(occupied_positions.filter(element => winning_options[i].includes(element))))
      {
        game_won = false;
        break;
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
          if(board[i] == PLAYER_SYMBOL || board[i] == COMPUTER_SYMBOL){
              occupied_pos.push(i);
          }
      }
      else if (player == 'X'){
          if(board[i] == PLAYER_SYMBOL){
              occupied_pos.push(i);
          }
      }
      else if (player == 'O'){
          if(board[i] == COMPUTER_SYMBOL){
            occupied_pos.push(i);
          }
      }
    }
    
    return occupied_pos;
  };

  const get_free_pos = () => {
    let free_pos;
    for(let i = 0; i < Math.pow(size_of_board,2); i++){
      if(board[i] != PLAYER_SYMBOL && board[i] != COMPUTER_SYMBOL){
          free_pos.push(i);
      }
    }
    return free_pos;
  };

  const is_board_full = () => {

    let is_full = false;

    if(get_occupied_pos().size() == Math.pow(size_of_board,2)){
        is_full = true;
    }

    return is_full;
  };

  const check_if_pos_is_occupied = (cordinate) => {
    let occupied_pos;
    occupied_pos = get_occupied_pos();
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
      // cout << occupied_positions.size() << endl;
  
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
          break;
      case -1000:
          break;
      case 0:
          break;
      default:
          break;
      }
  };

  const minimax_optimization = (marker, depth, alpha, beta) =>
  {
    let best_move = -1;
    let best_score = (marker == x) ? ENEMY_WON : o;
  
    if (is_board_full() || end_of_the_game() || depth == 0)
    {
      best_score = check_if_player_won(COMPUTER_SYMBOL);
      return (best_score, best_move);
    }
  
    let legal_moves = get_free_pos();
  
    for (let i = 0; i < legal_moves.size(); i++)
    {
      let curr_move = legal_moves[i];
      board[curr_move].src = marker;
  
      if (marker == COMPUTER_SYMBOL)
      {
        let score = minimax_optimization(PLAYER_SYMBOL, depth - 1, alpha, beta)[0];
        board[curr_move].src = blank;
  
        if (best_score < score)
        {
          best_score = score - depth * 10;
          best_move = curr_move;
  
          alpha = Math.max(alpha, best_score);
          board[curr_move] = blank;
          if (beta <= alpha) 
          { 
            break; 
          }
        }
  
      } 
      else
      {
        let score = minimax_optimization(COMPUTER_SYMBOL, depth - 1, alpha, beta)[1];
        board[curr_move] = blank;
  
        if (best_score > score)
        {
          best_score = score + depth * 10;
          best_move = curr_move;
  
          beta = Math.min(beta, best_score);
          board[curr_move] = blank;
          if (beta <= alpha) 
          { 
            break; 
          }
        }
  
      }
  
      board[curr_move.first][curr_move.second] = ' '; 
  
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
        max_depth = 5;
        break;

    case 5:
        max_depth = 4;
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



  const make_a_move = () => {
    while(!end_of_the_game)
    {

    }
  };

  return (
    <div className="App">
      <div className="boardSize">
        <button onClick={() => init_board(3)}>3</button>
        <button onClick={() => init_board(4)}>4</button>
        <button onClick={() => init_board(5)}>5</button>
        <button onClick={() => init_board(6)}>6</button>
        <button onClick={() => init_board(7)}>7</button>
      </div>
      {size_of_board != 0 && 
      <div>
        <div className='board' style={{display: "grid", gridTemplateColumns: `repeat(${size_of_board},1fr)`, gridTemplateRows: `repeat(${size_of_board},1fr)`}}>
        {board.map((position, index) => 
          <img className={`field position${index}`} src={position.src} onClick={() => make_a_move()}></img>
        )}
        </div>
        <h1 className='information'>Your move ...</h1>
      </div>
      }
      
    </div>
  );
}

export default App;
