module my_AND(
  input a,
  input b,
  output out
);
  assign out = a & b;
endmodule

/*
Now that we've defined our module "my_AND", let's use it!

Here we will declare another module called "test_my_AND" to test our
module "my_AND".
*/
module test_my_AND;
endmodule