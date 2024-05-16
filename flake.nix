{
  description = "Gilde der Nacht: Development environment";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, flake-utils, ... }: flake-utils.lib.eachDefaultSystem
    (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            yarn
            just
            emmet-ls
            marksman
            markdown-oxide
            nodePackages."@astrojs/language-server"
          ];
        };
      }
    );
}
