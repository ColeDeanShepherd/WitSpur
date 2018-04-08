module ripple_carry_adder_4_bit(
  input [3:0] a,
  input [3:0] b,
  input carry_in,
  output [3:0] out,
  output carry_out
);
  // Start creating the 4 full-adders.
  // Input & output connections haven't been made yet.
  wire sum1, carry1;
  full_adder fa1(.a(), .b(), .carry_in(), .sum(), .carry_out());
  
  wire sum2, carry2;
  full_adder fa2(.a(), .b(), .carry_in(), .sum(), .carry_out());
  
  wire sum3, carry3;
  full_adder fa3(.a(), .b(), .carry_in(), .sum(), .carry_out());
  
  wire sum4, carry4;
  full_adder fa4(.a(), .b(), .carry_in(), .sum(), .carry_out());
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