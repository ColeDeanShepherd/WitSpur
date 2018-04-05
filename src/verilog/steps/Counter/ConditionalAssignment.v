module counter (
  input clock,
  input reset,
  output reg [3:0] out
);
  always @(posedge clock) begin
    if (reset) begin
      out = #1 0;
    end else begin
      out = #1 out + 1;
    end
  end
endmodule