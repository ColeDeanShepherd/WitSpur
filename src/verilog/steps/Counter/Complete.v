// Here is the complete counter module and test-bench.
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

module counter_test_bench;
  reg clock, reset;
  wire [3:0] out;
  counter U_counter(.clock(clock), .reset(reset), .out(out));

  // Initialize all variables
  initial begin        
    $display ("time\t clk reset counter");	
    $monitor ("%g\t %b   %b   %b", $time, clock, reset, out);	

    clock = 0;
    reset = 1;

    #15 reset = 0;

    #200 $finish;
  end

  always begin
    #5 clock = ~clock;
  end
endmodule