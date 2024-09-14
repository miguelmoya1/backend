#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import { createCommandFile, createQueryFile, createSagaFile } from './actions/application.ts';
import { checkStructure, createStructure } from './actions/structure.ts';

const createChoose = async (type?: string, name?: string) => {
  if (!type) {
    const { choose } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choose',
        message: 'What do you want to create?',
        choices: ['Command', 'Query', 'Saga'],
      },
    ]);

    type = choose;
  }

  switch (type) {
    case 'command':
      console.log('Creating command...');
      await createCommandFile(name);
      break;
    case 'query':
      await createQueryFile(name);
      console.log('Creating query...');
      break;
    case 'saga':
      await createSagaFile(name);
      console.log('Creating saga...');
      break;
  }
};

const program = new Command();

program.version('0.0.1');

program.action(async () => {
  const structureIsOk = await checkStructure();

  if (!structureIsOk) {
    console.log('The structure of the project is not correct.');

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Do you want to create the structure?',
        default: true,
      },
    ]);

    if (confirm) {
      console.log('Creating structure...');
      await createStructure();
    }
  }
});

program.action(async () => {
  createChoose();
});

program
  .command('create [type] [name]')
  .description('Create a new file')
  .action(async (type, name) => {
    createChoose(type, name);
  });

program.parse(process.argv);
