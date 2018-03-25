module my_AND(
  input a,
  input b,
  output out
);
  assign out = a & b;
endmodule

module test_my_AND;
  reg a, b;
  wire out;

  my_AND m(.a(a), .b(b), .out(out));

  /*
  Now that we've created our module and hooked up its inputs and outputs, let's
  change the inputs over time.
  
  To run code in a test-bench when a Verilog program is started, we place it in
  an "initial" block. We denote the start of an initial block with the keywords
  "intial" and "begin", and we denote the end of an initial block with "end".
  */
  initial 
  begin
    // At the start of the program, set registers "a" and "b" = 0.
    // To denote a binary literal, type the number of bits (1 in this case),
    // then a "'", then "b" for binary, then the value in binary.
    a = 1'b0;
    b = 1'b0;

    // To wait for a specified amount of time before executing a statement,
    // precede the statement with "#" and then the number of time units.

    // Wait for 100 time units, then set register "a" to 1.
    #100 a = 1'b1;
    
    // Wait for 100 time units, then set register "b" to 1.
    #100 b = 1'b1;
    
    // Wait for 100 time units, then set register "a" to 0.
    #100 a = 1'b0;
  end
endmodule