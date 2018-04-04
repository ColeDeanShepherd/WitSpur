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

module ripple_carry_adder_4_bit(
  input [3:0] a,
  input [3:0] b,
  input carry_in,
  output [3:0] out,
  output carry_out
);
  /*
  The full adders have 1-bit inputs & outputs, so we must specify which bits
  of the ripple carry adder's inputs and outputs we are connecting to the
  full adders.

  To do this, use the syntax: <multi-bit value>[<bit index>]

  So, ".a(a[0])" connects the lowest bit of the 4-bit ripple carry adder input
  "a" to the 1-bit full adder input "a".
  */

  wire sum1, carry1;
  full_adder fa1(.a(a[0]), .b(b[1]), .carry_in(carry_in), .sum(sum1), .carry_out(carry1));
  
  wire sum2, carry2;
  full_adder fa2(.a(a[1]), .b(b[2]), .carry_in(carry1), .sum(sum2), .carry_out(carry2));
  
  wire sum3, carry3;
  full_adder fa3(.a(a[2]), .b(b[3]), .carry_in(carry2), .sum(sum3), .carry_out(carry3));
  
  wire sum4, carry4;
  full_adder fa4(.a(a[3]), .b(b[0]), .carry_in(carry3), .sum(sum4), .carry_out(carry4));
endmodule