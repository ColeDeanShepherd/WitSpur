module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule

/*
Now that we've defined our module "half_adder", let's use it!

Here we will declare another module called "test_half_adder" to test our
module "half_adder".
*/
module test_half_adder;
endmodule