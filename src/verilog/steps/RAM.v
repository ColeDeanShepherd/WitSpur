module ram(input clock, input [7:0] address, output reg [7:0] data);
  // Storage medium, using Verilog syntax for arrays
  reg [7:0] memory[255:0];

  always @(posedge clock) begin
    data <= memory[address];
  end
endmodule