_The following commands assume the directory containing this README is the
current working directory._

Command to setup this shell to use Fast Node Manager and install the required
Node packages:

    eval "$(fnm env --shell zsh)" && fnm use

Command to generate CSS bundle:

    node main.ts

Command to download latest `brands-extended.css` from `littlelink-extended`:

    wcurl https://raw.githubusercontent.com/sethcottle/littlelink-extended/refs/heads/main/css/brands-extended.css
