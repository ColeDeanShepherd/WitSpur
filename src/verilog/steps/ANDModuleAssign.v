module my_AND(
  input a,
  input b,
  output out
);
  // Now we implement the functionality of our module by outputting a AND b
  // with Verilog's "&" operator.
  assign out = a & b;
endmodule

/*
And our module is done! my_AND takes two input electrical signals "a" and "b",
feeds them through an AND gate, and outputs the resulting signal "out".
*/