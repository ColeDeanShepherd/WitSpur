/*
Now we will build a 4-bit ripple-carry adder: a module which takes two 4-bit
input signals "a" and "b", and a 1-bit carry input, and outputs a 4-bit sum
and a carry bit.

Ripple-carry adders are built with 4 full-adders in series, with each carry bit
"rippling" to the next full-adder in the series.
*/

// Creating an empty module.
module ripple_carry_adder_4_bit;
endmodule

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
  wire sum1, carry1;
  half_adder ha1(.a(a), .b(b), .sum(sum1), .carry(carry1));

  wire sum2, carry2;
  half_adder ha2(.a(carry_in), .b(sum1), .sum(sum2), .carry(carry2));

  assign sum = sum2;
  assign carry_out = carry1 | carry2;
endmodule