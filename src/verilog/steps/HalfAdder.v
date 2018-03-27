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
  wire sum, carry;
  half_adder uut(.a(a), .b(b), .sum(sum), .carry(carry));

  //reg [2:0] i;
  integer i;

  initial begin
    $monitor("Time=%0d a=%b b=%b sum=%b carry=%b", $time, a, b, sum, carry);

    /*a = 0;
    b = 0;

    #10 b = 1;

    #10 a = 1;
    b = 0;

    #10 b = 1;*/

    /*{a, b} = 2'b00;
    #10 {a, b} = 2'b01;
    #10 {a, b} = 2'b10;
    #10 {a, b} = 2'b11;*/

    for(i = 0; i < 4; i = i + 1) begin
      #10 {a, b} = i;
    end

    #10 $finish;
  end
endmodule