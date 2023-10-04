export default abstract class BaseScaffold {
  public abstract templateName: string;
  public abstract source: string | string[];
  public abstract installationCommand: string[];
  public abstract startCommand: string[];
}
