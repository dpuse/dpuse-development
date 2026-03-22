import { PackageJson } from 'type-fest';
import { ModuleConfig } from '@datapos/datapos-shared/component';
export declare function putState(): Promise<void>;
export declare function uploadDirectoryToR2(sourceDirectory: string, uploadDirectory: string): Promise<void>;
export declare function uploadModuleConfigToDO(configJSON: ModuleConfig): Promise<void>;
export declare function uploadModuleToR2(packageJSON: PackageJson, uploadDirectoryPath: string): Promise<void>;
