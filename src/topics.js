import bank from '../spec/aufgabenbank.json' with { type: 'json' };

export const TOPICS = bank.topics;
export const topicFor = taskId => TOPICS.find(topic => topic.tasks.includes(taskId));
export const tasksFor = topic => topic.tasks.map(id => bank.tasks.find(task => task.id === id));
export const isRecall = step => ['anatomy_recall', 'term_fill'].includes(step.type);

// A fixed question fixes its focus model. Exploration remains possible for comparisons.
export function fixedFocus(step, taskId) {
  if (taskId !== 'T15') return null;
  if (step.ruleId === 'NEAR_SHAPE' || (step.type === 'single_choice' && /Du siehst nah/.test(step.prompt))) return false;
  if (step.type === 'single_choice' && /Sehen in die Ferne/.test(step.prompt)) return true;
  return null;
}
export function initialVisual(step, taskId) {
  if (taskId === 'T04') return /links/.test(step.prompt);
  if (taskId === 'T08') return /dunkler/.test(step.prompt);
  return fixedFocus(step, taskId) ?? false;
}
export function contextualStep(step, taskId, visual) {
  if (step.type !== 'single_choice') return step;
  let prompt, wanted, explanation;
  if (taskId === 'T04' && /Welches Ohr|Welcher Weg/.test(step.prompt)) {
    const side = visual ? 'link' : 'recht';
    prompt = `Der Hund ist ${visual ? 'links' : 'rechts'}. ${/Welches Ohr/.test(step.prompt) ? 'Welches Ohr erreicht der Schall meist zuerst?' : 'Zu welchem Ohr ist der Schallweg kürzer?'}`;
    wanted = option => option.text.toLowerCase().includes(side);
    explanation = `Der Schallweg zum ${side}en Ohr ist kürzer. Dort kommt der Schall meist früher an.`;
  }
  if (taskId === 'T08' && /Wie wird die Pupille/.test(step.prompt)) {
    prompt = `Es ist ${visual ? 'dunkler' : 'hell'}. Wie wird die Pupille?`;
    wanted = option => option.text.toLowerCase().includes(visual ? 'größer' : 'kleiner');
    explanation = visual ? 'Die Pupille wird größer. So kann mehr Licht ins Auge kommen.' : 'Die Pupille wird kleiner. So kommt weniger Licht ins Auge.';
  }
  if (taskId === 'T08' && /Was lässt eine kleinere Pupille/.test(step.prompt)) {
    prompt = `Was lässt eine ${visual ? 'größere' : 'kleinere'} Pupille ins Auge?`;
    wanted = option => option.text.toLowerCase().includes(visual ? 'mehr' : 'weniger');
    explanation = visual ? 'Eine größere Pupille lässt mehr Licht ins Auge.' : 'Eine kleinere Pupille lässt weniger Licht ins Auge.';
  }
  if (!wanted) return step;
  const correctOptionId = step.options.find(wanted).id;
  return { ...step, prompt, correctOptionId, feedbackCorrect: explanation, hints: ['Schau auf die Abbildung und die Situation in der Frage.', explanation], feedbackByOption: Object.fromEntries(step.options.map(option => [option.id, option.id === correctOptionId ? explanation : 'Schau noch einmal auf die Situation in der Frage.'])) };
}
