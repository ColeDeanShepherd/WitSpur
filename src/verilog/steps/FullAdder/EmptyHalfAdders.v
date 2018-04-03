module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule

module full_adder(
  input a,
  input b,
  input c_in,
  output sum,
  output carry
);
  /*
  Starting to instantiate our two half adders "ha1" and "ha2".
  We still need to make all the connections between the inputs
  and outputs of the full adder and its two half adders.
  */
  half_adder ha1(.a(), .b(), .sum(), .carry());
  half_adder ha2(.a(), .b(), .sum(), .carry());
endmodule