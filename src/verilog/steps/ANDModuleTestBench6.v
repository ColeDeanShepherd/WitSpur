// Here is the completed program. Try running it, and inspecting the output to
// see if it matches what you expect.
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
  
  initial begin
    $monitor("Time=%0d a=%b b=%b out1=%b", $time, a, b, out);
    
    a = 1'b0;
    b = 1'b0;

    #100 a = 1'b1;
    #100 b = 1'b1;
    #100 a = 1'b0;
    
    #100 $finish;
  end
endmodule