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

  initial begin
    $monitor("Time=%0d a=%b b=%b c_in=%b sum=%b carry=%b", $time, a, b, c_in, sum, carry);

    /*
    Now let's vary the full adder's inputs over time. Instead of changing the
    inputs individually after every time delay, we will change all three inputs
    at once with a Verilog construct called "concatenation" which lets
    engineers treat mutiple values, wires, and registers as a multi-bit bus.
    */

    // Use concatenation to set a to 0, b to 0, and c_in to 0 at once.
    #10 {a, b, c_in} = 3'b000;

    // Use concatenation to set a to 0, b to 0, and c_in to 1 at once.
    #10 {a, b, c_in} = 3'b001;

    // Use concatenation to set a to 0, b to 1, and c_in to 0 at once.
    #10 {a, b, c_in} = 3'b010;

    #10 {a, b, c_in} = 3'b011;
    #10 {a, b, c_in} = 3'b100;
    #10 {a, b, c_in} = 3'b101;
    #10 {a, b, c_in} = 3'b110;
    #10 {a, b, c_in} = 3'b111;

    #10 $finish;
  end
endmodule

// And our test bench is complete!