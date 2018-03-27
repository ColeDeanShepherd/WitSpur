module my_AND(
  input a,
  input b,
  output out
);
  assign out = a & b;
endmodule

module test_my_AND;
  reg a, b;
  wire out;

  // Now we create an instance of the "my_AND" module called "m", and connect
  // our registers and wire to the module. To connect registers or wires to
  // inputs or outputs of a module, type a ".", followed by the name of the
  // input or output in the module, followed by the name of the register/wire
  // we wish to connect to the input/output port surrounded by parenthesis.
  my_AND m(.a(a), .b(b), .out(out));
endmodule