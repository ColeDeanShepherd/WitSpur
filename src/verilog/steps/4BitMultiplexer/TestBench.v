module mux4(
  input [3:0] in,
  input [1:0] select,
  output reg out
);
  always @(*) begin
    case (select)
      0: out = in[0];
      1: out = in[1];
      2: out = in[2];
      3: out = in[3];
    endcase
  end
endmodule

module mux4_test_bench;
  reg [3:0] in;
  reg [1:0] select;
  wire out;
  mux4 uut(.in(in), .select(select), .out(out));

  integer i;

  initial begin
    $monitor("Time=%0d in=%b select=%b out=%b", $time, in, select, out);

    in = 4'b0110;

    for(i = 0; i < 4; i = i + 1) begin
      #10 select = i;
    end

    #10 $finish;
  end
endmodule