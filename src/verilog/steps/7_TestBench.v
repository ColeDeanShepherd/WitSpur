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

  initial
  begin
    // Let's use the built-in function "$monitor" to automatically print out
    // the values of our registers and the output of the module whenever they
    // change. We are using the built-in variable $time to indicate the number
    // of time unit that have passed. We are using format strings, preceded by
    // "%", to format our output. "%b" means binary, and "%0d" means...
    $monitor("Time=%0d a=%b b=%b out1=%b", $time, a, b, out);

    a = 1'b0;
    b = 1'b0;

    #100 a = 1'b1;
    #100 b = 1'b1;
    #100 a = 1'b0;
    
    // Wait for 100 time unit, then exit the program.
    #100 $finish;
  end
endmodule