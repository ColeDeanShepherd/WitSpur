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
    $monitor ("%g\t %b   %b     %b", $time, clock, reset, out);	

    clock = 0;

    /*
    Here we set the reset signal to 1 to reset the counter's value to 0.
    
    Try setting the reset signal to 0 instead to see what happens. The counter
    always outputs "xxxx"! This is because Verilog registers have unknown values
    when they are initialized (denoted by x's for each bit), and incrementing
    an unknown value results in another unknown value. So, we must reset the
    counter before using it to initialize its output register.
    */
    reset = 1;

    // Wait for a few cycles of the clock so that the counter has time to reset.
    #15 reset = 0;

    /*
    Let the clock run for 200 time units, incrementing the counter.

    Note that the counter resets back to 4'b0000 at time 166 even though we
    don't activate the reset signal! This is because the counter tries to
    increment past the maximum value a 4-bit register can hold: 4'b1111. In
    Verilog, integers overflow, meaning they wrap around if an arithmetic
    operation results in a value outside the range of integers that a register
    can represent.

    As an exercise, try modifying the counter code to prevent overflow.
    */
    #200 $finish;
  end

  // Cycle the clock signal between 0 and 1 every 5 time units.
  // "~" is Verilog's bitwise "NOT" operator.
  always begin
    #5 clock = ~clock;
  end
endmodule