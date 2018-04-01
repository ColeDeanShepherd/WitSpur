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
  input c_in,
  output sum,
  output carry
);
endmodule