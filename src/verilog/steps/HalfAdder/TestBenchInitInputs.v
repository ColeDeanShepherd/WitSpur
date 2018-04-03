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
    /*
    At the start of the program, set registers "a" and "b" to 0.
    To denote a binary literal, use the syntax:
    <# of bits>'b<binary value>
    */
    a = 1'b0;
    b = 1'b0;
  end
endmodule