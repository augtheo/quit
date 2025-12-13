{
  description = "Flake for quieres-fumar React App";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        # 1. The Package: Builds the React App for deployment
        packages.quieres-fumar = pkgs.buildNpmPackage {
          pname = "quieres-fumar";
          version = "0.1.0";
          src = self;

          # Run 'nix build', grab the hash from the error, and paste it here.
          # TODO: Use the same version of npm , node across dev and build environments
          npmDepsHash = "sha256-S386lsLbZshRYFbUoO5AJ648dAhZ5AOCWksF9dMMroc=";

          # Standard Vite build command
          buildPhase = ''
            runHook preBuild
            npm run build
            runHook postBuild
          '';

          # Install the 'dist' folder to the nix store
          installPhase = ''
            runHook preInstall
            mkdir -p $out/var/www
            cp -r build/ $out/var/www/quieres-fumar.augtheo.com
            runHook postInstall
          '';
        };

        defaultPackage = self.packages.${system}.quieres-fumar;
        # 2. The DevShell: For local development
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20 # Adjust Node version as needed (e.g., nodejs_18, nodejs_22)
          ];

          shellHook = ''
            echo "Environment ready for quieres-fumar!"
            echo "Node version: $(node --version)"
            echo "Run 'npm install' then 'npm run dev' to start."
          '';
        };
      });
}
