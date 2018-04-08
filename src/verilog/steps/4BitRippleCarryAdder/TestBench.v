module ripple_carry_adder_4_bit(
  input [3:0] a,
  input [3:0] b,
  input carry_in,
  output [3:0] out,
  output carry_out
);
  wire sum1, carry1;
  full_adder fa1(.a(a[0]), .b(b[0]), .carry_in(carry_in), .sum(sum1), .carry_out(carry1));
  
  wire sum2, carry2;
  full_adder fa2(.a(a[1]), .b(b[1]), .carry_in(carry1), .sum(sum2), .carry_out(carry2));
  
  wire sum3, carry3;
  full_adder fa3(.a(a[2]), .b(b[2]), .carry_in(carry2), .sum(sum3), .carry_out(carry3));
  
  wire sum4, carry4;
  full_adder fa4(.a(a[3]), .b(b[3]), .carry_in(carry3), .sum(sum4), .carry_out(carry4));

  assign out = {sum4, sum3, sum2, sum1};
  assign carry_out = carry4;
endmodule

// Now we add the test bench.
module ripple_carry_adder_4_bit_test_bench;
  reg [3:0] a;
  reg [3:0] b;
  reg carry_in;
  wire [3:0] out;
  wire carry_out;
  ripple_carry_adder_4_bit uut(.a(a), .b(b), .carry_in(carry_in), .out(out), .carry_out(carry_out));

  integer i, j, k;

  initial begin
    $monitor("Time=%0d a=%b b=%b carry_in=%b sum=%b carry_out=%b", $time, a, b, carry_in, out, carry_out);

    // Here we use two nested for-loops, one for each of the ripple-carry
    // adder's inputs, to iterate through all possible inputs when carry_in = 0.
    for(k = 0; k <= 1'b1; k = k + 1) begin
      for(i = 0; i <= 4'b1111; i = i + 1) begin
        for(j = 0; j <= 4'b1111; j = j + 1) begin
          /*
          Because the concatenation of a, b, and carry_in is 9 bits
          (4 + 4 + 1) but i, j, and k are 32-bit integers, we need to
          concatenate a subset of i, j, and k's bits to get the assignment
          to work.

          To select a subset of bits from a multi-bit value, use the syntax:
          <multi-bit value>[<highest bit index>:<lowest bit index>]

          So, i[3:0] selects the 4 lowest-order bits of i.
          */
          #10 {a, b, carry_in} = {i[3:0], j[3:0], k[0]};
        end
      end
    end

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