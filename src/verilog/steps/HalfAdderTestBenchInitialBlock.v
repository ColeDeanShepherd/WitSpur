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

  /*
  Now that we've created our module and hooked up its inputs and outputs, let's
  change the inputs over time.
  
  To run code in a test-bench when a Verilog program is started, we place it in
  an "initial" block.
  */
  initial begin
  end
endmodule