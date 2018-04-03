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

module ripple_carry_adder_4_bit(
  input [3:0] a,
  input [3:0] b,
  input c_in,
  output [3:0] out,
  output c_out
);
  wire sum1, carry1;
  full_adder fa1(.a(a[0]), .b(b[1]), .c_in(c_in), .sum(sum1), .carry(carry1));
  
  wire sum2, carry2;
  full_adder fa2(.a(a[1]), .b(b[2]), .c_in(carry1), .sum(sum2), .carry(carry2));
  
  wire sum3, carry3;
  full_adder fa3(.a(a[2]), .b(b[3]), .c_in(carry2), .sum(sum3), .carry(carry3));
  
  wire sum4, carry4;
  full_adder fa4(.a(a[3]), .b(b[0]), .c_in(carry3), .sum(sum4), .carry(carry4));

  assign out = {sum4, sum3, sum2, sum1};
  assign c_out = carry4;
endmodule

module full_adder_test_bench;
  reg [3:0] a;
  reg [3:0] b;
  reg c_in;
  wire [3:0] out;
  wire c_out;
  ripple_carry_adder_4_bit uut(.a(a), .b(b), .c_in(c_in), .out(out), .c_out(c_out));

  integer i, j;

  initial begin
    $monitor("Time=%0d a=%b b=%b c_in=%b sum=%b carry=%b", $time, a, b, c_in, out, c_out);

    for(i = 0; i <= 4'b1111; i = i + 1) begin
      for(j = 0; j <= 4'b1111; j = j + 1) begin
        #10 {a, b, c_in} = {i[3:0], j[3:0], 1'b0};
      end
    end

    #10 $finish;
  end
endmodule