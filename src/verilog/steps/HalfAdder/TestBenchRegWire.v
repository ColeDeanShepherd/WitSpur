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
  /*
  half_adder has two inputs and two outputs, so let's create some registers and
  wires to hook it up to a test circuit.

  Registers are storage locations for values which we can change over time,
  and wires are simply a means of transporting a value from one place in
  a circuit to another.

  To test our module, we will manually change its two inputs and ensure that
  its outputs are what we expect. To allow us to manually change the inputs
  over time we need to create two registers, and to allow us to observe the
  outputs of our module, we need to create two wires.
  */

  // Create two one-bit registers for our inputs "a" and "b".
  reg a, b;

  // Create two one-bit wires for our outputs "sum" and "carry".
  wire sum, carry;
endmodule