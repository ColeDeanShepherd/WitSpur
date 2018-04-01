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
  wire sum1, carry1;
  half_adder ha1(.a(a), .b(b), .sum(sum1), .carry(carry1));

  wire sum2, carry2;
  half_adder ha2(.a(c_in), .b(sum1), .sum(sum2), .carry(carry2));

  assign sum = sum2;
  assign carry = carry1 | carry2;
endmodule

// Now we start creating a test bench for the full adder module.
module full_adder_test_bench;
  // Create an instance of the full adder, connecting registers to its inputs
  // and wires to its outputs.
  reg a, b, c_in;
  wire sum, carry;
  full_adder uut(.a(a), .b(b), .c_in(c_in), .sum(sum), .carry(carry));
endmodule