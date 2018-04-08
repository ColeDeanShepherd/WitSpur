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
  reg a, b;
  wire out;
  half_adder UUT(.a(a), .b(b), .sum(sum), .carry(carry));
  
  initial begin
    // Let's use the built-in function "$monitor" to automatically print out
    // the values of our registers and the outputs of the module whenever they
    // change. We are using the built-in variable $time to indicate the number
    // of time unit that have passed. We are using format strings, preceded by
    // "%", to format our output. "%b" means binary, and "%0d" means...
    $monitor("Time=%0d a=%b b=%b carry=%b sum=%b", $time, a, b, carry, sum);
    
    a = 1'b0;
    b = 1'b0;

    #100 b = 1'b1;

    #100 a = 1'b1;
    b = 1'b0;
    
    #100 b = 1'b1;
    
    #100 $finish;
  end
endmodule