module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule

module half_adder_test_bench;
  reg a, b;
  wire out;
  half_adder UUT(.a(a), .b(b), .sum(sum), .carry(carry));

  initial begin
    a = 1'b0;
    b = 1'b0;

    // Now let's change the inputs to our half adder over time.

    // Wait for 100 time units, then set register "b" to 1.
    #100 b = 1'b1;
    
    // Wait for 100 time units, then set register "a" to 1 and "b" to 0.
    #100 a = 1'b1;
    b = 1'b0;
    
    // Wait for 100 time units, then set register "b" to 1.
    #100 b = 1'b1;
  end
endmodule