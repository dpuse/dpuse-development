import { Dirent, ObjectEncodingOptions, Stats } from 'node:fs';
export interface ModuleTypeConfig {
    idPrefix: string;
    typeId: 'app' | 'api' | 'connector' | 'context' | 'development' | 'engine' | 'eslint' | 'presenter' | 'resources' | 'shared' | 'tool';
    isPublish: boolean;
    uploadGroupName: 'connectors' | 'contexts' | 'engine' | 'presenters' | 'tools' | undefined;
}
export declare function clearDirectory(directoryPath: string): Promise<void>;
export declare function execCommand(label: string | undefined, command_: string, arguments_?: string[], outputFilePath?: string): Promise<void>;
export declare function extractOperationsFromSource<T>(source: string): T[];
/** Utilities - Get directory entries. */
export declare function getDirectoryEntries(path: string): Promise<string[]>;
export declare function getDirectoryEntries(path: string, options: ObjectEncodingOptions): Promise<Dirent[]>;
/** Utilities - Get module type identifier. */
export declare function getModuleConfig(configId: string): ModuleTypeConfig;
/** Utilities - Get stats for path. */
export declare function getStatsForPath(path: string): Promise<Stats>;
/** Utilities - Log operation header. */
export declare function logOperationHeader(text: string): void;
/** Utilities - Log operation success. */
export declare function logOperationSuccess(message: string): void;
/** Utilities - Log step header. */
export declare function logStepHeader(text: string): void;
/** Utilities - Read JSON file. */
export declare function readJSONFile<T>(path: string): Promise<T>;
export declare function readTextFile(path: string): Promise<string>;
/** Utilities - Remove file. */
export declare function removeFile(path: string): Promise<void>;
/** Utilities - Spawn command. */
export declare function spawnCommand(label: string, command: string, arguments_?: string[], ignoreErrors?: boolean, useShell?: boolean): Promise<void>;
/** Utilities - Substitute content. */
export declare function substituteContent(originalContent: string, substituteContent: string, startMarker: string, endMarker: string): string;
/** Utilities - Write JSON file. */
export declare function writeJSONFile(path: string, data: object): Promise<void>;
/** Utilities - Write text file. */
export declare function writeTextFile(path: string, data: string): Promise<void>;
