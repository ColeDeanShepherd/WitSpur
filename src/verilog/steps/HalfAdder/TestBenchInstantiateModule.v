module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule

module half_adder_test_bench;
  reg a, b;
  wire sum, carry;

  /*
  Now we create an instance of the "half_adder" module called "UUT", which
  stands for "unit under test", and connect our registers and wires to the
  module.
  
  To connect registers or wires to inputs or outputs of a module we use the
  following syntax: .<input/output name>(<register/wire name>)
  */
  half_adder UUT(.a(a), .b(b), .sum(sum), .carry(carry));
endmodule