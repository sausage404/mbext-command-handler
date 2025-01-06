# Custom Command Handler for Minecraft Bedrock Deverlopment

[![npm version](https://badge.fury.io/js/%40mbext%2Fcommand-handler.svg)](https://badge.fury.io/js/%40mbext%2Fcommand-handler)

`@mbext/command-handler` is a library that allows you to create custom command handlers for Minecraft Bedrock development. It provides a simple and type-safe way to handle and execute commands in your scripts.

## Features

- Type-safe command handling with TypeScript
- Support for nested subcommands
- Argument validation and type conversion
- Error handling and validation
- Command execution with arguments and options

## Installation

To install @mbext/command-handler in your minecraft add-on project, you have two options:

### Option 1: Use the package manager

1. Open a terminal and navigate to your project's root directory.
2. Run the following command to install the package:

```bash
npx @mbext/project init
```

3. Choose dependencies addons in prompt `@mbext/command-handler`

### Option 2: Install via npm

1. Open a terminal and navigate to your project's root directory.
2. Run the following command to install the package:

```bash
npm i @mbext/command-handler
```

3. Use the module with [ESBuild](https://jaylydev.github.io/posts/bundle-minecraft-scripts-esbuild/) or [Webpack](https://jaylydev.github.io/posts/scripts-bundle-minecraft/)

### Option 3: Clone the repository

1. Open a terminal and navigate to your project's root directory.
2. Run the following command to clone the repository:

```bash
git clone https://github.com/sausage404/mbext-database.git
```

3. Copy the `index.ts` and `index.d.ts` or `index.js` file from the cloned repository into your project's scripts folder.

## Basic Usage

This a type for config arguments

```ts
export enum ArgumentType {
    String = 0,
    Number = 1,
    Boolean = 2,
    Player = 3
}
```

You can config command in file `command.config.json`.

```json
{
    "prefix": "!",
    "commands": {
      "give": {
        "description": "Give an item to a player",
        "arguments": {
          "player": {
            "description": "The player to give the item to",
            "type": 0
          },
          "item": {
            "description": "The item to give",
            "type": 0
          },
          "amount": {
            "description": "The amount of the item to give",
            "type": 1
          }
        },
        "allowedArguments": {
          "main": [
            "player",
            "item",
            "amount"
          ]
        }
      }
    }
}
```
When you config command in file `command.config.json`, you can use command like this

```ts
import { world } from '@minecraft/server'
import { CommandHandler } from '@mbext/command'
import commandConfig from './command.config.json'

const handler = new CommandHandler(commandConfig);

handler.validate("give", "item", (argument) => {
   if(!argument.item.startsWith("minecraft:")) 
      return false
   if(!argument.amount < 1)
      return false
   return true
})

handler.on("give", ({ player, argument }) => {
   const inventory = (player.getComponent("inventory") as EntityInventoryComponent);
   const container = inventory.container;
   const item = new ItemStack(argument.item, argument.amount)
   container?.addItem(item);
})

world.beforeEvent.chatSend.subscribe((data) => {
   const player = data.sender;
   const message = data.message;
   if(handler.verify(message)){
      event.cancel = true;
      handler.run(message, player);
   }
})
```

## License

@mbext/command-handler is released under the [GNU General Public License v3](https://github.com/sausage404/mbext-command-handler/blob/main/LICENSE).

## Issues

If you encounter any problems or have suggestions, please file an issue on the GitHub repository.