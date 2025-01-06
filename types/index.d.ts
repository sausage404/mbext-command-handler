/**
 * @fileoverview
 * Type definitions for @mbext/command-handler
 * See https://github.com/iduckphone/mbext-command-handler for more details.
 *
 * @license GNU General Public License v3
 *
 * @author [sausage404] <parinya24dev@gmail.com>
 *
 * This file contains type definitions for the @mbext/command-handler JavaScript library.
 * It provides TypeScript types for the library's public API.
 * 
 * To use these types, include this file in your TypeScript project and ensure
 * your TypeScript compiler is configured to recognize `.d.ts` files.
 */

import { Player } from "@minecraft/server"

/**
 * @enum {number}
 * Represents the available argument types in the command system
 */
export enum ArgumentType {
    /** String value argument type */
    String = 0,
    /** Numeric value argument type */
    Number = 1,
    /** Boolean value argument type */
    Boolean = 2,
    /** Player reference argument type */
    Player = 3
}

/**
 * Type union of possible argument values.
 * @see ArgumentType
 */
export type ArgumentValue = string | number | boolean | Player;

/**
 * Maps ArgumentType enum values to their corresponding TypeScript types.
 * Used for type-safe argument value handling.
 */
export type ArgumentValueMapping = {
    [ArgumentType.String]: string;
    [ArgumentType.Number]: number;
    [ArgumentType.Boolean]: boolean;
    [ArgumentType.Player]: Player;
}

/**
 * Context object passed to command executors.
 * Contains all relevant information about the command execution.
 */
export interface CommandExecutionContext {
    /** Player who executed the command */
    player: Player;
    /** Chain of subcommands in execution order */
    subCommand: string[];
    /** Map of argument names to their parsed values */
    argument: Record<string, any>;
    /** Original command message string */
    originalMessage: string;
}

/**
 * Configuration object defining the command system structure.
 * @typeParam T - Type extending CommandConfig for custom commands
 */
export type CommandConfig = {
    /** Prefix that triggers command parsing */
    prefix: string;
    /** Map of command names to their definitions */
    commands: Record<string, {
        /** Command description */
        description: string;
        /** Map of argument names to their definitions */
        arguments?: Record<string, Argument>;
        /** Map of command/subcommand names to allowed argument names */
        allowedArguments?: Record<string, string[]>;
        /** Subcommand configuration */
        subCommands?: SubCommand;
    }>;
}

/**
 * Defines properties and requirements for a command argument.
 */
export type Argument = {
    /** Description of the argument's purpose */
    description: string;
    /** Expected argument type */
    type: ArgumentType;
    /** Whether argument must be provided */
    required?: boolean;
    /** Fallback value if argument omitted */
    default?: ArgumentValue;
}

/**
 * Defines structure and requirements for subcommands.
 * Supports nested subcommand hierarchies.
 */
export type SubCommand = {
    /** Whether subcommand must be provided */
    required?: boolean;
    /** Map of subcommand names to their configurations */
    commands: Record<string, {
        /** Nested subcommand configuration */
        subCommands?: SubCommand;
    }>;
}

/**
 * Function that validates an argument value.
 * @param value - Value to validate
 * @returns Promise or boolean indicating validity
 */
export type ArgumentValidator = (value: ArgumentValue) => Promise<boolean> | boolean;

/**
 * Function that executes a command.
 * @param context - Command execution context
 * @returns Promise or void
 */
export type CommandExecutor = (context: CommandExecutionContext) => Promise<void> | void;

/**
 * Main class for handling and executing commands.
 * @typeParam T - Type extending CommandConfig for custom commands
 */
export class CommandHandler<T extends CommandConfig> {
    /**
     * Creates a new command handler instance
     * @param commandConfig - Command system configuration
     * @throws {Error} If configuration is invalid
     */
    constructor(commandConfig: T);

    /**
     * Registers an executor function for a command
     * @param command - Command name from configuration
     * @param executor - Function to handle command execution
     * @throws {CommandError} If command not found or executor invalid
     */
    on(command: keyof T["commands"], executor: CommandExecutor): Promise<void>;

    /**
     * Registers a validator for a command argument
     * @param command - Command name
     * @param argumentName - Argument to validate
     * @param validator - Validation function 
     */
    validate<C extends keyof T["commands"], A extends keyof T["commands"][C]["arguments"]>(
        command: C,
        argumentName: A,
        validator: ArgumentValidator
    ): Promise<void>;

    /**
     * Verifies if a message is a valid command
     * @param messageContent - Message to verify
     * @returns True if message is a valid command
     */
    verify(messageContent: string): Promise<boolean>;

    /**
     * Executes a command string
     * @param messageContent - Command message to execute
     * @param player - Player executing the command
     * @returns Execution context with parsed arguments
     * @throws {CommandError} If command execution fails
     */
    run(messageContent: string, player: Player): Promise<CommandExecutionContext>;
}

/**
 * Error class for command-related errors
 */
export class CommandError extends Error {
    /**
     * Creates a new command error
     * @param type - Type of error that occurred
     * @param message - Error message
     * @param details - Additional error details
     */
    constructor(
        type: 'INVALID_SYNTAX' | 'INVALID_ARGUMENT' | 'INVALID_SUBCOMMAND' | 'PERMISSION_DENIED' | 'EXECUTION_ERROR',
        message: string,
        details?: any
    );
}