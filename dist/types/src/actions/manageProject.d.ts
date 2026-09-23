export type TestTypeId = 'e2e' | 'unit';
export declare function buildProject(): Promise<void>;
export declare function publishProject(): Promise<void>;
export declare function releaseProject(): Promise<void>;
export declare function syncProjectWithGitHub(): Promise<void>;
export declare function testProject(testTypeIds?: TestTypeId[], isCoverageMeasured?: boolean): Promise<void>;
