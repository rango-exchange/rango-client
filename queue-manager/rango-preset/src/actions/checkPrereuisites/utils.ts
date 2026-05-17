import type { PendingSwapStep, TransactionPrerequisiteType } from 'rango-types';

export const checkIsPrerequisiteAlreadyMet = (
  prerequisiteInfo: {
    prerequisiteType: TransactionPrerequisiteType;
    prerequisiteIndex: number;
  },
  step: PendingSwapStep
): boolean => {
  const prerequisiteResult = step.prerequisiteResults?.find(
    (prerequisiteResult) =>
      prerequisiteResult.prerequisiteIndex ===
        prerequisiteInfo.prerequisiteIndex &&
      prerequisiteResult.prerequisiteType === prerequisiteInfo.prerequisiteType
  );
  if (prerequisiteResult?.status === 'success') {
    return true;
  }
  return false;
};
