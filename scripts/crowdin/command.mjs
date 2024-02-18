import { PROJECT_ID, TOKEN } from "./constants.mjs";
import { 
  checkPreTranslateStatus, 
  getLanguageIds, 
  getMachineTranslationEngineID, 
  getSourceFileId, 
  sendPreTranslateRequest 
} from "./pretranslate.mjs";

const preTranslationOption = {
  method: 'mt',
  autoApproveOption: 'all',
  duplicateTranslations: false,
  skipApprovedTranslations: true,
  translateUntranslatedOnly: true,
  translateWithPerfectMatchOnly: false,
};


async function run() {
  console.log('🔨 Start pre-translation...');    

  if(!PROJECT_ID || !TOKEN){
    throw new CrowdinError('environments are not set correctly');
  }

  console.log('[1/5]', 'Get source file id');
  const sourceFileId = await getSourceFileId();

  console.log('[2/5]', 'Get target languages ids');
  const languageIds = await  getLanguageIds();
  
  console.log('[3/5]', 'Get machine translation engine id');
  const engineId = await getMachineTranslationEngineID();
  preTranslationOption.engineId = engineId ;

  console.log('[4/5]', 'Send pre-translate to crowdin');
  const preTranslationId = await sendPreTranslateRequest({ sourceFileId, languageIds, preTranslationOption });

  console.log('[5/5]', 'Check pre-translate status:',preTranslationId);
  const status = await checkPreTranslateStatus(preTranslationId);

  if (status === 'finished'){
    console.log('✅ Pre-translation finished!');    
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
