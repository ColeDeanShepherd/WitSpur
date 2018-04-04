module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule

// Adding the inputs and outputs.
module full_adder(
  input a,
  input b,
  input carry_in,
  output sum,
  output carry_out
);
endmodule