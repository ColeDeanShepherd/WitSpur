/*
Now we will build a full-adder: a module which takes three 1-bit input signals
"a", "b", and an input carry bit named "c_in", and outputs a "sum" bit and a
"carry" bit.

Full adders can be built from two half adders, so we will reuse the half adder
module we have already created.
*/
module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule

// Creating an empty "full_adder" module.
module full_adder;
endmodule