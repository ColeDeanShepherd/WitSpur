module my_AND(
  input a,
  input b,
  output out
);
  assign out = a & b;
endmodule

module test_my_AND;
  /*
  my_AND has two inputs and one output, so let's create some registers and
  wires to hook it up to a test circuit.

  Registers are storage locations for values which we can change over time,
  whereas wires are simply a means of transporting a value from one place in
  a circuit to another.

  To test our AND module, we want to manually change its two inputs and
  ensure that its output is what we expect. So, to allow us to manually change
  the inputs over time we need to create two registers, and to allow us to
  observe the output of our module, we need to create a wire.
  */

  // Here we create two one-bit registers for our inputs: "a" and "b".
  // Note that we can declare multiple registers in one statement by separating
  // each register's name with a comma. 
  reg a, b;

  // Here we create a one-bit wire for our output.
  wire out;
endmodule