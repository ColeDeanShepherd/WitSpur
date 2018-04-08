module ripple_carry_adder_4_bit(
  // To create multi-bit inputs, outputs, wires, and registers, use the syntax:
  // [<high order bit index>:<low order bit index>]
  input [3:0] a, // create a 4-bit input "a"
  input [3:0] b, // create a 4-bit input "b"
  input carry_in,
  output [3:0] out, // create a 4-bit output "out"
  output carry_out
);
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