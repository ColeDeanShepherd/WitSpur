/*
Now let's add the two 1-bit inputs "a" and "b", and the two 1-bit outputs
"sum" and "carry" to our module.
*/
module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
endmodule

/*
Note that we do not explicitly state that the inputs and outputs are 1-bit;
Verilog assumes that inputs and outputs are 1-bit unless we explicitly
specify their sizes, which we will learn how to do later.
*/