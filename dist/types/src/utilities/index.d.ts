import { Dirent, ObjectEncodingOptions, Stats } from 'node:fs';
interface ModuleTypeConfig {
    idPrefix: string;
    typeId: 'app' | 'api' | 'connector' | 'context' | 'development' | 'engine' | 'eslint' | 'kb' | 'presenter' | 'recipe' | 'resources' | 'shared' | 'tool';
    isPublished: boolean;
    uploadGroupName: 'connectors' | 'contexts' | 'engine' | 'presenters' | 'recipes' | 'tools' | undefined;
}
export declare function clearDirectory(label: string | undefined, directoryPath: string): Promise<void>;
export declare function getDirectoryEntries(path: string): Promise<string[]>;
export declare function getDirectoryEntries(path: string, options: ObjectEncodingOptions): Promise<Dirent[]>;
export declare function execCommand(label: string | undefined, command_: string, arguments_?: string[], outputFilePath?: string): Promise<void>;
export declare function spawnCommand(label: string, command: string, arguments_?: string[], isErrorIgnored?: boolean, isShellUsed?: boolean): Promise<void>;
export declare function spawnCommandToFile(label: string, command: string, arguments_: string[] | undefined, outputPath: string, isErrorIgnored?: boolean): Promise<void>;
export declare function readJSONFile<T>(path: string): Promise<T>;
export declare function readTextFile(path: string): Promise<string>;
export declare function removeFile(path: string): Promise<void>;
export declare function writeJSONFile(path: string, data: object): Promise<void>;
export declare function writeTextFile(path: string, data: string): Promise<void>;
export declare function logOperationHeader(text: string): void;
export declare function logOperationSuccess(message: string): void;
export declare function logStepHeader(text: string): void;
export declare function getModuleConfig(configId: string): ModuleTypeConfig;
export declare function getStatsForPath(path: string): Promise<Stats>;
export declare function extractOperationsFromSource<T>(source: string): T[];
export declare function substituteText(originalText: string, substituteText: string, startMarker: string, endMarker: string): string;
export {};
