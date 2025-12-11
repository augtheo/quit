{
  description = "A simple flake to provide npm";

  inputs = {
    # Specify the Nixpkgs source (using the unstable channel for a potentially newer npm)
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      # Use the system architecture (e.g., "x86_64-linux")
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      # Define a development shell
      devShells.${system}.default = pkgs.mkShell {
        # The packages available in the shell environment
        packages = [
          pkgs.nodejs
          # npm is bundled with the nodejs package, so we just include nodejs.
          # If you needed an older/specific npm or node, you'd look for those packages.
        ];

        # Set a shell hook to verify the versions when the shell starts
        shellHook = ''
          echo "Entering development shell with Node.js and npm."
          echo "Node version: $(node -v)"
          echo "npm version: $(npm -v)"
        '';
      };
    };
}
