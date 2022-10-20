const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');


async function handleWorkflow() {
  try {
    // Inputs
    const webhookUrl = core.getInput('webhook-url', { required: true, trimWhitespace: true });
    const summary = core.getInput('summary', { required: true });
    const title = core.getInput('title', { required: true });
    const subtitle = core.getInput('subtitle', { required: false });
    const facts = core.getInput('facts', { required: false });
  
    // Set secrets
    core.setSecret(webhookUrl);
  
    // payload data (https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#push)
    const payload = github.context.payload
    const sender = payload.sender?.login || 'unknown user login name';
    const avatar = payload.sender?.avatar_url || null;
  
    const body = handleAdaptiveCard(title, subtitle, sender, avatar, summary, facts);
  
    // Call Microsoft Teams Webhook
    await callWebhook(webhookUrl, body);
  } catch (error) {
    core.setFailed(error.message);
  }
}

function handleAdaptiveCard(title, subtitle, userName, userAvatar, summary, facts) {
  return {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: "1.0",
          body: [
            {
              type: 'Container',
              items: [
                {
                  type: 'TextBlock',
                  text: title,
                  weight: 'bolder',
                  size: 'medium'
                },
                {
                  'type': 'ColumnSet',
                  'columns': [
                    {
                      type: 'Column',
                      width: 'auto',
                      items: [
                        {
                          type: 'Image',
                          url: userAvatar,
                          size: 'small',
                          style: 'person'
                        }
                      ]
                    },
                    {
                      type: 'Column',
                      width: 'stretch',
                      items: [
                        {
                          type: 'TextBlock',
                          text: userName,
                          weight: 'bolder',
                          wrap: true
                        },
                        {
                          type: 'TextBlock',
                          spacing: 'none',
                          text: subtitle,
                          isSubtle: true,
                          wrap: true
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'Container',
              items: [
                {
                  type: 'TextBlock',
                  text: summary,
                  wrap: true
                },
                {
                  type: 'FactSet',
                  facts: JSON.parse(facts)
                }
              ]
            }
          ]
        }
      }
    ]
  };
}

async function callWebhook(webhookUrl, body) {
  let res = await axios({
    url: webhookUrl,
    method: 'post',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  })

  if(res.status !== 200){
    throw Error('Webhook Error response');
  }
}

handleWorkflow();