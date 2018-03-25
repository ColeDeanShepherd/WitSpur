/*
Modules are the basic building block in Verilog. You can think of modules as
reusable electronic chips with inputs and outputs that you can connect together
to build complex electronic circuits.

Modules are hierarchical; they can be built out of other modules, which can
in turn be built out of other modules themselves, and so on. This allows you
to gradually build up complexity by repeatedly combining simpler modules to
form more complex modules until the final electronic circuit is built.

For example, a "computer" module might contain "CPU" modules (and other
modules for RAM, GPUs, etc.), which in turn contain "ALU" modules,
which contain "adder" modules, and so on.
*/