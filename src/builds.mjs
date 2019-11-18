/* global vegaEmbed */

function getBuilds(repo, href = `/repo/${encodeURIComponent(repo)}/builds?limit=100`, builds = []) {
  return fetch(`https://api.travis-ci.com${href}`, {
    headers: { 'Travis-API-Version': '3' },
  })
    .then((r) => r.json())
    .then((data) => {
      const newBuilds = builds.concat(data.builds);
      if (data['@pagination'].next) {
        return getBuilds(repo, data['@pagination'].next['@href'], newBuilds);
      }
      return newBuilds;
    });
}

const schema = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'width': 1000,
  'height': 400,
  'mark': 'point',
  'data': {
    'name': 'table',
    'values': null,
  },
  'selection': {
    'grid': {
      'type': 'interval',
      'bind': 'scales',
    },
  },
  'encoding': {
    'y': {
      'field': 'duration',
      'type': 'quantitative',
      'axis': {
        'title': 'Duration (minutes)',
      },
    },
    'x': {
      'field': 'finished_at',
      'timeUnit': 'yearmonthdatehoursminutes',
      'type': 'temporal',
      'scale': {
        'nice': 'week',
      },
      'axis': {
        'title': 'Date',
      },
    },
    'color': {
      'field': 'state',
      'type': 'nominal',
      'scale': {
        'domain': ['failed', 'errored', 'canceled', 'passed'],
        'range': ['#d62728', '#ff7f0e', '#1f77b4', '#5ab43c'],
      },
    },
  },
};

getBuilds('engine262/engine262')
  .then((builds) => {
    schema.data.values = builds
      .filter((b) => schema.encoding.color.scale.domain.includes(b.state))
      .map((b) => ({
        state: b.state,
        finished_at: b.finished_at,
        duration: b.duration / 60,
      }));
    vegaEmbed('#view', schema);
  });
