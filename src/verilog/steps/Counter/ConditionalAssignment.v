module counter (
  input clock,
  input reset,
  output reg [3:0] out
);
  always @(posedge clock) begin
    // If the reset signal is 1 then set the counter's output to 0,
    // otherwise increment the counter's output by 1.
    if (reset) begin
      out = #1 0;
    end else begin
      out = #1 out + 1;
    end
  end
endmodule