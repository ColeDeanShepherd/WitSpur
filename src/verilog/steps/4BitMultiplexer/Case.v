module mux4(
  input [3:0] in,
  input [1:0] select,
  output reg out
);
  always @(*) begin
    // Here we use "case" to assign different values to "out" depending on the
    // value of "select".
    case (select)
      0: out = in[0];
      1: out = in[1];
      2: out = in[2];
      3: out = in[3];
    endcase
  end
endmodule