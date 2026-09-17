import path from 'path'
import { analyzeScreenshot, shutdownImageAnalyzer } from './image-analyzer.ts'
import logger from './modules/logger.ts'
import { getAppDataDir } from './modules/app-paths.ts'

const q4Path = path.join(getAppDataDir(), 'screenshots', 'q4.png')
logger.info('🔍 分析q4.png（未被检测的真实海克斯截图）\n')

try {
    const result = await analyzeScreenshot(q4Path)
    logger.info('Analysis result:', result)
    logger.info('\n✅ 分析完成')
} finally {
    await shutdownImageAnalyzer()
}
