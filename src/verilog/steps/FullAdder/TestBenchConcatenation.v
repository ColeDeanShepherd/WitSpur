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

  initial begin
    $monitor("Time=%0d a=%b b=%b carry_in=%b sum=%b carry_out=%b", $time, a, b, carry_in, sum, carry_out);

    /*
    Now let's vary the full adder's inputs over time. Instead of changing the
    inputs individually after every time delay, we will change all three inputs
    at once with a Verilog construct called "concatenation" which lets
    engineers treat mutiple values, wires, and registers as a multi-bit bus.
    */

    // Use concatenation to set a to 0, b to 0, and carry_in to 0 at once.
    #10 {a, b, carry_in} = 3'b000;

    // Use concatenation to set a to 0, b to 0, and carry_in to 1 at once.
    #10 {a, b, carry_in} = 3'b001;

    // Use concatenation to set a to 0, b to 1, and carry_in to 0 at once.
    #10 {a, b, carry_in} = 3'b010;

    #10 {a, b, carry_in} = 3'b011;
    #10 {a, b, carry_in} = 3'b100;
    #10 {a, b, carry_in} = 3'b101;
    #10 {a, b, carry_in} = 3'b110;
    #10 {a, b, carry_in} = 3'b111;

    #10 $finish;
  end
endmodule

// And our test bench is complete!

module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule