module full_adder(
  input a,
  input b,
  input carry_in,
  output sum,
  output carry_out
);
  wire sum1, carry1;
  half_adder ha1(.a(a), .b(b), .sum(sum1), .carry(carry1));

  wire sum2, carry2;
  half_adder ha2(.a(carry_in), .b(sum1), .sum(sum2), .carry(carry2));

  // Now we implement the outputs of the full adder:
  // sum = sum output of the half adder 2
  assign sum = sum2;
  // carry = (carry output of half adder 1) OR (carry output of half adder 2)
  assign carry_out = carry1 | carry2;
endmodule

// The full adder is done!

module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule