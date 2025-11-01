_The following commands assume the directory containing this README is the
current working directory._

Command to configure this shell to use Fast Node Manager:

    eval "$(fnm env --shell zsh)" && fnm use

Command to install Node packages:

    npm ci

Command to update inline CSS in `../index.html`:

    ./main.ts

Command to download the latest `brands-extended.css` from `littlelink-extended`:

    wcurl --curl-options=--clobber https://raw.githubusercontent.com/sethcottle/littlelink-extended/refs/heads/main/css/brands-extended.css
