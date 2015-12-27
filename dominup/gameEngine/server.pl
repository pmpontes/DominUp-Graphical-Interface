:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).
%:-include('dominup.pl').
:- consult(dominup).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),

		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),

		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),

		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.

close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),

	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),

	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).

read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

%parse_input(FunctionCall(Args), Result) :- FunctionCall(Args, Result).

%start game
parse_input(playerPlayer, [0, Table,D1,D2]):- player_player(Table), set_table(Table), player(player1, D1), player(player2, D2).
parse_input(playerComputer(Level), [0, Table,D1,D2]):- player_computer(Table), set_table(Table), player(player1, D1), player(player2, D2), set_difficulty(player2, Level).
parse_input(computerComputer(Level1,Level2), [0, Table,D1,D2]):- computer_computer(Table), set_table(Table), player(player1, D1), player(player2, D2), set_difficulty(player1, Level1), set_difficulty(player2, Level2).
parse_input(getTable, Table):- table(Table).
parse_input(set_difficulty(Player, Difficulty), ok):- set_difficulty(Player, Difficulty).

%get player info
parse_input(getPlayerDominoes(Player), Dominoes):- player(Player, Dominoes).
parse_input(getNextPlayer(CurPlayer), NextPlayer):- get_next_player(CurPlayer, NextPlayer).

%make moves
parse_input(makeMove(Player), [1, [Domino,[AX,AY],[BX, BY]],D1,D2]):- table(Table), make_move(Player, Table, NewTable, Domino-[AX,AY]-[BX, BY]), set_table(NewTable), player(player1, D1), player(player2, D2).
parse_input(makeMove(Player, Domino-[AX,AY]-[BX, BY]), [1, [Domino,[AX,AY],[BX, BY]],D1,D2]):- table(Table), make_move(Player, Domino-[AX,AY]-[BX, BY], Table, NewTable), set_table(NewTable),
																																																player(player1, D1), player(player2, D2).
parse_input(listExpansionPlays(Player), Moves):- player(Player, Dominoes), table(Table), list_expansion_plays(Dominoes, Table, Moves).
parse_input(listVerticalPlays(Player), Moves):- player(Player, Dominoes), table(Table), list_vertical_plays(Dominoes, Table, Moves).

%restore game state TODO check restore game state
parse_input(Table-XMax-YMax-P1Name-P2Name-P1Dom-P2Dom-P1Type-P2Type, ok) :- set_table_from_data(Table,XMax,YMax,P1Name,P2Name,P1Dom,P2Dom,P1Type,P2Type).



parse_input(quit, goodbye).
parse_input(teste, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
