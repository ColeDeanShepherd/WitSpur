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
  input c,
  output sum,
  output carry
);
  wire sum1, carry1;
  half_adder ha1(.a(a), .b(b), .sum(sum1), .carry(carry1));

  wire sum2, carry2;
  half_adder ha2(.a(c), .b(sum1), .sum(sum2), .carry(carry2));

  assign sum = sum2;
  assign carry = carry2 | carry1;
endmodule

module full_adder_test_bench;
  reg a, b, c;
  wire sum, carry;
  full_adder uut(.a(a), .b(b), .c(c), .sum(sum), .carry(carry));

  reg [3:0] i;

  initial begin
    $monitor("Time=%0d a=%b b=%b c=%b sum=%b carry=%b", $time, a, b, c, sum, carry);

    for(i = 0; i < 8; i = i + 1) begin
      #10 {a, b, c} = i;
    end

    #10 $finish;
  end
endmodule