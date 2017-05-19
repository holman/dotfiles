FROM alpine:3.4

MAINTAINER Derek M. Frank <derekmfrank at gmail dot com>

USER root

# Install dependencies.
RUN apk update && apk add \
    bash \
    git \
    zsh

# Add user.
ENV HOME "/home/dot"
ENV SHELL "/bin/zsh"
ENV USER dot
RUN adduser -h $HOME -s "$SHELL" -S -D "$USER"

# Setup app.
ENV DOTFILES "$HOME/.dotfiles"
WORKDIR "$DOTFILES"
COPY . "$DOTFILES"
RUN chown -R "$USER" "$DOTFILES"

USER "$USER"
ENTRYPOINT ["./test/entrypoint.sh"]
CMD ["docker"]
