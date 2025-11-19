import { Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec );

export const runMigrate = async (req: Request, res: Response) => {
  try {
    console.log('🔄 Executando migrations do Prisma...');

    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');

    console.log('✅ Migrations executadas com sucesso!');
    console.log('stdout:', stdout);
    if (stderr) console.log('stderr:', stderr);

    res.status(200).json({
      success: true,
      message: '✅ Migrations executadas com sucesso!',
      output: stdout,
    });
  } catch (error: any) {
    console.error('❌ Erro ao executar migrations:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migrations',
      error: error.message,
      output: error.stdout,
    });
  }
};
