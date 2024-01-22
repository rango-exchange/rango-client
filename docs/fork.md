# Fork

## How you can test release flow?

You need to add your [Github Token](https://github.com/settings/tokens) and set it as `PAT` in your fork's secrets.

for NPM:

- Create an NPM account and an organization. (I created @yeager-dev for example)
- Get a token from NPM and set it as `NPM_TOKEN` in our repo.
- Enable Github Actions on your fork.

_Note 1_: If you are a Rango developer, you can ask NPM token for `@yeager-dev` org.

For Crowdin:

After creating a Crowdin project, it has an ID (you can find it in right sidebar) and for accessing to API you will [need a token](https://crowdin.com/settings#api-key) as well.
Then, you need to set `CROWDIN_PERSONAL_TOKEN` and `CROWDIN_PROJECT_ID` in your secrets.
