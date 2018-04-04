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
  // Now we connect the full adder's inputs to our half adders and connect the
  // two half adders together.

  wire sum1, carry1;
  // Inputs "a" and "b" are routed to the inputs of the first half adder.
  half_adder ha1(.a(a), .b(b), .sum(sum1), .carry(carry1));

  wire sum2, carry2;
  // Input "carry_in" and the sum output of the first half adder "sum1" are routed
  // to the inputs of the second half adder.
  half_adder ha2(.a(carry_in), .b(sum1), .sum(sum2), .carry(carry2));
endmodule