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
  input carry_in,
  output sum,
  output carry_out
);
  // Creating & connecting wires for the half adder outputs.
  wire sum1, carry1;
  half_adder ha1(.a(), .b(), .sum(sum1), .carry(carry1));

  wire sum2, carry2;
  half_adder ha2(.a(), .b(), .sum(sum2), .carry(carry2));
endmodule