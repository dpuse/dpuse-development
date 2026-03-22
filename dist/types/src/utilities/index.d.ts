import { Dirent, ObjectEncodingOptions, Stats } from 'node:fs';
export interface ModuleTypeConfig {
    idPrefix: string;
    typeId: 'app' | 'api' | 'connector' | 'context' | 'development' | 'engine' | 'eslint' | 'presenter' | 'resources' | 'shared' | 'tool';
    isPublished: boolean;
    uploadGroupName: 'connectors' | 'contexts' | 'engine' | 'presenters' | 'tools' | undefined;
}
export declare function clearDirectory(directoryPath: string): Promise<void>;
export declare function getDirectoryEntries(path: string): Promise<string[]>;
export declare function getDirectoryEntries(path: string, options: ObjectEncodingOptions): Promise<Dirent[]>;
export declare function execCommand(label: string | undefined, command_: string, arguments_?: string[], outputFilePath?: string): Promise<void>;
export declare function spawnCommand(label: string, command: string, arguments_?: string[], ignoreErrors?: boolean, useShell?: boolean): Promise<void>;
export declare function extractOperationsFromSource<T>(source: string): T[];
export declare function getModuleConfig(configId: string): ModuleTypeConfig;
export declare function getStatsForPath(path: string): Promise<Stats>;
export declare function logOperationHeader(text: string): void;
export declare function logOperationSuccess(message: string): void;
export declare function logStepHeader(text: string): void;
export declare function readJSONFile<T>(path: string): Promise<T>;
export declare function readTextFile(path: string): Promise<string>;
export declare function removeFile(path: string): Promise<void>;
export declare function substituteContent(originalContent: string, substituteContent: string, startMarker: string, endMarker: string): string;
export declare function writeJSONFile(path: string, data: object): Promise<void>;
export declare function writeTextFile(path: string, data: string): Promise<void>;
