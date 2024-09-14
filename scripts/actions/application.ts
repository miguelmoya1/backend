import ejs from 'ejs';
import inquirer from 'inquirer';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ActionType = {
  Command: 'command',
  Query: 'query',
  Saga: 'saga',
};

const ActionsTypePlural = {
  [ActionType.Command]: 'commands',
  [ActionType.Query]: 'queries',
  [ActionType.Saga]: 'sagas',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const getNamePrompt = async (type: string) => {
  let { response } = await inquirer.prompt<{ response: string }>([
    {
      type: 'input',
      name: 'response',
      message: `Name of the ${type}:`,
    },
  ]);

  return response;
};

const createWithTemplate = async (name: string, type: string) => {
  const pathToCreate = join(process.cwd(), `src/application/${ActionsTypePlural[type]}`, `${name}.ts`);

  const pathTemplate = join(process.cwd(), 'templates/application.ts.ejs');

  const template = await readFile(pathTemplate, 'utf-8');

  const content = ejs.render(template, { name: capitalize(name), type: capitalize(type) });

  await writeFile(pathToCreate, content);
};

const executeCommand = async (type: string, name: string) => {
  try {
    let exists = false;

    try {
      await readFile(join(process.cwd(), `src/application/${ActionsTypePlural[type]}`, `${name}.ts`));
      exists = true;
    } catch (error) {
      exists = false;
    }

    if (exists) {
      console.error(`The ${type} ${name} already exists`);
      return;
    }

    await createWithTemplate(name, type);
    console.log(`${capitalize(type)} ${name} created successfully`);
  } catch (error) {
    console.error(`An error occurred while creating the ${type}:`, error);
  }
};

export const createCommandFile = async (name?: string) => {
  if (!name) {
    name = await getNamePrompt(ActionType.Command);
  }

  await executeCommand(ActionType.Command, name);
};

export const createQueryFile = async (name?: string) => {
  if (!name) {
    name = await getNamePrompt(ActionType.Query);
  }

  await executeCommand(ActionType.Query, name);
};

export const createSagaFile = async (name?: string) => {
  if (!name) {
    name = await getNamePrompt(ActionType.Saga);
  }

  await executeCommand(ActionType.Saga, name);
};
