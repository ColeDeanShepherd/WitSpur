/*
Let's build a simple module which take two one-bit inputs, performs the "AND"
operation on the inputs, and outputs the resulting value.
*/

/*
Modules begin with "module", followed by a user-specified name, and a
comma-separated list of inputs and outputs surrounded by parenthesis
and punctuated with a ";".

Here we begin the specification of a module named "my_AND" with two one-bit
inputs "a" and "b" and one output "out".
*/
module my_AND(
  input a,
  input b,
  output out
);
  /*
  This follows with the body of the module, which defines what the module does.
  In this case, the module simply assigns (denoted by "assign out = ") the
  result of the AND operation applied to the two inputs (denoted by "a & b").
  This statement is then terminated with a ";", as all statements must be in
  Verilog.
  */
  assign out = a & b;
endmodule // Lastly, we end the specification of the module with "endmodule".