// Multi-line comments begin with "/*" and end with "*/".

/*
This is a multi-line comment. Multi-line comments can span multiple lines,
which is great detailed documentation or temporarily diabling large blocks
of code.
*/

// Unfortuately, multi-line comments cannot be nested in Verilog.
// So, this is not allowed: "/* This is /* a = nested */ comment! */"

// This is problematic when trying to comment out large blocks of code that
// contain multi-line comments.