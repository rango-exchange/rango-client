# Version Policy

## Overview

We follow semantic versioning, MAJOR.MINOR.PATCH:

- Breaking changes will be shipped with a new MAJOR version.
- New features will be shipped with a new MINOR version.
- Critical fixes will be shipped with a new PATCH version.

There are many packages that are publishing under `@rango-dev` scope, we are doing our best effort to not introducing breaking changes and following the semantic versioning for underlaying packages but there are no guarantee for that. what we are guarantee here is our primary package, `@rango-dev/widget-embedded`.

**NOTE:** Our 0.x.x version is also stable, we didn't have any breaking changes since the first release.

## Stable Releases

### What is a breaking change?

An incompatible behaviour or api change for `@rango-dev/widget-embedded` except those one that tagged as internal, we don't consider them as breaking change.


## Release Channels

### latest

`latest` is for our stable and production-ready version and will be published from `main` branch. we are publishing our release candidates under `next` release channel to ensure we have enough stability and reliability then will be released as `latest`.

We recommend to use the `latest` release channel (e.g. `0.55.1`).

### next

The `next` channel is our pre-release channel and it has a `next` tag in its version. also, it will be published from `next` branch (e.g. `0.55.1-next.2`).
However it includes new features, but you shouldn't use it in production enviroment since the feature needs some hardening usually to be production ready, so you may use it to test your app with upcoming features.


### experimental

There are some cases we don't want to merge a feature immediately in our pre-release channel (`next`) or production (`latest`), because sometimes there are big changes and should be measured with a/b testing or we are experimenting with the feature and using it internally to ensure we will deliver the right feature at its best shape for our users/library.
For these cases, we will use experimental channel to handle these types of features and releass. it will be merged into pre-release channel eventually.
We don't recommend to use experimental versions since they are less stable from `next` and `latest`, and may be removed entirely.

Note: When preparing an experimental release from your branch, ensure that its base is the main branch.
