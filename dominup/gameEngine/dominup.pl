%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%      		  Libraries used   			%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
:- use_module(library(random)).
:- use_module(library(lists)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%      	   Game initial state  			%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

:- dynamic table/1.
table([ [ [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0] ],
  		[ [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0] ],
  		[ [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0] ],
  		[ [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0] ],
  		[ [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0] ],
  		[ [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0] ],
  		[ [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0] ],
  		[ [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0] ],
  		[ [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0] ],
  		[ [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0], [ 8, 0] ] ]).

:- dynamic letters/1.
letters(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'z']).

:- dynamic table_size/2.
table_size(9,9).

dominoes([ [0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], [0,7],
 		   [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7],
 		   [2,2], [2,3], [2,4], [2,5], [2,6], [2,7],
 		   [3,3], [3,4], [3,5], [3,6], [3,7],
 		   [4,4], [4,5], [4,6], [4,7],
 		   [5,5], [5,6], [5,7],
 		   [6,6], [6,7],
 		   [7,7] ]).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%		  	     Resume game    	   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% resume game of 4 previously saved
resume_game(4):-
		set_num_players(4),
		game_from_file(Table, XMax, YMax, Name1, Name2, Name3, Name4, P1D, P2D, P3D, P4D, P1T, P2T, P3T, P4T, Diff1, Diff2, Diff3, Diff4),
 		set_table_size(XMax, YMax),
        save_player(Name1, P1D), save_player(Name2, P2D), save_player(Name3, P3D), save_player(Name4, P4D),
        save_player_type(Name1, P1T), save_player_type(Name2, P2T), save_player_type(Name3, P3T), save_player_type(Name4, P4T),
        set_difficulty(Name1, Diff1), set_difficulty(Name2, Diff2), set_difficulty(Name3, Diff3), set_difficulty(Name4, Diff4),
        play(Name1, Table).

% resume game of 2 previously saved
resume_game(2):-
		set_num_players(2),
 		game_from_file(Table, XMax, YMax, Name1, Name2, P1D, P2D, P1T, P2T, APD),
 		set_table_size(XMax, YMax),
        save_player(Name1, P1D), save_player(Name2, P2D),
        save_player_type(Name1, P1T), save_player_type(Name2, P2T),
        set_auto_player(P2T, APD),
        play(Name1, Table).

set_table_from_data(Table,XMax,YMax,Name1,Name2,P1D,P2D,P1T,P2T) :- set_table_size(XMax, YMax),
      save_player(Name1, P1D), save_player(Name2, P2D),
      save_player_type(Name1, P1T), save_player_type(Name2, P2T),
      set_auto_player(P2T, APD),
      play(Name1, Table).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%		  	  Game preparation  	   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% prepare game of 2
prepare_game(Dominoes):-
	num_players(2),
	random_permutation(Dominoes, RandomDominoes),
	distribute_dominoes(RandomDominoes, P1, P2),
	quick_sort(P1, DominoesP1), quick_sort(P2, DominoesP2),
	save_first(DominoesP1), save_first(DominoesP2).

% prepare game of 4
prepare_game(Dominoes):-
	num_players(4),
	random_permutation(Dominoes, RandomDominoes),
	distribute_dominoes_four(RandomDominoes, P1, P2, P3, P4),
	quick_sort(P1, DominoesP1), quick_sort(P2, DominoesP2), quick_sort(P3, DominoesP3), quick_sort(P4, DominoesP4),
	PlayIter is 4,
	save_first_four(DominoesP1, PlayIter, PlayIter1),
	save_first_four(DominoesP2, PlayIter1, PlayIter2),
	save_first_four(DominoesP3, PlayIter2, PlayIter3),
	save_first_four(DominoesP4, PlayIter3, _).

% determine first and second player
save_first(Dominoes):-
	member([7,7], Dominoes),
	save_player(player1, Dominoes).
save_first(Dominoes):-
	\+ member([7,7], Dominoes),
	save_player(player2, Dominoes).

% determine player order
save_first_four(Dominoes, PlayerIter, NewPlayerIter):-
	member([7,7], Dominoes),
	NewPlayerIter is PlayerIter,
	save_player(player1, Dominoes).
save_first_four(Dominoes, PlayerIter, NewPlayerIter):-
	\+ member([7,7], Dominoes),
	get_player(Ident, PlayerIter),
	NewPlayerIter is PlayerIter - 1, !,
	save_player(Ident, Dominoes).

get_player(Ident, 4) :- Ident = player2.
get_player(Ident, 3) :- Ident = player3.
get_player(Ident, 2) :- Ident = player4.

% distrubue even number of dominoes by players
distribute_dominoes(Dominoes, DominoesP1, DominoesP2):-
	append(DominoesP1, DominoesP2, Dominoes),
	length(DominoesP1, N), length(DominoesP2, N).

% distrubue dominoes among players (must be divisible by 4)
distribute_dominoes_four(Dominoes, DominoesP1, DominoesP2, DominoesP3, DominoesP4):-
	append(DominoesP1, Rest1, Dominoes),
	append(DominoesP2, Rest2, Rest1),
	append(DominoesP3, DominoesP4, Rest2),
	length(DominoesP1, N),
	length(DominoesP2, N),
	length(DominoesP3, N),
	length(DominoesP4, N).

quick_sort([X|Xs], Ys):-
	partiotion(Xs, X, Small, Large),
	quick_sort(Large, Ls),
	quick_sort(Small, Ss),
	append(Ss, [X|Ls], Ys).
quick_sort([],[]).

%order dominoes [A, B], by ascending A, then by ascending B
partiotion([[X, X1] | Xs], [X,Y1], [[X, X1] | Ls], Bs):- X1 =<Y1, partiotion(Xs, [X, Y1], Ls, Bs).
partiotion([[X, X1] | Xs], [X,Y1], Ls, [[X, X1]| Bs]):- X1 > Y1, partiotion(Xs, [X, Y1], Ls, Bs).
partiotion([[X, X1] | Xs], [Y,Y1], [[X, X1] | Ls], Bs):- X < Y, partiotion(Xs, [Y, Y1], Ls, Bs).
partiotion([[X, X1] | Xs], [Y,Y1], Ls, [[X, X1]| Bs]):- X > Y, partiotion(Xs, [Y, Y1], Ls, Bs).
partiotion([], [_, _], [], []).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%				  API   				%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
get_next_player(CurPlayer, NextPlayer):-
	num_players(NumPlayers),
	next_player(CurPlayer, NextPlayer, NumPlayers).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%			  Player vs Player 		   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

player_player(Table):-
	set_num_players(2),
	table(Table),
	set_table_size(9,9),
	dominoes(Dom),
	prepare_game(Dom),!,
	save_player_type(player1, human),
	save_player_type(player2, human).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%		    Player vs Computer 		   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

player_computer(Table):-
	set_num_players(2),
	table(Table),
	set_table_size(9,9),
	dominoes(Dom),
	prepare_game(Dom),!,
	save_player_type(player1, human), save_player_type(player2, computer).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%		  Computer vs Computer 		   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

computer_computer(Table):-
	set_num_players(2),
	table(Table),
	set_table_size(9,9),
	dominoes(Dom),
	prepare_game(Dom),!,
	save_player_type(player1, computer), save_player_type(player2, computer).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%				  Play   				%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% make moves while the game is not over
play(Player, Table):-
	make_moves(Player, Table, NewTable), !,
	\+ game_over(Player),
	num_players(NumPlayers),
	next_player(Player, NextPlayer, NumPlayers), !,
	play(NextPlayer, NewTable).



% if it is the fisrt play, make single move
make_moves(Player, Table, NewTable):-
	table(Table),
	make_move(Player, Table, NewTable1),
	check_for_resize(NewTable1, NewTable), !.

% while there are vertical plays available, perform them
make_moves(Player, Table, NewTable):-
	try_vertical_play(Player, Table), !,
	make_move(Player, Table, NewTable1),
	check_for_resize(NewTable1, NewTable2), !,
	make_moves(Player, NewTable2, NewTable).

% if no vertical plays are available, perform expansion play
make_moves(Player, Table, NewTable):-
	try_expansion_play(Player, Table), !,
	make_move(Player, Table, NewTable1),
	check_for_resize(NewTable1, NewTable).

% attempt vertical play
try_vertical_play(Player, Table):-
	player(Player, Dominoes),
	\+ list_vertical_plays(Dominoes, Table, []).

% attempt expansion play
try_expansion_play(Player, Table):-
	player(Player, Dominoes),
	\+ list_expansion_plays(Dominoes, Table, []).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%		  	  4 Player Mode		    	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

four_player_mode(Table) :-
	set_num_players(4),
	table(Table),
	set_table_size(9,9),
	dominoes(Dom),
	prepare_game(Dom),!,
	select_role(player1), !,
	select_role(player2), !,
	select_role(player3), !,
	select_role(player4).

select_role(Player):-	repeat, clear_screen,
			write('---------------------------------'), nl,
			write('|           Select Role            |'), nl,
			write('---------------------------------'), nl,
			write('0\t| Human Player'), nl,
			write('1\t| Computer Player'), nl,
			write('---------------------------------'), nl,
			write('| Option ? '),
			read(Option), number(Option), int_to_type(Player, Option).

int_to_type(Player, 0) :- save_player_type(Player, human), !, set_difficulty(Player, none).
int_to_type(Player, 1) :- save_player_type(Player, computer), !, select_difficulty_no_defense(Player).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%			  	Game Over	 		   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

game_over(Player):-
player(Player, []).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%				Computer	 		   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

select_difficulty(Player):-
	nl, write('\t|||  '), write(Player), write('  |||'), nl,
	write('---------------------------------'), nl,
	write('|       Difficulty level        |'), nl,
	write('---------------------------------'), nl,
	write('0\t| Random'), nl,
	write('1\t| Defense'), nl,
	write('2\t| Attack'), nl,
	write('| Option ? '), nl,
	read(Option), number(Option),
	member(Option, [0, 1, 2]),
	set_difficulty(Player, Option).

select_difficulty_no_defense(Player):-
	nl, write('\t|||  '), write(Player), write('  |||'), nl,
	write('---------------------------------'), nl,
	write('|       Difficulty level        |'), nl,
	write('---------------------------------'), nl,
	write('0\t| Random'), nl,
	write('2\t| Attack'), nl,
	write('| Option ? '), nl,
	read(Option), number(Option),
	member(Option, [0, 2]),
	set_difficulty(Player, Option).


% performs a valid move, randomly ----------------------------Improved
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%First play
random_move(Player, Table, NewTable, Domino-[AX,AY]-[BX, BY]):-
	player(Player, Dominoes),
  table(Table),
	repeat,
	length(Dominoes, MaxLength),
	random(0, MaxLength, Piece),
	nth0(Piece, Dominoes, Domino),
	random(4, 6, Ax1), random(4, 6, Ay1),
	random(4, 6, Bx1), random(4, 6, By1),
  static_first_play(Domino-[Ax1, Ay1]-[Bx1, By1], Domino-[AX, AY]-[BX, BY]),
	execute_play(Dominoes, Domino-[AX,AY]-[BX, BY], Table, NewTable),!,
	delete(Dominoes, Domino, NewDominoes),
	save_player(Player, NewDominoes).


random_move(Player, Table, NewTable, Domino-[AX,AY]-[BX, BY]):-
	player(Player, Dominoes),
  \+ table(Table),
	list_vertical_plays(Dominoes, Table, PossiblePlays),
	length(PossiblePlays, NPlays), NPlays \= 0 , !, repeat,
	random(0, NPlays, Play),
	nth0(Play, PossiblePlays, Domino-[AX,AY]-[BX, BY]),
	execute_play(Dominoes, Domino-[AX,AY]-[BX, BY], Table, NewTable),!,
	delete(Dominoes, Domino, NewDominoes),
	save_player(Player, NewDominoes), !.

random_move(Player, Table, NewTable, Domino-[AX,AY]-[BX, BY]):-
	player(Player, Dominoes),
  \+ table(Table),
	repeat,
	length(Dominoes, MaxLength),
	random(0, MaxLength, Piece),
	nth0(Piece, Dominoes, Domino),
	table_size(XMax, YMax), XMax1 is XMax +1, YMax1 is YMax +1,
	random(0, XMax1, AX), random(0, YMax1, AY),
	random(0, XMax1, BX), random(0, YMax1, BY),
	execute_play(Dominoes, Domino-[AX,AY]-[BX, BY], Table, NewTable),!,
	delete(Dominoes, Domino, NewDominoes),
	save_player(Player, NewDominoes).



% performs a valid move, determining the best play at the moment
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% if there are vertical plays available
% choose the one that guarantees the most vertical plays left to be played
auto_move(Player, Table, NewTable, Domino-[AX,AY]-[BX, BY]):-
	player(Player, Dominoes),
	list_vertical_plays(Dominoes, Table, PossiblePlays),
	\+ length(PossiblePlays, 0), !,
	find_best_play(PossiblePlays, Dominoes, Table, Domino-[AX,AY]-[BX, BY]), !,
	execute_play_skip_validation(Domino-[AX,AY]-[BX, BY], Table, NewTable),!,
	delete(Dominoes, Domino, NewDominoes),
	save_player(Player, NewDominoes).

% if there are only expansion plays available
% choose the one that guarantees the most vertical plays to be played
auto_move(Player, Table, NewTable, Domino-[AX,AY]-[BX, BY]):-
	player(Player, Dominoes),
	list_expansion_plays(Dominoes, Table, PossiblePlays),
	\+ length(PossiblePlays, 0), !,
	select_play(Player, PossiblePlays, Dominoes, Table, Domino-[AX,AY]-[BX, BY]), !,
	execute_play_skip_validation(Domino-[AX,AY]-[BX, BY], Table, NewTable),!,
	delete(Dominoes, Domino, NewDominoes),
	save_player(Player, NewDominoes).

auto_move(Player, Table, NewTable, Domino-[AX,AY]-[BX, BY]):-
	random_move(Player, Table, NewTable, Domino-[AX,AY]-[BX, BY]), !.


% select play according to difficulty level
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% level 2
select_play(Player, PossiblePlays, Dominoes, Table, Domino-[AX,AY]-[BX, BY]):-
	difficulty(Player, 2),
	find_best_play(PossiblePlays, Dominoes, Table, Domino-[AX,AY]-[BX, BY]).

% level 1
select_play(Player, PossiblePlays, Dominoes, Table, Domino-[AX,AY]-[BX, BY]):-
	difficulty(Player, 1),
	find_worst_play(Player, PossiblePlays, Dominoes, Table, Domino-[AX,AY]-[BX, BY]).


% find the play that leaves the adversary with the least options (Defense)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
find_worst_play(Player, Plays, Dominoes, Table, WorstPlay):-
	num_players(NumPlayers),
	next_player(Player, OtherPlayer, NumPlayers),
	player(OtherPlayer, OtherDominoes),
	find_worst_play(Plays, OtherDominoes, Dominoes, Table, WorstPlay, _, 99999).

find_worst_play([], _, _, _, WorstPlay, WorstPlay, _).
find_worst_play( [ Domino-[AX,AY]-[BX, BY] | OtherPlays], OtherDominoes, Dominoes, Table, WorstPlay, TempPlay, CurWorst):-
	execute_play_skip_validation(Domino-[AX,AY]-[BX, BY], Table, NewTable), !,	%execute play with current piece
	list_vertical_plays(OtherDominoes, NewTable, PossiblePlays),				%list new possibilities
	length(PossiblePlays, NPossiblePlays),
	det_worst_play(TempPlay, CurWorst, Domino-[AX,AY]-[BX, BY], NPossiblePlays, NewTemp, NewWorst), !,
	find_worst_play(OtherPlays, OtherDominoes, Dominoes, Table, WorstPlay, NewTemp, NewWorst).

det_worst_play(Play1, N1Possibilities, _, N2Possibilities, Play1, N1Possibilities):-
	N1Possibilities<N2Possibilities, !.
det_worst_play(_, _, Play2, N2Possibilities, Play2, N2Possibilities).


% find the play that allows exectution of larger number of vertical plays (Attack)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
find_best_play(Plays, Dominoes, Table, BestPlay):-
	find_best_play(Plays, Dominoes, Table, BestPlay, _, 0).

find_best_play([], _, _, BestPlay, BestPlay, _).
find_best_play( [ Domino-[AX,AY]-[BX, BY] | OtherPlays], Dominoes, Table, BestPlay, TempPlay, CurBest):-
	execute_play_skip_validation(Domino-[AX,AY]-[BX, BY], Table, NewTable), !,	%execute play with current piece
	delete(Dominoes, Domino, NewDominoes),									%remove piece from options
	list_vertical_plays(NewDominoes, NewTable, PossiblePlays),				%list new possibilities
	length(PossiblePlays, NPossiblePlays),
	det_best_play(TempPlay, CurBest, Domino-[AX,AY]-[BX, BY], NPossiblePlays, NewTemp, NewBest), !,
	find_best_play(OtherPlays, Dominoes, Table, BestPlay, NewTemp, NewBest).

det_best_play(Play1, N1Possibilities, _, N2Possibilities, Play1, N1Possibilities):-
	N1Possibilities>N2Possibilities, !.
det_best_play(_, _, Play2, N2Possibilities, Play2, N2Possibilities).

advanced_level(Player):-
	difficulty(Player, 1), !.
advanced_level(Player):-
	difficulty(Player, 2), !.

% make move, if the player is the computer
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%TODO check if these changes work (auto player and human player)
% First play forces a certer position
make_move(Player, Table, NewTable, Move):-
	type(Player, computer),
  table(Table), !,
	clear_screen,
	show_table(Table),
	nl, write('| '), write(Player), write(' \'s turn:'), nl,
	write('| Determining next play...'), nl,
	random_move(Player, Table, NewTable, Move).


% advanced levels
make_move(Player, Table, NewTable, Move):-
	type(Player, computer),
	advanced_level(Player), !,
	clear_screen,
	show_table(Table),
	nl, write('| '), write(Player), write(' \'s turn:'), nl,
	write('| Determining next play...'), nl,
	auto_move(Player, Table, NewTable, Move).


% level 0
make_move(Player, Table, NewTable, Move):-
	type(Player, computer),
	difficulty(Player, 0),
	clear_screen,
	show_table(Table),
	nl, write('| '), write(Player), write(' \'s turn:'), nl,
	write('| Determining next play...'), nl,
	random_move(Player, Table, NewTable, Move).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%			  	Human Player 			%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% make move, if the player is human
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% If it's the first play, force move to the center of the table
make_move(Player, Domino-[AX,AY]-[BX, BY], Table, NewTable):-
			type(Player, human),
      table(Table),
      static_first_play(Domino-[AX,AY]-[BX, BY], Domino-[AfX,AfY]-[BfX, BfY])
			execute_play(Dominoes, Domino-[AfX,AfY]-[BfX, BfY], Table, NewTable),!,
			delete(Dominoes, Domino, NewDominoes),
			save_player(Player, NewDominoes), !.

make_move(Player, Domino-[AX,AY]-[BX, BY], Table, NewTable):-
			type(Player, human),
      \+ table(Table),
			execute_play(Dominoes, Domino-[AX,AY]-[BX, BY], Table, NewTable),!,
			delete(Dominoes, Domino, NewDominoes),
			save_player(Player, NewDominoes), !.

save_game(Player, Table):-
	num_players(2),
 	player(Player, Dominoes),
	next_player(Player, Player2, 2),
	player(Player2, Dominoes2),
    type(Player2, Type2),
    get_auto_player(APD),
    table_size(X, Y),
    game_to_file(Table, X, Y, Player, Player2, Dominoes, Dominoes2, human, Type2, APD).

save_game(Player, Table):-
	num_players(4),
 	player(Player, Dominoes),
	next_player(Player, Player2, 4),
	player(Player2, Dominoes2),
    type(Player2, Type2),
    difficulty(Player2, Diff2),
    next_player(Player2, Player3, 4),
	player(Player3, Dominoes3),
    type(Player3, Type3),
    difficulty(Player3, Diff3),
    next_player(Player3, Player4, 4),
	player(Player4, Dominoes4),
    type(Player4, Type4),
    difficulty(Player4, Diff4),
    table_size(X, Y),
    game_to_file(Table, X, Y, Player, Player2, Player3, Player4, Dominoes, Dominoes2, Dominoes3, Dominoes4, human, Type2, Type3, Type4, none, Diff2, Diff3, Diff4).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%			 Evaluate play	 		   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%tells if the play is an expansion play
expansion_play(_-[AX, AY]-[BX, BY], Table):-
	check_coordinates([AX, AY], [BX, BY], Table), !,
	get_level([AX, AY], Table, 0), get_level([BX, BY], Table, 0), !,
	next_to_piece([AX, AY]-[BX, BY], Table).

%check the surroundings of the given position
%check the surroundings (left) of the given position
next_to_piece([AX, AY]-_, Table):-
	AX1 is AX-1, valid_coordinates([AX1, AY]), \+ get_content([AX1, AY], Table, 8), !.
next_to_piece(_-[BX, BY], Table):-
	BX1 is BX-1, valid_coordinates([BX1, BY]), \+ get_content([BX1, BY], Table, 8), !.

%check the surroundings (right) of the given position
next_to_piece([AX, AY]-_, Table):-
	AX1 is AX+1, valid_coordinates([AX1, AY]), \+ get_content([AX1, AY], Table, 8), !.
next_to_piece(_-[BX, BY], Table):-
	BX1 is BX+1, valid_coordinates([BX1, BY]), \+ get_content([BX1, BY], Table, 8), !.

%check the surroundings (down) of the given position
next_to_piece([AX, AY]-_, Table):-
	AY1 is AY+1, valid_coordinates([AX, AY1]),\+ get_content([AX, AY1], Table, 8), !.
next_to_piece(_-[BX, BY], Table):-
	BY1 is BY+1, valid_coordinates([BX, BY1]),\+ get_content([BX, BY1], Table, 8), !.

%check the surroundings (up) of the given position
next_to_piece([AX, AY]-_, Table):-
	AY1 is AY-1, valid_coordinates([AX, AY1]), \+ get_content([AX, AY1], Table, 8), !.
next_to_piece(_-[BX, BY], Table):-
	BY1 is BY-1, valid_coordinates([BX, BY1]), \+ get_content([BX, BY1], Table, 8), !.

%tells if the play is a vertical play
vertical_play([A, B]-[AX, AY]-[BX, BY], Table):-
	check_coordinates([AX, AY], [BX, BY], Table),!,
	\+ get_level([AX, AY], Table, 0), !,
	\+ get_level([BX, BY], Table, 0), !,
	get_content([AX, AY], Table, A), !,
	get_content([BX, BY], Table, B), !.

% any placement is valid if it is the first move
valid_play(_, _-[AX, AY]-[BX, BY], Table):-
	check_coordinates([AX, AY], [BX, BY], Table),
	table(Table), !.

% vertical play is valid if the coordinates check
valid_play(_, [A, B]-[AX, AY]-[BX, BY], Table):-
	vertical_play([A, B]-[AX, AY]-[BX, BY], Table), !.

% expansion play is valid if the coordinates check and there are no vertical plays available
valid_play(Dominoes, [A, B]-[AX, AY]-[BX, BY], Table):-
	expansion_play([A, B]-[AX, AY]-[BX, BY], Table),
	list_vertical_plays(Dominoes, Table, []), !.

list_expansion_plays(Dominoes, Table, Result):-
list_all_plays(expansion_play, Dominoes, Table, [], Result).

list_vertical_plays(Dominoes, Table, Result):-
list_all_plays(vertical_play, Dominoes, Table, [], Result).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%			 	List plays	 		   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% generates a list of all plays of type 'Type' available
list_all_plays(_, [], _, Result, Result).
list_all_plays(Type, [Domino | Rest], Table, PlaysTemp, Result):-
	list_plays_Y(Type, Domino, Table, [0,0], [], PlaysY),
	append(PlaysY, PlaysTemp, PlaysTemp1),
	list_all_plays(Type, Rest, Table, PlaysTemp1, Result).

list_plays_Y(_, _, _, [_, YMax], Result, Result):- table_size(_, YMax).
list_plays_Y(Type, [A,B], Table, [X, Y], TempPlays, Plays):-
	table_size(_, YMax),
	Y=<YMax, list_plays_X(Type, [A,B], Table, [X, Y], [], PlaysX),
	append(PlaysX, TempPlays, TempPlays1),
	Y1 is Y+1, list_plays_Y(Type, [A,B], Table, [X, Y1], TempPlays1, Plays).


list_plays_X(_, _, _, [XMax, _], Plays, Plays):-table_size(XMax, _).
list_plays_X(Type, [A,B], Table, [X, Y], TempPlays, Plays):-
	table_size(XMax, _),
	X=<XMax, play_right(Type, [A,B], Table, [X,Y], MoveRight),
	append(MoveRight, TempPlays, TempPlays1),
	play_down(Type, [A,B], Table, [X,Y], MoveDown),
	append(MoveDown, TempPlays1, TempPlays2),
	X1 is X +1, list_plays_X(Type, [A,B], Table, [X1, Y], TempPlays2, Plays).

play_right(Type, [A,B], Table, [X, Y], [[A,B]-[X,Y]-[X, Y1]]):-
	Y1 is Y + 1,
	call(Type, [A,B]-[X,Y]-[X, Y1], Table), !.
play_right(Type, [A,B], Table, [X, Y], [[A,B]-[X,Y1]-[X, Y]]):-
	Y1 is Y + 1,
	call(Type, [B,A]-[X,Y]-[X, Y1], Table), !.
play_right(_, _, _, _, []).

play_down(Type, [A,B], Table, [X, Y], [[A,B]-[X,Y]-[X1, Y]]):-
	X1 is X + 1,
	call(Type, [A,B]-[X,Y]-[X1, Y], Table), !.
play_down(Type, [A,B], Table, [X, Y], [[A,B]-[X1,Y]-[X, Y]]):-
	X1 is X + 1,
	call(Type, [B,A]-[X,Y]-[X1, Y], Table), !.
play_down(_, _, _, _, []).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%		  	   Execute play	 		   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

execute_play(Dominoes, [A,B]-[AX,AY]-[BX,BY], Table, NewTable):-
	valid_play(Dominoes, [A, B]-[AX,AY]-[BX, BY], Table), !,
	place_piece([A,B]-[AX,AY]-[BX,BY], Table, NewTable).

execute_play_skip_validation([A,B]-[AX,AY]-[BX,BY], Table, NewTable):-
	place_piece([A,B]-[AX,AY]-[BX,BY], Table, NewTable).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% 			  Adaptative table  	   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% check table for resize
check_for_resize(Table, NewTable):-
	check_for_resize_line(Table, NewTable1, 0),
	table_size(_, YMax1),
	check_for_resize_line(NewTable1, NewTable2, YMax1),
	check_for_resize_column(NewTable2, NewTable3, 0),
	table_size(XMax3, _),
	check_for_resize_column(NewTable3, NewTable, XMax3).

% check line L, add line if it does not check
check_for_resize_line(Table, NewTable, L):-
	table_size(XMax, YMax),
	YMax < 20,
	\+ check_line(Table, XMax, L),
	insert_line(Table, NewTable, L, XMax, YMax), !.
check_for_resize_line(Table, Table, _).

% check line L
check_line(Table, XMax, Y):-
	XMax1 is XMax + 1,
	create_line(XMax1, EmptyLine), !,
	nth0(Y, Table, EmptyLine).

check_for_resize_column(Table, NewTable, C):-
	table_size(XMax, YMax),
	XMax < 30,
	\+ check_column(Table, YMax, C),
	insert_column(Table, NewTable, C, XMax, YMax), !.
check_for_resize_column(Table, Table, _).

check_column(Table, _, C):-
	table_size(XMax, YMax),
	check_column(Table, C, 0, XMax, YMax).

check_column(_, _, YMax, _, YMax).
check_column(Table, X, Y, XMax, YMax):-
	get_content([X, Y], Table, 8),
	Y1 is Y + 1, check_column(Table, X, Y1, XMax, YMax).

insert_line(Table, NewTable, 0, XMax, YMax):-
	XMax1 is XMax +1, YMax1 is YMax +1,
	create_line(XMax1, NewLine),
	add_line(NewLine, 0, 0, Table, NewTable, []),
	set_table_size(XMax, YMax1).

insert_line(Table, NewTable, YMax, XMax, YMax):-
	XMax1 is XMax +1, YMax1 is YMax +1,
	create_line(XMax1, NewLine),
	add_line(NewLine, YMax1, 0, Table, NewTable, []),
	set_table_size(XMax, YMax1).

create_line(N, Line):-
	create_line(N, 0, Line, []).
create_line(N, N, Line, Line).
create_line(N, CurN, Line, TempLine):-
	CurN1 is CurN+1, create_line(N, CurN1, Line, [[8, 0]|TempLine]).

add_line(NewLine, Y, CurY, [Line | OtherLines], NewTable, TempTable):-
	Y \= CurY, CurY1 is CurY + 1, add_line(NewLine, Y, CurY1, OtherLines, NewTable, [Line | TempTable]).
add_line(NewLine, Y, Y, Table, NewTable, TempTable):-
	CurY1 is Y + 1, add_line(NewLine, Y, CurY1, Table, NewTable, [NewLine | TempTable]).
add_line(_, _, _, [], NewTable, TempTable):-reverse(TempTable, NewTable).

insert_column(Table, NewTable, X, XMax, YMax):-
	XMax1 is XMax+1,
	add_column(X, Table, NewTable),
	set_table_size(XMax1, YMax),
	add_letter(XMax1).

add_column(X, Table, NewTable):-
	add_column(X, Table, NewTable, []).
add_column(_, [], NewTable, TempTable):-reverse(TempTable, NewTable).
add_column(0, [Line | OtherLines], NewTable, TempTable):-
	add_column(0, OtherLines, NewTable, [ [[8,0] | Line] | TempTable]).
add_column(XMax, [Line | OtherLines], NewTable, TempTable):-
	append(Line, [[8,0]], NewLine),	add_column(XMax, OtherLines, NewTable, [ NewLine | TempTable]).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% 		Table Access & Manipulation	   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% get level of position [X,Y]
get_level([X, Y], Table, Level):-
nth0(Y, Table, Line), nth0(X, Line, Cell), nth0(1, Cell, Level).

% get content of position [X,Y]
get_content([X, Y], Table, V) :-
	nth0(Y, Table, Line), nth0(X, Line, Cell), nth0(0, Cell, V).

% Succeeds when the given coordinates are a valid option
check_coordinates([AX, AY], [BX, BY], Table):-
	valid_coordinates([AX, AY]),!,
	valid_coordinates([BX, BY]),!,
	\+ same_coordinates([AX, AY], [BX, BY]), !,
	in_line([AX, AY], [BX, BY]),!,
	get_level([AX, AY], Table, LevelA),!,
	get_level([BX, BY], Table, LevelB),!,
	LevelA=LevelB.

% check if given coordinates are in line
in_line([AX, AY], [BX, BY]):-
	abs(AX-BX)=<1, AY=BY.
in_line([AX, AY], [BX, BY]):-
	AX=BX, abs(AY-BY)=<1.

same_coordinates([AX, AY], [BX, BY]):-
	AX == BX, AY == BY.

% places a piece [A, B] in the given coordinates
place_piece([A, B]-ACoord-BCoord, CurTable, NewTable):-
	get_level(ACoord, CurTable, Level),
	Level1 is Level + 1,
	process_lines([[A, Level1], [B, Level1]], ACoord, BCoord, 0, CurTable, [], NewTable).

process_lines(_, _, _, _, [], TempTable, NewTable):- reverse(TempTable, NewTable).

process_lines([A, B], [AX,AY], [BX, BY], Yi, [Line | OtherLines], TempTable, NewTable):-
	Yi\=AY, Yi\=BY, Y1 is Yi+1,
	process_lines([A, B], [AX,AY], [BX, BY], Y1, OtherLines, [Line | TempTable], NewTable).

process_lines([A, B], [AX,AY], [BX, BY], Yi, [Line | OtherLines], TempTable, NewTable):-
	Yi==AY, AY==BY, Y1 is Yi+1,
	process_line(A, AX, 0, Line, [], NewLine), process_line(B, BX, 0, NewLine, [], NewLine1),
process_lines([A, B], [AX,AY], [BX, BY], Y1, OtherLines, [NewLine1 | TempTable], NewTable).

process_lines([A, B], [AX,AY], [BX, BY], Yi, [Line | OtherLines], TempTable, NewTable):-
	Yi==AY, Y1 is Yi+1, process_line(A, AX, 0, Line, [], NewLine),
	process_lines([A, B], [AX,AY], [BX, BY], Y1, OtherLines, [NewLine | TempTable], NewTable).

process_lines([A, B], [AX,AY], [BX, BY], Yi, [Line | OtherLines], TempTable, NewTable):-
	Yi==BY, Y1 is Yi+1, process_line(B, BX, 0, Line, [], NewLine),
	process_lines([A, B], [AX,AY], [BX, BY], Y1, OtherLines, [NewLine | TempTable], NewTable).

process_line(_, _, _, [], TempLine, NewLine):- reverse(TempLine, NewLine).
	process_line(Domino, X, Xi, [ Piece | OtherPieces], TempLine, NewLine):-
	Xi\=X, X1 is Xi+1,
	process_line(Domino, X, X1, OtherPieces, [Piece | TempLine], NewLine).
process_line(Domino, X, Xi, [ _ | OtherPieces], TempLine, NewLine):-
	Xi==X, X1 is Xi+1,
	process_line(Domino, X, X1, OtherPieces, [Domino | TempLine], NewLine).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%           Save & restore game         %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

game_to_file(Table, XMax, YMax, Player1Name, Player2Name, Player1Dominoes, Player2Dominoes, Player1Type, Player2Type, AutoPlayerDifficulty):-
        open('savefile.txt', write, Str),
        write(Str, Table), write(Str,'.'), nl(Str),
        write(Str, XMax), write(Str,'.'), nl(Str),
        write(Str, YMax), write(Str,'.'), nl(Str),
        write(Str, Player1Name), write(Str, '.'), nl(Str),
        write(Str, Player2Name), write(Str, '.'), nl(Str),
        write(Str, Player1Dominoes), write(Str, '.'), nl(Str),
        write(Str, Player2Dominoes), write(Str, '.'), nl(Str),
        write(Str, Player1Type), write(Str, '.'), nl(Str),
        write(Str, Player2Type), write(Str, '.'), nl(Str),
        write(Str, AutoPlayerDifficulty), write(Str, '.'),
        close(Str).

game_from_file(Table, XMax, YMax, Player1Name, Player2Name, Player1Dominoes, Player2Dominoes, Player1Type, Player2Type, AutoPlayerDifficulty):-
        open('savefile.txt', read, Str),
        read(Str, Table),
        read(Str, XMax),
        read(Str, YMax),
        read(Str, Player1Name),
        read(Str, Player2Name),
        read(Str, Player1Dominoes),
        read(Str, Player2Dominoes),
        read(Str, Player1Type),
        read(Str, Player2Type),
        read(Str, AutoPlayerDifficulty),
        close(Str).

game_to_file(Table, XMax, YMax, Player1Name, Player2Name, Player3Name, Player4Name, Player1Dominoes, Player2Dominoes, Player3Dominoes, Player4Dominoes, Player1Type, Player2Type, Player3Type, Player4Type, Diff1, Diff2, Diff3, Diff4):-
        open('savefilefourplayer.txt', write, Str),
        write(Str, Table), write(Str,'.'), nl(Str),
        write(Str, XMax), write(Str,'.'), nl(Str),
        write(Str, YMax), write(Str,'.'), nl(Str),
        write(Str, Player1Name), write(Str, '.'), nl(Str),
        write(Str, Player2Name), write(Str, '.'), nl(Str),
        write(Str, Player3Name), write(Str, '.'), nl(Str),
        write(Str, Player4Name), write(Str, '.'), nl(Str),
        write(Str, Player1Dominoes), write(Str, '.'), nl(Str),
        write(Str, Player2Dominoes), write(Str, '.'), nl(Str),
        write(Str, Player3Dominoes), write(Str, '.'), nl(Str),
        write(Str, Player4Dominoes), write(Str, '.'), nl(Str),
        write(Str, Player1Type), write(Str, '.'), nl(Str),
        write(Str, Player2Type), write(Str, '.'), nl(Str),
        write(Str, Player3Type), write(Str, '.'), nl(Str),
        write(Str, Player4Type), write(Str, '.'), nl(Str),
        write(Str, Diff1), write(Str, '.'), nl(Str),
        write(Str, Diff2), write(Str, '.'), nl(Str),
        write(Str, Diff3), write(Str, '.'), nl(Str),
        write(Str, Diff4), write(Str, '.'),
        close(Str).

game_from_file(Table, XMax, YMax, Player1Name, Player2Name, Player3Name, Player4Name, Player1Dominoes, Player2Dominoes, Player3Dominoes, Player4Dominoes, Player1Type, Player2Type, Player3Type, Player4Type, Diff1, Diff2, Diff3, Diff4):-
        open('savefilefourplayer.txt', read, Str),
        read(Str, Table),
        read(Str, XMax),
        read(Str, YMax),
        read(Str, Player1Name),
        read(Str, Player2Name),
        read(Str, Player3Name),
        read(Str, Player4Name),
        read(Str, Player1Dominoes),
        read(Str, Player2Dominoes),
        read(Str, Player3Dominoes),
        read(Str, Player4Dominoes),
        read(Str, Player1Type),
        read(Str, Player2Type),
        read(Str, Player3Type),
        read(Str, Player4Type),
        read(Str, Diff1),
        read(Str, Diff2),
        read(Str, Diff3),
        read(Str, Diff4),
        close(Str).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%			  		AUX		 		   	%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% update table size
set_table_size(X, Y):-
	retractall(table_size(_, _)),
	assertz(table_size(X, Y)).

% save player and its dominoes
save_player(Player, Dominoes):-
	retractall(player(Player, _)),
	assertz(player(Player, Dominoes)).

% determine next player
next_player(player2, player1, 2).
next_player(player1, player2, 2).
next_player(player1, player2, 4).
next_player(player2, player3, 4).
next_player(player3, player4, 4).
next_player(player4, player1, 4).

get_auto_player(APD):-
	type(player2, computer),
	difficulty(player2, APD), !.
get_auto_player(3).

set_auto_player(computer, APD):-
	set_difficulty(player2, APD), !.
set_auto_player(_, _).

set_difficulty(Player, Difficulty):-
	retractall(difficulty(Player, _)),
	assertz(difficulty(Player, Difficulty)).

save_game_state(Player-Table):-
	retractall(game_state(_, _)),
	assertz(game_state(Player-Table)).

save_player_type(Player, Type):-
	retractall(type(Player, _)),
	assertz(type(Player, Type)).

add_letter(NLetters):-
	NLetters>24,
	letters(L),
	generate_new_letter(Letter),
	append(L, [Letter], NewLetters),
	retractall(letters(_)),
	assertz(letters(NewLetters)), !.
add_letter(_).

set_num_players(X):-
	retractall(num_players( _)),
	assertz(num_players(X)).

generate_new_letter(Letter):-
	letters(L),
	length(L, NLetters),
	I is mod(NLetters,24),
	nth0(I, L, Letter1),
	atom_concat(Letter1, Letter1, Letter).

char_to_coordinate(Char, Coordinate):-
	letters(L), nth0(Coordinate, L, Char).

valid_coordinates([X, Y]):-
	table_size(XMax, YMax),
	X=<XMax, X>=0, Y=<YMax, Y>=0.


set_table(NewTable):-
	retractall(table(_)),
	asserta(table(NewTable)).

static_first_play(Domino-[Ax1, Ay1]-[Bx1, By1], Domino-[Ax2, Ay2]-[Bx2, By2]) :-
  DiffX is Ax1 - Bx1,
  DiffY is Ay1 - By1, !,
  find_orientation_x(DiffX, Ax2, Bx2),
  find_orientation_y(DiffY, Ay2, By2).

find_orientation_x(DiffX, Ax2, Bx2) :-
  DiffX < 0, !,
  Ax2 = 4, Bx2 = 5.
find_orientation_x(DiffX, Ax2, Bx2) :-
  DiffX = 0, !,
  Ax2 = 4, Bx2 = 4.
find_orientation_x(DiffX, Ax2, Bx2) :-
  DiffX > 0, !,
  Ax2 = 5, Bx2 = 4.

find_orientation_y(DiffY, Ay2, By2) :-
  DiffY < 0, !,
  Ay2 = 4, By2 = 5.
find_orientation_y(DiffY, Ay2, By2) :-
  DiffY = 0, !,
  Ay2 = 4, By2 = 4.
find_orientation_y(DiffY, Ay2, By2) :-
  DiffY > 0, !,
  Ay2 = 5, By2 = 4.
