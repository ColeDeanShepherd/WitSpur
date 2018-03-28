/*
Here is the completed program. Try running it and inspecting the output to
verify that our half adder is working correctly.
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

module test_half_adder;
  reg a, b;
  wire out;
  half_adder UUT(.a(a), .b(b), .sum(sum), .carry(carry));
  
  initial begin
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