module full_adder(
  input a,
  input b,
  input carry_in,
  output sum,
  output carry_out
);
  wire sum1, carry1;
  half_adder ha1(.a(a), .b(b), .sum(sum1), .carry(carry1));

  wire sum2, carry2;
  half_adder ha2(.a(carry_in), .b(sum1), .sum(sum2), .carry(carry2));

  assign sum = sum2;
  assign carry_out = carry1 | carry2;
endmodule

module full_adder_test_bench;
  reg a, b, carry_in;
  wire sum, carry_out;
  full_adder uut(.a(a), .b(b), .carry_in(carry_in), .sum(sum), .carry_out(carry_out));
  
  // Add an initial block which monitors the full adder's inputs and outputs,
  // and exits after 10 time units.
  initial begin
    $monitor("Time=%0d a=%b b=%b carry_in=%b sum=%b carry_out=%b", $time, a, b, carry_in, sum, carry_out);

    #10 $finish;
  end
endmodule

module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule