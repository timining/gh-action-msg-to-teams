# GitHub Action - Message to teams

Generic Github Action to send notifications through Microsoft Teams

## Inputs

### `webhook-url`

**Required** URL del webhook de Microsoft Teams.

### `title`

**Required** Message title.

### `subtitle`

**Required** Message subtitle.

### `summary`

**Optional** Message summary.

### `facts`

**Optional** Extra information. It must be a json string (title/value).

```json
[{"title": "who rocks?", "value": "DevOps"}]
```

## Example usage

```yaml
- name: Send notification to Teams
  uses: timining/gh-action-msg-to-teams@master
  with:
    webhook-url: ${{ secrets.MS_TEAMS_WEBHOOK_URI }}
    title: '🎉 A new release!'
    summary: 'This is a test. ✅ - ❌'
    subtitle: 'v1.0'
    facts: '[{ "title": "version", "value": "2022-06" }, { "title": "thanks to", "value": "devops" }]'
```

## node_modules

node_modules is required [link](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github)
