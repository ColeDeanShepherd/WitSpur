/*
Modules are the basic building block in Verilog. Modules can be thought of as
reusable electronic chips with inputs and outputs that can be connected
together to build complex electronic circuits.

 inputs               outputs
          __________
         |          |
-------->|          |
         |          |-------->
-------->|  Module  |
         |          |-------->
-------->|          |
         |__________|

Modules are hierarchical; they can be built out of other modules, which can
in turn be built out of other modules themselves, and so on. This allows
engineers to gradually build up complexity by repeatedly combining simpler
modules to form more complex modules until a final electronic circuit is built.
*/