module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule

module full_adder(
  input a,
  input b,
  input c_in,
  output sum,
  output carry
);
  wire sum1, carry1;
  half_adder ha1(.a(a), .b(b), .sum(sum1), .carry(carry1));

  wire sum2, carry2;
  half_adder ha2(.a(c_in), .b(sum1), .sum(sum2), .carry(carry2));

  assign sum = sum2;
  assign carry = carry1 | carry2;
endmodule

module full_adder_test_bench;
  reg a, b, c_in;
  wire sum, carry;
  full_adder uut(.a(a), .b(b), .c_in(c_in), .sum(sum), .carry(carry));
  
  // Add an initial block which monitors the full adder's inputs and outputs,
  // and exits after 10 time units.
  initial begin
    $monitor("Time=%0d a=%b b=%b c_in=%b sum=%b carry=%b", $time, a, b, c_in, sum, carry);

    #10 $finish;
  end
endmodule