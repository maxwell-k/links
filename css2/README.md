_The following commands assume the directory containing this README is the
current working directory._

Command to configure this shell to use Fast Node Manager:
Node packages:

    eval "$(fnm env --shell zsh)" && fnm use

Command to update inline CSS in `../index.html`:

    ./main.ts

Commands to download latest `brands-extended.css` from `littlelink-extended`:

    rm brands-extended.css \
    && wcurl https://raw.githubusercontent.com/sethcottle/littlelink-extended/refs/heads/main/css/brands-extended.css
