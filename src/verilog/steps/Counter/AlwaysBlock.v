module counter (
  input clock,
  input reset,
  output reg [3:0] out
);
  /*
  Here we create an "always" block. Unlike the "initial" blocks we have used
  in test benches which execute once when the program begins, "always" blocks
  run repeatedly throughout the program's lifetime.

  In this case, we also include a "sensitivity list" for the "always" block,
  denoted by "@(posedge clock)". Sensitivity lists specify which changes the
  "always" block should run in response to, restricting when the block is run.

  Here we want the "always" block to run whenever there is a positive edge
  (hence "posedge") in the clock signal. A "positive edge" is when the signal
  changes from 0 to 1.
  */
  always @(posedge clock) begin
  end
endmodule