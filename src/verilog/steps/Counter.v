module first_counter (
  input wire clock,
  input wire reset,
  input wire enable,
  output reg [3:0] counter_out
);
  always @(posedge clock)
  begin
    if (reset == 1'b1)
    begin
      counter_out <= #1 4'b0000;
    end
    else if (enable == 1'b1)
    begin
      counter_out <= #1 counter_out + 1;
    end
  end
endmodule

module first_counter_tb;
  reg clock, reset, enable;
  wire [3:0] out;

  // Initialize all variables
  initial
  begin        
    $display ("time\t clk reset enable counter");	
    $monitor ("%g\t %b   %b   %b   %b", $time, clock, reset, enable, out);	
    clock = 1;
    reset = 0;
    enable = 0;
    #5 reset = 1;
    #10 reset = 0;
    #10 enable = 1;
    #100 enable = 0; 
    #5 $finish;
  end

  always
  begin
    #5 clock = ~clock;
  end

  first_counter U_counter(
    clock,
    reset,
    enable,
    out
  );
  endmodule