import { Core } from '@strapi/strapi';
import { Histogram } from 'prom-client';


const lifecycleDurationSeconds = new Histogram({
  name: 'lifecycle_duration_seconds',
  help: 'Tracks the duration of Strapi lifecycle events in seconds.',
  labelNames: ['model', 'event'],
  buckets: [
    0.001, // 1 ms
    0.005, // 5 ms
    0.01,  // 10 ms
    0.05,  // 50 ms
    0.1,   // 100 ms
    0.2,   // 200 ms
    0.5,   // 500 ms
    1,     // 1 second
    2,     // 2 seconds
    5,     // 5 seconds
    10,    // 10 seconds
    20,    // 20 seconds
    30,    // 30 seconds
    60     // 1 minute
  ]
});

function formatActionName(action: string): string {
  // Remove 'before' or 'after' from the start of the action name
  const modifiedAction = action.replace(/^(before|after)/, '');

  // Lowercase the first letter of the remaining string
  return modifiedAction.charAt(0).toLowerCase() + modifiedAction.slice(1);
}


export default ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.db!.lifecycles.subscribe((event) => {
    if (event.action.startsWith('before')) {
      const labels = {
        event: formatActionName(event.action),
        model: event.model.singularName,
      };

      event.state.end = lifecycleDurationSeconds.startTimer(labels);
    }

    if (event.action.startsWith('after') && event.state.end) {
      (event.state.end as (labels?: Partial<Record<"model" | "hook", string | number>>) => number)()
    }
  });
};
