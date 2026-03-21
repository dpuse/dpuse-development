import { Dirent, ObjectEncodingOptions, Stats } from 'node:fs';
/** Interfaces/Types */
export interface ModuleTypeConfig {
    idPrefix: string;
    typeId: 'app' | 'api' | 'connector' | 'context' | 'development' | 'engine' | 'eslint' | 'presenter' | 'resources' | 'shared' | 'tool';
    isPublish: boolean;
    uploadGroupName: 'connectors' | 'contexts' | 'engine' | 'presenters' | 'tools' | undefined;
}
/** Utilities - Clear directory. */
declare function clearDirectory(directoryPath: string): Promise<void>;
/** Utilities - Extract operations from source. */
declare function extractOperationsFromSource<T>(source: string): T[];
/** TODO Utilities - Execute command. */
declare function execCommand(label: string | undefined, command_: string, arguments_?: string[], outputFilePath?: string): Promise<void>;
/** Utilities - Get directory entries. */
declare function getDirectoryEntries(path: string): Promise<string[]>;
declare function getDirectoryEntries(path: string, options: ObjectEncodingOptions): Promise<Dirent[]>;
/** Utilities - Get module type identifier. */
declare function getModuleConfig(configId: string): ModuleTypeConfig;
/** Utilities - Get stats for path. */
declare function getStatsForPath(path: string): Promise<Stats>;
/** Utilities - Log operation header. */
declare function logOperationHeader(text: string): void;
/** Utilities - Log operation success. */
declare function logOperationSuccess(message: string): void;
/** Utilities - Log step header. */
declare function logStepHeader(text: string): void;
/** Utilities - Read JSON file. */
declare function readJSONFile<T>(path: string): Promise<T>;
declare function readTextFile(path: string): Promise<string>;
/** Utilities - Remove file. */
declare function removeFile(path: string): Promise<void>;
/** Utilities - Spawn command. */
declare function spawnCommand(label: string, command: string, arguments_?: string[], ignoreErrors?: boolean, useShell?: boolean): Promise<void>;
/** Utilities - Substitute content. */
declare function substituteContent(originalContent: string, substituteContent: string, startMarker: string, endMarker: string): string;
/** Utilities - Write JSON file. */
declare function writeJSONFile(path: string, data: object): Promise<void>;
/** Utilities - Write text file. */
declare function writeTextFile(path: string, data: string): Promise<void>;
/** Exposures */
export { clearDirectory, execCommand, extractOperationsFromSource, getDirectoryEntries, getModuleConfig, getStatsForPath, logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, removeFile, spawnCommand, substituteContent, writeJSONFile, writeTextFile };
