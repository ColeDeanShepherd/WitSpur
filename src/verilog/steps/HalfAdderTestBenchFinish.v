module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule

module test_half_adder;
  reg a, b;
  wire out;
  half_adder UUT(.a(a), .b(b), .sum(sum), .carry(carry));

  initial begin
    a = 1'b0;
    b = 1'b0;
    
    #100 b = 1'b1;
    
    #100 a = 1'b1;
    b = 1'b0;
    
    #100 b = 1'b1;
    
    // Now let's wait for 100 time units, then exit the program and pass
    // control back to the operating system we're running the simulation on.
    #100 $finish;
  end
endmodule