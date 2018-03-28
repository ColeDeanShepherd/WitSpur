/*
Now let's implement the functionality of the half adder. This table specifies
a half adder's outputs for each possible input:

(inputs)    (outputs)    
a     b     carry   sum
=======================
0     0     0       0
0     1     0       1
1     0     0       1
1     1     1       0

Inspecting the table, we see that carry = a AND b, and sum = a XOR b.
The symbol for AND in Verilog is "&", and the symbol for XOR is "^".
Let's use this to assign the correct values to our half adder's outputs.
*/
module half_adder(
  input a,
  input b,
  output sum,
  output carry
);
  assign sum = a ^ b; // sum = a XOR b
  assign carry = a & b; // carry = a AND b
endmodule

// And we are done with our half adder!