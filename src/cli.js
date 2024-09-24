#! /usr/bin/env node

import { Command } from 'commander';
import os from 'os';
import fs from 'fs';
import open from 'open';
import fetch from 'node-fetch';

const program = new Command();

program.name('My CLI').description('A little CLI to help my computer life');

const filename = `${os.homedir()}/.cli-config.json`;
const CONFIG = JSON.parse(fs.readFileSync(filename).toString());

program
  .command('todo')
  .description('Add a new todo things App')
  .argument('<todo>', 'todo text to add')
  .option('-t, --today', 'is this for today?')
  .action((todo, options) => {
    let url = `ticktick://x-callback-url/v1/add_task?title=${encodeURIComponent(
      todo
    )}`;
    if (options.today) {
      const offset = 1000 * 60 * 60 * 9;
      const koreaNow = new Date(new Date().getTime() + offset)
        .toISOString()
        .split('T')[0];
      const today = koreaNow + 'T18:00:00.000';

      url += `&startDate=${encodeURIComponent(today)}&allDay=true`;
    }
    open(url);
  });

program
  .command('show-todo')
  .description('Show all todo things App')
  .option('-t, --today', 'show today todos')
  .action((options) => {
    let url = 'ticktick://v1/show';
    if (options.today) {
      url += '?smartlist=today';
    } else {
      url += '?smartlist=all';
    }
    open(url);
  });

program
  .command('discord')
  .description('Send a message to my discord server')
  .argument('<message>', 'message to send')
  .action(async (message, options) => {
    await fetch(CONFIG.discord_webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });
    console.log('sending message to discord!', { message, options });
  });

program.parse();
