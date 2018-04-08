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

Here we declare a test bench for the half-adder. A test bench is simply a
module designed to test the correctness of another module.
*/
module half_adder_test_bench;
endmodule