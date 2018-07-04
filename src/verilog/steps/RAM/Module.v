module ram(
  input clock,
  input [7:0] address,
  output reg [7:0] data
);
  // array
  reg [7:0] memory[255:0];

  always @(posedge clock) begin
    // Async assign.
    data <= memory[address];
  end
endmodule