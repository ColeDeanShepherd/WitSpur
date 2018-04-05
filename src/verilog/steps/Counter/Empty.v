// We will create a 4-bit counter: a module which increments a 4-bit output
// every clock cycle.
module counter (
  // A periodic binary signal which increments the counter every time it
  // changes from a 0 to a 1.
  input clock,
  // When reset is 1, the counter resets to 0.
  input reset,
  // The 4-bit value of the counter. "reg" indicates that the output is a
  // register, not a wire. This allows us to manually change the output
  // based on conditional logic (if/else, case, etc.) instead of making a
  // continuous assignment (assign wireName = value;).
  output reg [3:0] out
);
endmodule