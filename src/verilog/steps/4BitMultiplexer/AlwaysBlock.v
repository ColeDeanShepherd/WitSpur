module mux4(
  input [3:0] in,
  input [1:0] select,
  output reg out
);
  /*
  Here we create an "always" block with a "*" for the sensitivity list.
  The "*" instructs Verilog to build the sensitivity list for you
  automatically, based on the contents of the "always" block.

  Using "always @(*)" whenever possible is a best practice because it prevents
  hard to debug errors caused by incorrect sensitivity lists. One important
  exception to this is when a module is waiting on the positive edge of a
  signal, such as a clock signal.
  */
  always @(*) begin
  end
endmodule