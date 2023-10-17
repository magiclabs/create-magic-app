export default abstract class BaseScaffold {
  public abstract templateName: string;
  public abstract source: string | string[];
  public abstract installationCommand: ExecaCommand;
  public abstract startCommand: ExecaCommand;
}

export type ExecaCommand = { command: string; args: string[] };
